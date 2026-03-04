import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";
import { protos } from "@google-analytics/data";

// 🌟 [핵심 해결책] Next.js 캐싱 강제 무효화! 매번 새로운 데이터를 가져오게 합니다.
export const dynamic = "force-dynamic";

type RunReportResponse = protos.google.analytics.data.v1beta.IRunReportResponse;
type Row = protos.google.analytics.data.v1beta.IRow;

const client = new BetaAnalyticsDataClient({
  credentials: {
    // 🚨 NEXT_PUBLIC_ 절대 쓰지 마세요! 서버에서만 안전하게 읽어야 합니다.
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export async function GET() {
  const propertyId = process.env.GA_PROPERTY; // 여기도 수정!

  if (!propertyId) {
    return NextResponse.json(
      { error: "Property ID is missing" },
      { status: 400 },
    );
  }

  try {
    const [response] = (await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        { startDate: "2020-01-01", endDate: "today" },
        { startDate: "today", endDate: "today" },
      ],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
    })) as [RunReportResponse, unknown, unknown];

    const totalVisitors =
      response.rows?.reduce((acc: number, row: Row) => {
        const value = row.metricValues?.[0]?.value;
        return acc + (value ? Number(value) : 0);
      }, 0) || 0;

    const todayDateStr = new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Seoul",
    })
      .format(new Date())
      .replace(/\. /g, "")
      .replace(/\./g, "");

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
