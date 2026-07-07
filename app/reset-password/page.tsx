import { ResetPasswordForm } from "@/components/password-reset-forms";

export default function ResetPasswordPage() {
  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-2xl font-bold leading-[1.3] text-ink">새 비밀번호 설정</h1>
        <p className="mt-1 text-sm font-medium leading-5 text-muted">메일로 받은 링크를 열었을 때만 비밀번호를 바꿀 수 있습니다.</p>
      </section>
      <ResetPasswordForm />
    </div>
  );
}
