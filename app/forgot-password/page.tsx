import { ForgotPasswordForm } from "@/components/password-reset-forms";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-2xl font-bold leading-[1.3] text-ink">비밀번호 재설정</h1>
        <p className="mt-1 text-sm font-medium leading-5 text-muted">가입한 이메일로 새 비밀번호 설정 링크를 받습니다.</p>
      </section>
      <ForgotPasswordForm />
    </div>
  );
}
