import { BoardGrid } from "@/components/board-grid";
import { BoardIconFrame, ButtonLink, EmptyState, Icon, SectionHeader } from "@/components/design-system";
import { getBoards } from "@/lib/data";

export const dynamic = "force-dynamic";

const quickBoardSlugs = ["work-raid", "remote-raid", "dimodo", "available-today", "tool-market", "materials"];

export default async function BoardsPage() {
  const boards = await getBoards();
  const quickBoards = boards.filter((board) => quickBoardSlugs.includes(board.slug));

  const groups = [
    { label: "일거리", categories: ["work", "company"] },
    { label: "장터", categories: ["market"] },
    { label: "커뮤니티", categories: ["free", "guide", "question", "notice"] }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 border border-line-strong bg-white p-3">
        <div>
          <h1 className="text-2xl font-bold leading-[1.3] text-ink">게시판</h1>
          <p className="mt-1 text-base font-medium text-muted">작업, 거래, 질문, 입문 게시판과 보조 카테고리</p>
        </div>
        <ButtonLink href="/write" className="shrink-0" variant="primary" size="lg">
          <Icon name="pencil" className="mr-1.5 h-4 w-4" />
          글쓰기
        </ButtonLink>
      </div>

      {quickBoards.length ? (
        <section className="space-y-2">
          <SectionHeader title="바로 찾기" />
          <div className="grid grid-cols-3 gap-2">
            {quickBoards.map((board) => (
              <ButtonLink key={board.id} href={`/boards/${board.slug}`} className="min-h-12 px-2 text-center text-sm leading-5">
                <BoardIconFrame board={board} size="sm" className="mr-1.5" />
                {board.name}
              </ButtonLink>
            ))}
          </div>
        </section>
      ) : null}

      {boards.length ? (
        groups.map((group) => {
          const groupBoards = boards.filter((board) => group.categories.includes(board.category));
          if (!groupBoards.length) return null;

          return (
            <section key={group.label} className="space-y-2">
              <SectionHeader title={group.label} />
              <BoardGrid boards={groupBoards} />
            </section>
          );
        })
      ) : (
        <EmptyState title="게시판을 불러오지 못했습니다" body="잠시 후 다시 열어보거나 홈으로 돌아가 다른 화면을 확인해보세요." href="/" actionLabel="홈으로 이동" />
      )}
    </div>
  );
}
