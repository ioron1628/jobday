import { notFound } from "next/navigation";
import { PostForm } from "@/components/post-form";
import { getBoards, getPost, getRegions, getTrades } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const [post, boards, regions, trades] = await Promise.all([getPost(resolvedParams.id), getBoards(), getRegions(), getTrades()]);
  if (!post) notFound();

  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-2xl font-bold leading-[1.3] text-ink">글 수정</h1>
        <p className="mt-1 text-sm font-medium leading-5 text-muted">작성자 본인 또는 관리자만 수정할 수 있습니다.</p>
      </section>
      <PostForm boards={boards} regions={regions} trades={trades} initialPost={post} />
    </div>
  );
}
