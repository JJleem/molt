import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";
// 라이브러리 내부에서 사용하는 응답 데이터 타입을 가져옵니다.
import { protos } from "@google-analytics/data";

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
    // response의 타입을 명시적으로 지정합니다.
    const [response]: [
      protos.google.analytics.data.v1beta.IRunReportResponse,
      any,
      any,
    ] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        { startDate: "2020-01-01", endDate: "today" },
        { startDate: "today", endDate: "today" },
      ],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
    });

    // 1. 전체 접속자 수 합산
    // 각 row와 metricValue에 대한 안전한 접근을 위해 타입을 활용합니다.
    const totalVisitors =
      response.rows?.reduce(
        (acc: number, row: protos.google.analytics.data.v1beta.IRow) => {
          const value = row.metricValues?.[0]?.value;
          return acc + (value ? Number(value) : 0);
        },
        0,
      ) || 0;

    // 2. 오늘 접속자 수 처리
    const todayDateStr = new Date()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "");

    const todayRow = response.rows?.find(
      (row: protos.google.analytics.data.v1beta.IRow) =>
        row.dimensionValues?.[0]?.value === todayDateStr,
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
