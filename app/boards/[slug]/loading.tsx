import { LoadingState } from "@/components/design-system";

export default function BoardLoadingPage() {
  return (
    <div className="space-y-3">
      <LoadingState title="글 목록을 불러오는 중입니다" body="지역, 직종, 모집 상태를 확인하고 있습니다." />
      <section className="board-panel p-3">
        <div className="h-12 animate-pulse bg-slate-100" />
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <div className="h-11 animate-pulse bg-slate-100" />
          <div className="h-11 animate-pulse bg-slate-100" />
          <div className="h-11 animate-pulse bg-slate-100" />
        </div>
      </section>
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-32 animate-pulse border border-slate-200 bg-slate-100" />
      ))}
    </div>
  );
}
