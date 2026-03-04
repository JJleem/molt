import { createClient } from "redis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // 1. REDIS_URL을 사용하는 클라이언트 준비
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on("error", (err) => console.error("Redis Client Error", err));

  try {
    // 2. DB 연결
    await client.connect();

    const todayDateStr = new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Seoul",
    })
      .format(new Date())
      .replace(/\. /g, "")
      .replace(/\./g, "");

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // 3. 값 조회 (redis 패키지는 문자열로 반환하므로 Number로 변환)
    let total = Number(await client.get("visitors:total")) || 0;
    let today = Number(await client.get(`visitors:today:${todayDateStr}`)) || 0;

    // 4. 새 방문자면 DB 값 +1 증가
    if (action === "increment") {
      total = await client.incr("visitors:total");
      today = await client.incr(`visitors:today:${todayDateStr}`);

      // 메모리 관리를 위해 오늘 날짜 키는 48시간 뒤 자동 삭제되게 설정
      await client.expire(`visitors:today:${todayDateStr}`, 60 * 60 * 24 * 2);
    }

    // 5. 서버리스 환경 메모리 누수 방지를 위해 연결 안전하게 종료
    if (client.isOpen) await client.quit();

    return NextResponse.json({ total, today });
  } catch (error) {
    console.error("Redis Error:", error);
    if (client.isOpen) await client.quit();
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}
