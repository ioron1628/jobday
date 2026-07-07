import { notFound } from "next/navigation";
import { PostForm } from "@/components/post-form";
import { getBoard, getBoards, getRegions, getTrades } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function BoardNewPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const [board, boards, regions, trades] = await Promise.all([
    getBoard(resolvedParams.slug),
    getBoards(),
    getRegions(),
    getTrades()
  ]);

  if (!board) notFound();

  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-2xl font-bold leading-[1.3] text-ink">{board.name} 글쓰기</h1>
        <p className="mt-1 text-sm font-medium leading-5 text-muted">조건 직접 확인이 필요한 커뮤니티 정보 글로 작성합니다.</p>
      </section>
      <PostForm boards={boards} regions={regions} trades={trades} initialBoardSlug={board.slug} />
    </div>
  );
}
