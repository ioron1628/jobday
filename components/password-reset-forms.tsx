"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import {
  PASSWORD_RESET_REQUEST_FAILED_MESSAGE,
  PASSWORD_UPDATE_FAILED_MESSAGE,
  SUPABASE_SETUP_REQUIRED_MESSAGE
} from "@/lib/user-messages";
import { Button, ButtonLink, ErrorMessage, FieldLabel, Input, NoticeBox } from "./design-system";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"danger" | "success" | "muted">("muted");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setTone("danger");
      setMessage(SUPABASE_SETUP_REQUIRED_MESSAGE);
      setLoading(false);
      return;
    }

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
      setTone("danger");
      setMessage(PASSWORD_RESET_REQUEST_FAILED_MESSAGE);
    } else {
      setTone("success");
      setMessage("비밀번호 재설정 메일을 보냈습니다. 메일함에서 JOBDAY 링크를 열어주세요.");
      event.currentTarget.reset();
    }

    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="board-panel space-y-4 p-4">
      <NoticeBox tone="muted" title="비밀번호를 다시 설정하는 방법">
        <p>가입한 이메일을 입력하면 비밀번호를 바꿀 수 있는 메일이 발송됩니다.</p>
        <p>메일 링크는 시간이 지나면 만료될 수 있습니다. 만료되면 이 화면에서 다시 요청하면 됩니다.</p>
      </NoticeBox>

      <div>
        <FieldLabel htmlFor="email" label="가입한 이메일" required />
        <Input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>

      {message ? <ErrorMessage tone={tone}>{message}</ErrorMessage> : null}

      <Button fullWidth type="submit" variant="primary" size="lg" disabled={loading}>
        {loading ? "메일 보내는 중..." : "비밀번호 재설정 메일 받기"}
      </Button>

      <p className="text-center text-sm font-medium text-muted">
        비밀번호가 기억났나요?{" "}
        <ButtonLink href="/login" size="sm">
          로그인
        </ButtonLink>
      </p>
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [message, setMessage] = useState("재설정 링크를 확인하는 중입니다.");
  const [tone, setTone] = useState<"danger" | "success" | "muted">("muted");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function prepareReset() {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setTone("danger");
        setMessage(SUPABASE_SETUP_REQUIRED_MESSAGE);
        return;
      }

      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setTone("danger");
          setMessage("비밀번호 재설정 링크가 만료됐거나 올바르지 않습니다. 메일을 다시 받아주세요.");
          return;
        }
        window.history.replaceState(null, "", "/reset-password");
      }

      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session) {
        setTone("muted");
        setMessage("메일에서 비밀번호 재설정 링크를 열어야 새 비밀번호를 입력할 수 있습니다.");
        return;
      }

      setReady(true);
      setTone("muted");
      setMessage("새 비밀번호를 입력해주세요.");
    }

    void prepareReset();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setTone("danger");
      setMessage(SUPABASE_SETUP_REQUIRED_MESSAGE);
      setLoading(false);
      return;
    }

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirm_password") ?? "");

    if (password.length < 6) {
      setTone("danger");
      setMessage("비밀번호는 6자 이상으로 입력해주세요.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setTone("danger");
      setMessage("새 비밀번호와 확인 비밀번호가 서로 다릅니다.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setTone("danger");
      setMessage(PASSWORD_UPDATE_FAILED_MESSAGE);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/login?status=password-updated");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="board-panel space-y-4 p-4">
      <NoticeBox tone={tone === "danger" ? "danger" : "muted"} title="비밀번호 재설정">
        <p>{message}</p>
      </NoticeBox>

      <div>
        <FieldLabel htmlFor="password" label="새 비밀번호" required />
        <Input id="password" name="password" type="password" required minLength={6} disabled={!ready || loading} />
      </div>

      <div>
        <FieldLabel htmlFor="confirm_password" label="새 비밀번호 확인" required />
        <Input id="confirm_password" name="confirm_password" type="password" required minLength={6} disabled={!ready || loading} />
      </div>

      <Button fullWidth type="submit" variant="primary" size="lg" disabled={!ready || loading}>
        {loading ? "변경 중..." : "비밀번호 변경"}
      </Button>

      {!ready ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <ButtonLink href="/forgot-password" size="sm">
            재설정 메일 다시 받기
          </ButtonLink>
          <ButtonLink href="/login" size="sm">
            로그인으로 이동
          </ButtonLink>
        </div>
      ) : null}
    </form>
  );
}
