import { notFound } from "next/navigation";
import { AdminDashboard, type AdminSection } from "@/components/admin-dashboard";

export const dynamic = "force-dynamic";

const sectionTitles: Record<AdminSection, { title: string; description: string }> = {
  overview: {
    title: "관리자 페이지",
    description: "신고, 숨김, 마감, 상단고정, 공지, 광고 위치를 관리합니다."
  },
  posts: {
    title: "게시글 관리",
    description: "게시글 숨김, 숨김해제, 작업 구인글 마감 처리를 합니다."
  },
  reports: {
    title: "신고 관리",
    description: "신고 내용을 확인하고 게시글 숨김 또는 댓글 삭제를 처리합니다."
  },
  comments: {
    title: "댓글 관리",
    description: "문제 댓글을 삭제 상태로 처리합니다."
  },
  users: {
    title: "유저 관리",
    description: "차단과 차단해제를 비공개 운영 기준으로 처리합니다."
  },
  notices: {
    title: "공지 관리",
    description: "공지 등록, 수정, 삭제를 처리합니다."
  },
  promotions: {
    title: "상단고정 관리",
    description: "결제 없이 운영자가 수동으로 게시글 노출 기간을 관리합니다."
  },
  banners: {
    title: "배너 관리",
    description: "결제 없이 배너 제목, 이미지 URL, 링크, 위치, 노출 기간을 관리합니다."
  }
};

const validSections = new Set(Object.keys(sectionTitles));

export default async function AdminSectionPage({
  params
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!validSections.has(section) || section === "overview") notFound();

  const currentSection = section as AdminSection;
  const meta = sectionTitles[currentSection];

  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-2xl font-bold leading-[1.3] text-ink">{meta.title}</h1>
        <p className="mt-1 text-sm font-medium leading-5 text-muted">{meta.description}</p>
      </section>
      <AdminDashboard section={currentSection} />
    </div>
  );
}
