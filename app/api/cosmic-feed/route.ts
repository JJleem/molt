import { NextResponse } from "next/server";

// Cosmic Hustle 블로그의 최근 발행 글을 서버사이드로 가져온다 (라이브 증거).
// 장애 내성: 15초 타임아웃 + try/catch + 빈 폴백 — 블로그/백엔드가 죽어도 포폴은 멀쩡.
// 백엔드 HTTPS 이전 시 COSMIC_API_BASE 환경변수만 바꾸면 됨.

const API_BASE = process.env.COSMIC_API_BASE ?? "http://3.36.239.214:8000";
const SITE = process.env.COSMIC_SITE ?? "https://cosmic-hustle.ai.kr";

export const revalidate = 300; // 5분 캐시

// 백엔드는 타임존 표시 없는 UTC(naive datetime)를 준다 → Z를 붙여 UTC로 고정.
// 안 붙이면 클라이언트가 로컬(KST)로 해석해 9시간 과거로 밀린다.
function toUtcIso(s: string): string {
  if (!s) return s;
  return /[zZ]$|[+-]\d{2}:?\d{2}$/.test(s) ? s : `${s}Z`;
}

interface BackendPost {
  slug: string;
  agent_id: string;
  title: string;
  published_at: string;
  view_count?: number;
  comment_count?: number;
  likes?: number;
  thumbnail_url?: string;
  excerpt?: string;
  reading_time_minutes?: number;
}

const LIMIT = 8;

// 썸네일을 HTTPS 공개 사이트 경유로 바꾼다 (백엔드 HTTP는 HTTPS 포폴에서 mixed-content 차단).
function httpsThumb(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/\/static\/blog\/[^?#]+/);
  return m ? `${SITE}${m[0]}` : null;
}

// 마크다운/구분선 찌꺼기를 걷어내고 한 줄 미리보기로.
function cleanExcerpt(s?: string): string {
  if (!s) return "";
  return s.replace(/[#*_>`-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
}

export async function GET() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);

  try {
    // 글 목록 + 사이트 통계(누적/오늘 조회수)를 병렬로.
    const [res, statsRes] = await Promise.all([
      fetch(`${API_BASE}/api/blog/posts?page=1&limit=${LIMIT}`, {
        signal: controller.signal,
        next: { revalidate: 300 },
      }),
      fetch(`${API_BASE}/api/blog/stats`, {
        signal: controller.signal,
        next: { revalidate: 300 },
      }).catch(() => null),
    ]);
    if (!res.ok) throw new Error(`upstream ${res.status}`);

    const data = (await res.json()) as { posts?: BackendPost[]; total?: number };
    const statsJson = statsRes && statsRes.ok
      ? ((await statsRes.json()) as { today?: number; total?: number })
      : {};
    const posts = (data.posts ?? []).slice(0, LIMIT).map((p) => ({
      title: p.title,
      url: `${SITE}/${p.slug}`,
      date: toUtcIso(p.published_at),
      agentId: (p.agent_id || "").split("+")[0], // 조합 글은 첫 에이전트로
      views: p.view_count ?? 0,
      comments: p.comment_count ?? 0,
      likes: p.likes ?? 0,
      readingTime: p.reading_time_minutes ?? 0,
      thumbnail: httpsThumb(p.thumbnail_url),
      excerpt: cleanExcerpt(p.excerpt),
    }));

    const stats = {
      posts: data.total ?? posts.length, // 누적 발행 글 수
      views: statsJson.total ?? 0, // 누적 조회수
      today: statsJson.today ?? 0, // 오늘 조회수
    };

    return NextResponse.json({ posts, total: stats.posts, stats });
  } catch {
    // 폴백: 빈 목록 + null 통계 (UI는 정적 폴백값 유지)
    return NextResponse.json({ posts: [], total: 0, stats: null });
  } finally {
    clearTimeout(timer);
  }
}
