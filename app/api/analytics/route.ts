import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";
import { protos } from "@google-analytics/data";

// 필요한 타입들만 깔끔하게 추출합니다.
type RunReportResponse = protos.google.analytics.data.v1beta.IRunReportResponse;
type Row = protos.google.analytics.data.v1beta.IRow;

const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export async function GET() {
  const propertyId = process.env.GA_PROPERTY_ID;

  if (!propertyId) {
    return NextResponse.json(
      { error: "Property ID is missing" },
      { status: 400 },
    );
  }

  try {
    // 1. any 대신 실제 라이브러리가 반환하는 튜플 구조를 명시합니다.
    // 두 번째, 세 번째 인자는 각각 요청(Request) 정보와 메타데이터인데, 여기선 필요 없으므로 빈 객체 타입으로 처리합니다.
    const [response] = (await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        { startDate: "2020-01-01", endDate: "today" },
        { startDate: "today", endDate: "today" },
      ],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
    })) as [RunReportResponse, unknown, unknown];

    // 2. 전체 접속자 수 합산
    const totalVisitors =
      response.rows?.reduce((acc: number, row: Row) => {
        const value = row.metricValues?.[0]?.value;
        return acc + (value ? Number(value) : 0);
      }, 0) || 0;

    // 3. 오늘 접속자 수 처리
    const todayDateStr = new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Seoul",
    })
      .format(new Date())
      .replace(/\. /g, "")
      .replace(/\./g, ""); // "20260227" 형식

    const todayRow = response.rows?.find(
      (row: Row) => row.dimensionValues?.[0]?.value === todayDateStr,
    );

    const todayVisitors = Number(todayRow?.metricValues?.[0]?.value || 0);

    return NextResponse.json({
      total: totalVisitors,
      today: todayVisitors,
    });
  } catch (error: unknown) {
    console.error("GA API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
