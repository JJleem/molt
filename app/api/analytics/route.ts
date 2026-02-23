import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";

// GA4 클라이언트 초기화
const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"), // 줄바꿈 처리 필수
  },
});

export async function GET() {
  const propertyId = process.env.GA_PROPERTY_ID;

  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        { startDate: "2020-01-01", endDate: "today" }, // 전체 기간 (가입일 이후 넉넉히)
        { startDate: "today", endDate: "today" }, // 오늘
      ],
      // 'date'를 기준으로 데이터를 나누어 가져옵니다.
      dimensions: [{ name: "date" }],
      // 'activeUsers'(활성 사용자 수) 지표를 가져옵니다.
      metrics: [{ name: "activeUsers" }],
    });

    // 1. 전체 접속자 수 합산
    const totalVisitors =
      response.rows?.reduce((acc, row) => {
        return acc + Number(row.metricValues?.[0]?.value || 0);
      }, 0) || 0;

    // 2. 오늘 접속자 수 (마지막 행이 오늘 데이터일 확률이 높음)
    // 참고: GA4는 오늘 데이터 반영에 수 시간의 지연이 있을 수 있습니다.
    const todayDateStr = new Date()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "");
    const todayRow = response.rows?.find(
      (row) => row.dimensionValues?.[0]?.value === todayDateStr,
    );
    const todayVisitors = Number(todayRow?.metricValues?.[0]?.value || 0);

    return NextResponse.json({
      total: totalVisitors,
      today: todayVisitors,
    });
  } catch (error: any) {
    console.error("GA API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
