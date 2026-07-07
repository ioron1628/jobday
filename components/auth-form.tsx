"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { LOGIN_FAILED_MESSAGE, SIGNUP_FAILED_MESSAGE, SUPABASE_SETUP_REQUIRED_MESSAGE } from "@/lib/user-messages";
import { Button, ButtonLink, ErrorMessage, FieldLabel, Input, NoticeBox } from "./design-system";

type Props = {
  mode: "login" | "signup";
  initialMessage?: string;
};

export function AuthForm({ mode, initialMessage = "" }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState(initialMessage);
  const [loading, setLoading] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [signupDone, setSignupDone] = useState(false);
  const isSignup = mode === "signup";

  useEffect(() => {
    async function checkUser() {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) return;
      const {
        data: { user }
      } = await supabase.auth.getUser();
      setLoggedInEmail(user?.email ?? "");
    }

    void checkUser();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSignupDone(false);

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setMessage(SUPABASE_SETUP_REQUIRED_MESSAGE);
      setLoading(false);
      return;
    }

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const nickname = String(form.get("nickname") ?? "");
    const acceptedTerms = form.get("accepted_terms") === "on";

    if (isSignup) {
      if (!acceptedTerms) {
        setMessage("약관과 개인정보처리방침, 책임 제한 안내에 동의해야 회원가입할 수 있습니다.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname }
        }
      });

      if (error) {
        setMessage(SIGNUP_FAILED_MESSAGE);
      } else {
        setMessage("회원가입이 접수되었습니다. 이메일 확인이 필요하면 메일을 확인한 뒤 로그인해주세요.");
        setSignupDone(true);
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(LOGIN_FAILED_MESSAGE);
      } else {
        router.push("/me?status=login-success");
        router.refresh();
      }
    }

    setLoading(false);
  }

  if (loggedInEmail) {
    return (
      <section className="board-panel space-y-3 p-4">
        <NoticeBox tone="success" title="이미 로그인되어 있습니다">
          <p>{loggedInEmail} 계정으로 로그인되어 있습니다.</p>
        </NoticeBox>
        <div className="grid gap-2 sm:grid-cols-3">
          <ButtonLink href="/me" variant="primary" size="lg">
            프로필 설정하기
          </ButtonLink>
          <ButtonLink href="/write" size="lg">
            게시글 작성하기
          </ButtonLink>
          <ButtonLink href="/boards" size="lg">
            게시판 둘러보기
          </ButtonLink>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className="board-panel space-y-4 p-4">
      <div>
        <FieldLabel htmlFor="email" label="이메일" required />
        <Input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>

      {isSignup ? (
        <div>
          <FieldLabel htmlFor="nickname" label="닉네임" required />
          <Input id="nickname" name="nickname" required maxLength={24} placeholder="예: 화성전기맨" />
        </div>
      ) : null}

      <div>
        <FieldLabel htmlFor="password" label="비밀번호" required />
        <Input id="password" name="password" type="password" required minLength={6} />
      </div>

      {isSignup ? (
        <label className="flex items-start gap-3 rounded-sm border border-line-strong bg-field p-3 text-sm font-medium leading-6 text-ink">
          <input className="mt-1 h-5 w-5 shrink-0 accent-amber-700" id="accepted_terms" name="accepted_terms" type="checkbox" required />
          <span>
            <Link className="font-semibold text-accent underline" href="/terms">
              이용약관
            </Link>
            ,{" "}
            <Link className="font-semibold text-accent underline" href="/privacy">
              개인정보처리방침
            </Link>
            ,{" "}
            <Link className="font-semibold text-accent underline" href="/disclaimer">
              책임 제한 안내
            </Link>
            ,{" "}
            <Link className="font-semibold text-accent underline" href="/community-rules">
              커뮤니티 규칙
            </Link>
            을 확인했고 동의합니다.
          </span>
        </label>
      ) : null}

      {message ? <ErrorMessage tone="muted">{message}</ErrorMessage> : null}

      {signupDone ? (
        <NoticeBox tone="success" title="다음으로 할 일">
          <p>이메일 확인이 필요한 경우 메일을 먼저 확인해주세요. 로그인되었다면 바로 프로필을 설정할 수 있습니다.</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <ButtonLink href="/me" size="sm" variant="primary">
              프로필 설정하기
            </ButtonLink>
            <ButtonLink href="/write" size="sm">
              게시글 작성하기
            </ButtonLink>
            <ButtonLink href="/boards" size="sm">
              게시판 둘러보기
            </ButtonLink>
          </div>
        </NoticeBox>
      ) : null}

      <Button fullWidth type="submit" disabled={loading} variant="primary" size="lg">
        {loading ? "처리 중" : isSignup ? "회원가입" : "로그인"}
      </Button>

      <p className="text-center text-sm font-medium text-muted">
        {isSignup ? (
          <>
            이미 계정이 있나요?{" "}
            <Link className="font-semibold text-accent" href="/login">
              로그인
            </Link>
          </>
        ) : (
          <>
            처음인가요?{" "}
            <Link className="font-semibold text-accent" href="/signup">
              회원가입
            </Link>
            <span className="mx-2 text-slate-300">|</span>
            <Link className="font-semibold text-accent" href="/forgot-password">
              비밀번호 재설정
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
