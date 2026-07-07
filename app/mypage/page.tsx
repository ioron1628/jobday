import { ProfileForm } from "@/components/profile-form";
import { SavedPostsPanel } from "@/components/saved-posts-panel";
import { getRegions, getTrades } from "@/lib/data";

export const dynamic = "force-dynamic";

function myPageMessage(status?: string) {
  if (status === "login-success") return "로그인되었습니다. 먼저 프로필을 확인해 주세요.";
  if (status === "profile-needed") return "게시글 작성 전에 프로필을 먼저 설정하면 좋습니다.";
  return "";
}

export default async function MyPage({
  searchParams
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const [regions, trades] = await Promise.all([getRegions(), getTrades()]);
  const resolvedSearchParams = await searchParams;

  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-2xl font-bold leading-[1.3] text-ink">마이페이지</h1>
        <p className="mt-1 text-sm font-medium leading-5 text-muted">현장에서 필요한 공개 프로필만 관리합니다.</p>
      </section>
      <ProfileForm regions={regions} trades={trades} initialMessage={myPageMessage(resolvedSearchParams?.status)} />
      <SavedPostsPanel />
    </div>
  );
}
