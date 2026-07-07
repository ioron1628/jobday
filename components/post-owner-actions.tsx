"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MARKET_BOARD_SLUGS } from "@/lib/constants";
import { isAdminProfile } from "@/lib/admin";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { ACTION_FAILED_MESSAGE } from "@/lib/user-messages";
import type { Post, Profile } from "@/types/domain";
import { Button, ButtonLink, Icon, ToastMessage } from "./design-system";

export function PostOwnerActions({ post }: { post: Post }) {
  const router = useRouter();
  const [canManage, setCanManage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"danger" | "success" | "warning" | "muted">("success");
  const [isSaving, setIsSaving] = useState(false);
  const isMarket = MARKET_BOARD_SLUGS.includes(post.board?.slug ?? "");

  useEffect(() => {
    async function load() {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) return;

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      const profile = data as Profile | null;
      const admin = isAdminProfile(profile);
      setIsAdmin(admin);
      setIsOwner(user.id === post.author_id);
      setCanManage(user.id === post.author_id || admin);
    }

    void load();
  }, [post.author_id]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 3600);
    return () => window.clearTimeout(timer);
  }, [message]);

  function showMessage(text: string, tone: "danger" | "success" | "warning" | "muted" = "success") {
    setMessage(text);
    setMessageTone(tone);
  }

  async function updateStatus(status: "closed" | "hidden" | "deleted" | "recruiting", successMessage: string) {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;

    setIsSaving(true);
    const { error } = await supabase.from("posts").update({ status }).eq("id", post.id);
    setIsSaving(false);
    if (error) {
      showMessage(ACTION_FAILED_MESSAGE, "danger");
      return;
    }

    showMessage(successMessage, status === "deleted" ? "muted" : "success");
    router.refresh();
  }

  if (!canManage) return null;

  return (
    <section className="board-panel p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold leading-[1.35] text-ink">{isOwner ? "내 글 관리" : "운영자 처리"}</h2>
        <span className="text-[12px] font-medium text-muted">{isAdmin && !isOwner ? "관리자 권한" : "작성자만 표시"}</span>
      </div>
      <div className="space-y-2">
        {isOwner ? (
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={`/posts/${post.id}/edit`} size="sm" className="!border-slate-900 !bg-white !text-slate-950">
              수정
            </ButtonLink>
            {isMarket ? (
              <Button
                size="sm"
                type="button"
                className={post.status === "closed" ? "!border-line !bg-soft !text-slate-700" : "!border-green-300 !bg-green-50 !text-green-800"}
                disabled={isSaving}
                onClick={() =>
                  updateStatus(post.status === "closed" ? "recruiting" : "closed", post.status === "closed" ? "거래중으로 변경했습니다." : "거래완료로 처리했습니다.")
                }
              >
                <Icon name={post.status === "closed" ? "reply" : "check"} className="mr-1 h-3.5 w-3.5" />
                {isSaving ? "처리 중..." : post.status === "closed" ? "거래중으로 변경" : "거래완료 처리"}
              </Button>
            ) : (
              <Button
                size="sm"
                type="button"
                className={post.status === "closed" ? "!border-line !bg-soft !text-slate-700" : "!border-green-300 !bg-green-50 !text-green-800"}
                disabled={isSaving}
                onClick={() =>
                  updateStatus(post.status === "closed" ? "recruiting" : "closed", post.status === "closed" ? "모집중으로 변경했습니다." : "모집마감으로 처리했습니다.")
                }
              >
                <Icon name={post.status === "closed" ? "reply" : "check"} className="mr-1 h-3.5 w-3.5" />
                {isSaving ? "처리 중..." : post.status === "closed" ? "모집중으로 변경" : "모집마감 처리"}
              </Button>
            )}
            <Button size="sm" variant="danger" type="button" disabled={isSaving} onClick={() => updateStatus("deleted", "글을 삭제 처리했습니다.")}>
              <Icon name="report" className="mr-1 h-3.5 w-3.5" />
              삭제
            </Button>
          </div>
        ) : null}
        {isAdmin ? (
          <div className="flex flex-wrap gap-2 border-t border-line pt-2">
            <Button size="sm" variant="warning" type="button" disabled={isSaving} onClick={() => updateStatus("hidden", "운영 정책에 따라 숨김 처리했습니다.")}>
              관리자 숨김
            </Button>
            <Button size="sm" variant="quiet" type="button" disabled={isSaving} onClick={() => updateStatus("recruiting", "숨김을 해제했습니다.")}>
              숨김 해제
            </Button>
          </div>
        ) : null}
      </div>
      {message ? <ToastMessage tone={messageTone}>{message}</ToastMessage> : null}
    </section>
  );
}
