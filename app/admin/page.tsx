import { AdminDashboard } from "@/components/admin-dashboard";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-2xl font-bold leading-[1.3] text-ink">관리자 페이지</h1>
        <p className="mt-1 text-sm font-medium leading-5 text-muted">신고, 숨김, 마감, 상단고정, 공지, 광고 위치를 관리합니다.</p>
      </section>
      <AdminDashboard />
    </div>
  );
}
