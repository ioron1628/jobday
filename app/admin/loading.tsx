import { LoadingState } from "@/components/design-system";

export default function AdminLoadingPage() {
  return <LoadingState title="관리자 화면을 불러오는 중입니다" body="신고, 게시글, 댓글, 유저 상태를 확인하고 있습니다." />;
}
