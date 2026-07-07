import { ButtonLink, NoticeBox } from "@/components/design-system";

export function LoginRequiredNotice({
  message = "로그인 후 이용할 수 있습니다.",
  next = "/login"
}: {
  message?: string;
  next?: string;
}) {
  return (
    <NoticeBox tone="muted" title="로그인이 필요합니다">
      <p>{message}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <ButtonLink href={next} size="sm" variant="primary">
          로그인
        </ButtonLink>
        <ButtonLink href="/signup" size="sm">
          회원가입
        </ButtonLink>
      </div>
    </NoticeBox>
  );
}

export function PermissionDeniedNotice({
  title = "권한이 없습니다",
  message = "이 작업을 할 수 있는 권한이 없습니다."
}: {
  title?: string;
  message?: string;
}) {
  return (
    <NoticeBox tone="danger" title={title}>
      <p>{message}</p>
      <div className="mt-2">
        <ButtonLink href="/boards" size="sm">
          게시판으로 이동
        </ButtonLink>
      </div>
    </NoticeBox>
  );
}

export function BlockedUserNotice({
  message = "현재 계정은 운영 기준에 따라 글쓰기와 댓글 작성이 제한되어 있습니다."
}: {
  message?: string;
}) {
  return (
    <NoticeBox tone="danger" title="이용이 제한된 계정입니다">
      <p>{message}</p>
      <p className="mt-1">오류라고 생각되면 운영자에게 문의해주세요.</p>
    </NoticeBox>
  );
}
