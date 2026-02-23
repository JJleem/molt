import Link from "next/link";
import LiveVisitorBadge from "@/components/analytics/LiveVisitorBadge";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* 왼쪽: 로고 또는 이름 */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-slate-900 hover:text-indigo-600 transition-colors"
        >
          JJleem<span className="text-indigo-600">.</span>dev
        </Link>

        {/* 오른쪽: 실시간 뱃지 (나중에 다크모드 버튼 등을 옆에 추가하기 좋습니다) */}
        <div className="flex items-center gap-4">
          <LiveVisitorBadge />
        </div>
      </div>
    </header>
  );
}
