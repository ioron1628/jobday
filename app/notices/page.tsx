import { EmptyState } from "@/components/empty-state";
import { formatDate } from "@/lib/format";
import { getNotices } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NoticesPage() {
  const notices = await getNotices();

  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-2xl font-bold leading-[1.3] text-slate-950">공지사항</h1>
        <p className="mt-1 text-sm font-medium leading-5 text-slate-600">이용 규칙, 신고 기준, 운영 안내를 확인합니다.</p>
      </section>

      {notices.length ? (
        <div className="space-y-2">
          {notices.map((notice) => (
            <article key={notice.id} className="board-panel rounded-md p-4">
              <h2 className="text-xl font-bold leading-[1.35] text-slate-950">{notice.title}</h2>
              <p className="mt-2 whitespace-pre-wrap text-base font-normal leading-7 text-slate-700">{notice.body}</p>
              <p className="mt-3 text-[12px] font-medium leading-4 text-slate-500">{formatDate(notice.created_at)}</p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="등록된 공지가 없습니다" body="운영 공지가 올라오면 이곳에서 확인할 수 있습니다." href="/boards" actionLabel="게시판 보기" />
      )}
    </div>
  );
}
