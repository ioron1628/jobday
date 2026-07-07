import { EmptyState } from "@/components/design-system";
import { PostForm } from "@/components/post-form";
import { getBoards, getRegions, getTrades } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function WritePage({
  searchParams
}: {
  searchParams?: Promise<{ board?: string }>;
}) {
  const [boards, regions, trades] = await Promise.all([getBoards(), getRegions(), getTrades()]);
  const resolvedSearchParams = await searchParams;
  const boardSlug = resolvedSearchParams?.board ?? boards[0]?.slug;

  if (!boards.length) {
    return (
      <EmptyState
        title="글쓰기 준비가 아직 끝나지 않았습니다"
        body="게시판 기본 데이터가 준비된 뒤 글을 올릴 수 있습니다."
        href="/boards"
        actionLabel="게시판 보기"
      />
    );
  }

  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-2xl font-bold leading-[1.3] text-ink">글쓰기</h1>
        <p className="mt-1 text-sm font-medium leading-5 text-muted">조건 직접 확인이 필요한 커뮤니티 정보 글로 작성합니다.</p>
      </section>
      <PostForm boards={boards} regions={regions} trades={trades} initialBoardSlug={boardSlug} />
    </div>
  );
}
