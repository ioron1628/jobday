"use client";

import { useEffect, useState } from "react";
import { Button, Icon, ToastMessage } from "@/components/design-system";

export function ShareSummaryButton({ summary }: { summary: string }) {
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "warning">("success");

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 2600);
    return () => window.clearTimeout(timer);
  }, [message]);

  async function copySummary() {
    const url = window.location.href.split("?")[0];
    const text = `${summary}\n\n글 보기: ${url}\n조건은 작성자와 직접 확인하세요. JOBDAY는 계약 당사자가 아닙니다.`;

    try {
      await navigator.clipboard.writeText(text);
      setMessageTone("success");
      setMessage("공유 문구를 복사했습니다.");
    } catch {
      setMessageTone("warning");
      setMessage("복사하지 못했습니다. 브라우저 권한을 확인해주세요.");
    }
  }

  return (
    <>
      <Button type="button" variant="secondary" size="lg" fullWidth onClick={copySummary}>
        <Icon name="reply" className="mr-1.5 h-4 w-4 rotate-180" />
        공유 문구 복사
      </Button>
      {message ? <ToastMessage tone={messageTone}>{message}</ToastMessage> : null}
    </>
  );
}
