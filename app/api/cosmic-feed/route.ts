import { NextResponse } from "next/server";

// Cosmic Hustle 블로그의 최근 발행 글을 서버사이드로 가져온다 (라이브 증거).
// 장애 내성: 15초 타임아웃 + try/catch + 빈 폴백 — 블로그/백엔드가 죽어도 포폴은 멀쩡.
// 백엔드 HTTPS 이전 시 COSMIC_API_BASE 환경변수만 바꾸면 됨.

const API_BASE = process.env.COSMIC_API_BASE ?? "http://3.36.239.214:8000";
const SITE = process.env.COSMIC_SITE ?? "https://blog.cosmic-hustle.com";

export const revalidate = 300; // 5분 캐시

interface BackendPost {
  slug: string;
  agent_id: string;
  title: string;
  published_at: string;
  view_count?: number;
  comment_count?: number;
}

export async function GET() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(`${API_BASE}/api/blog/posts?page=1&limit=5`, {
      signal: controller.signal,
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);

    const data = (await res.json()) as { posts?: BackendPost[]; total?: number };
    const posts = (data.posts ?? []).slice(0, 5).map((p) => ({
      title: p.title,
      url: `${SITE}/${p.slug}`,
      date: p.published_at,
      agentId: (p.agent_id || "").split("+")[0], // 조합 글은 첫 에이전트로
      views: p.view_count ?? 0,
    }));

    return NextResponse.json({ posts, total: data.total ?? posts.length });
  } catch {
    // 폴백: 빈 목록 (UI는 조용히 숨김)
    return NextResponse.json({ posts: [], total: 0 });
  } finally {
    clearTimeout(timer);
  }
}
