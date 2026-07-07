import { AuthForm } from "@/components/auth-form";

function loginMessage(status?: string) {
  if (status === "logged-out") return "로그아웃되었습니다.";
  if (status === "password-updated") return "비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.";
  if (status === "login-required") return "로그인이 필요한 화면입니다. 로그인한 뒤 다시 이용해주세요.";
  return "";
}

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-2xl font-bold leading-[1.3] text-ink">로그인</h1>
        <p className="mt-1 text-sm font-medium leading-5 text-muted">글쓰기, 댓글, 추천, 신고는 로그인 후 사용할 수 있습니다.</p>
      </section>
      <AuthForm mode="login" initialMessage={loginMessage(resolvedSearchParams?.status)} />
    </div>
  );
}
