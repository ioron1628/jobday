import { LoadingState } from "@/components/design-system";

export default function PostDetailLoadingPage() {
  return (
    <div className="space-y-3">
      <LoadingState title="글을 불러오는 중입니다" body="핵심 조건, 본문, 댓글을 확인하고 있습니다." />
      <section className="border border-line-strong bg-white p-3">
        <div className="h-8 w-4/5 animate-pulse bg-soft" />
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-16 animate-pulse border border-line bg-soft" />
          ))}
        </div>
      </section>
    </div>
  );
}
