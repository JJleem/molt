// app/api/github/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 },
    );
  }

  // GitHub Personal Access Token (없으면 시간당 60회 제한, 있으면 5000회)
  // .env 파일에 GITHUB_TOKEN을 발급받아 넣는 것을 권장합니다.
  const headers: Record<string, string> = process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {};

  try {
    // 1. 유저 기본 정보 (Repositories 수 등)
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
    });
    const userData = await userRes.json();

    // 2. PR 및 이슈 총합 (Search API 활용)
    const prRes = await fetch(
      `https://api.github.com/search/issues?q=author:${username}+type:pr`,
      { headers },
    );
    const prData = await prRes.json();

    const issueRes = await fetch(
      `https://api.github.com/search/issues?q=author:${username}+type:issue`,
      { headers },
    );
    const issueData = await issueRes.json();

    // 3. 커밋 수 (Search API로 단순 합산 - *참고: public 레포 기준*)
    const commitRes = await fetch(
      `https://api.github.com/search/commits?q=author:${username}`,
      {
        headers: { ...headers, Accept: "application/vnd.github.cloak-preview" },
      },
    );
    const commitData = await commitRes.json();

    return NextResponse.json({
      repos: userData.public_repos || 0,
      prsAndIssues: (prData.total_count || 0) + (issueData.total_count || 0),
      commits: commitData.total_count || 0,
      followers: userData.followers || 0, // Streak 대신 넣기 좋은 지표
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 },
    );
  }
}
