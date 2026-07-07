import { AuthForm } from "@/components/auth-form";

export default async function SignupPage({
  searchParams
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialMessage = resolvedSearchParams?.status === "login-required" ? "회원가입 후 이용할 수 있습니다." : "";

  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-2xl font-bold leading-[1.3] text-ink">회원가입</h1>
        <p className="mt-1 text-sm font-medium leading-5 text-muted">닉네임만 필수입니다. 신분증, 주민번호, 계좌번호는 받지 않습니다.</p>
      </section>
      <AuthForm mode="signup" initialMessage={initialMessage} />
    </div>
  );
}
