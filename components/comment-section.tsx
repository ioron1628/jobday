"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/format";
import { REPORT_REASONS } from "@/lib/constants";
import { isAdminProfile } from "@/lib/admin";
import { buildReportDetail, getReportReason } from "@/lib/report-utils";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { ACTION_FAILED_MESSAGE, LOGIN_REQUIRED_MESSAGE, SUPABASE_SETUP_REQUIRED_MESSAGE } from "@/lib/user-messages";
import type { Comment, Profile } from "@/types/domain";
import { AuthorIdentity, Button, ButtonLink, EmptyState, Icon, NoticeBox, Select, Textarea, ToastMessage } from "./design-system";

type Props = {
  postId: string;
  comments: Comment[];
};

export function CommentSection({ postId, comments }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"danger" | "success" | "warning" | "muted">("success");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingCommentAction, setPendingCommentAction] = useState<string | null>(null);
  const [locallyDeletedCommentIds, setLocallyDeletedCommentIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadUser() {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setAuthChecked(true);
        return;
      }
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) {
        setAuthChecked(true);
        return;
      }
      setUserId(user.id);
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      const profile = data as Profile | null;
      setIsAdmin(isAdminProfile(profile));
      setIsBlocked(profile?.status === "suspended" || profile?.status === "deleted");
      setAuthChecked(true);
    }

    void loadUser();
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 3600);
    return () => window.clearTimeout(timer);
  }, [message]);

  function showMessage(text: string, tone: "danger" | "success" | "warning" | "muted" = "success") {
    setMessage(text);
    setMessageTone(tone);
  }

  const topLevel = useMemo(() => {
    const commentIds = new Set(comments.map((comment) => comment.id));
    return comments.filter((comment) => !comment.parent_id || !commentIds.has(comment.parent_id));
  }, [comments]);
  const replies = useMemo(() => {
    return comments.reduce<Record<string, Comment[]>>((acc, comment) => {
      if (comment.parent_id) {
        acc[comment.parent_id] = [...(acc[comment.parent_id] ?? []), comment];
      }
      return acc;
    }, {});
  }, [comments]);

  function commentRoleLabel(comment: Comment, nested: boolean) {
    const trade = comment.author?.interested_trade ?? comment.author?.available_trades?.[0];
    if (trade) return trade;
    if (comment.author?.can_travel) return "원정가능";
    if (comment.author?.region) return comment.author.region;
    return nested ? "대댓글" : "댓글";
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const body = String(form.get("body") ?? "").trim();

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      showMessage(SUPABASE_SETUP_REQUIRED_MESSAGE, "warning");
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      showMessage(LOGIN_REQUIRED_MESSAGE, "warning");
      return;
    }

    if (isBlocked) {
      showMessage("현재 계정은 댓글을 작성할 수 없습니다.", "danger");
      return;
    }

    if (!body) {
      showMessage("댓글 내용을 입력해주세요.", "warning");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      author_id: user.id,
      parent_id: replyTo,
      body
    });

    setIsSubmitting(false);
    if (error) {
      showMessage(ACTION_FAILED_MESSAGE, "danger");
      return;
    }

    showMessage(replyTo ? "대댓글이 등록되었습니다." : "댓글이 등록되었습니다.");
    setReplyTo(null);
    formElement.reset();
    router.refresh();
  }

  async function updateComment(event: FormEvent<HTMLFormElement>, commentId: string) {
    event.preventDefault();
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      showMessage(SUPABASE_SETUP_REQUIRED_MESSAGE, "warning");
      return;
    }

    const form = new FormData(event.currentTarget);
    const body = String(form.get("body") ?? "").trim();
    if (!body) {
      showMessage("수정할 댓글 내용을 입력해주세요.", "warning");
      return;
    }

    setPendingCommentAction(`edit-${commentId}`);
    const { error } = await supabase.from("comments").update({ body }).eq("id", commentId);
    setPendingCommentAction(null);
    if (error) {
      showMessage(ACTION_FAILED_MESSAGE, "danger");
      return;
    }

    showMessage("댓글이 수정되었습니다.");
    setEditingCommentId(null);
    router.refresh();
  }

  async function removeComment(commentId: string) {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      showMessage(SUPABASE_SETUP_REQUIRED_MESSAGE, "warning");
      return;
    }
    setPendingCommentAction(`delete-${commentId}`);
    const { error } = await supabase.from("comments").update({ status: "deleted" }).eq("id", commentId);
    setPendingCommentAction(null);
    if (error) {
      showMessage(ACTION_FAILED_MESSAGE, "danger");
      return;
    }

    showMessage("댓글이 삭제되었습니다.", "muted");
    setLocallyDeletedCommentIds((current) => (current.includes(commentId) ? current : [...current, commentId]));
  }

  async function reportComment(event: FormEvent<HTMLFormElement>, commentId: string) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const selectedReason = getReportReason(String(form.get("reason") ?? "other"));
    const detail = String(form.get("detail") ?? "");

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      showMessage(SUPABASE_SETUP_REQUIRED_MESSAGE, "warning");
      return;
    }
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      showMessage(LOGIN_REQUIRED_MESSAGE, "warning");
      return;
    }

    setPendingCommentAction(`report-${commentId}`);
    const { data: existingReport } = await supabase
      .from("reports")
      .select("id")
      .eq("reporter_id", user.id)
      .eq("target_type", "comment")
      .eq("target_id", commentId)
      .maybeSingle();

    if (existingReport) {
      setPendingCommentAction(null);
      setReportingCommentId(null);
      showMessage("이미 신고한 댓글입니다. 운영자가 확인합니다.", "warning");
      return;
    }

    const { error } = await supabase.from("reports").insert({
      reporter_id: user.id,
      target_type: "comment",
      target_id: commentId,
      reason: selectedReason.value,
      detail: buildReportDetail(selectedReason.label, detail)
    });
    setPendingCommentAction(null);
    if (error) {
      const isDuplicateReport = error.code === "23505" || error.message.toLowerCase().includes("duplicate");
      if (isDuplicateReport) {
        setReportingCommentId(null);
        showMessage("이미 신고한 댓글입니다. 운영자가 확인합니다.", "warning");
        return;
      }
      showMessage(ACTION_FAILED_MESSAGE, "danger");
      return;
    }

    showMessage("댓글 신고가 접수되었습니다.", "success");
    setReportingCommentId(null);
    router.refresh();
  }

  function renderComment(comment: Comment, nested = false) {
    const isDeleted = comment.status === "deleted" || locallyDeletedCommentIds.includes(comment.id);
    const isOwner = userId === comment.author_id;
    const canEdit = isOwner && !isDeleted;
    const canRemove = (isOwner || isAdmin) && !isDeleted;

    return (
      <div key={comment.id} className={`${nested ? "ml-4 border-l-4 border-amber-300 bg-slate-50 pl-3" : ""} py-3`}>
        <div className="flex items-center justify-between gap-2">
          <AuthorIdentity
            nickname={comment.author?.nickname ?? "익명"}
            roleLabel={commentRoleLabel(comment, nested)}
            premium={comment.author?.is_premium_company}
          />
          <span className="text-sm font-medium text-muted">{formatDate(comment.created_at)}</span>
        </div>
        {editingCommentId === comment.id ? (
          <form onSubmit={(event) => updateComment(event, comment.id)} className="mt-2 space-y-2">
            <Textarea className="min-h-28" name="body" defaultValue={comment.body} />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" type="submit" disabled={pendingCommentAction !== null}>
                {pendingCommentAction === `edit-${comment.id}` ? "저장 중..." : "수정 저장"}
              </Button>
              <Button size="sm" variant="quiet" type="button" onClick={() => setEditingCommentId(null)}>
                취소
              </Button>
            </div>
          </form>
        ) : (
          <p className="mt-2 whitespace-pre-wrap text-base font-medium leading-7 text-ink">
            {isDeleted ? "삭제된 댓글입니다." : comment.body}
          </p>
        )}
        {!isDeleted ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {!nested && userId ? (
              <Button size="sm" variant={replyTo === comment.id ? "warning" : "quiet"} type="button" onClick={() => setReplyTo(comment.id)}>
                <Icon name="reply" className="mr-1 h-3.5 w-3.5" />
                {replyTo === comment.id ? "답글 작성 중" : "답글"}
              </Button>
            ) : null}
            {canEdit ? (
              <Button size="sm" variant="quiet" type="button" onClick={() => setEditingCommentId(comment.id)}>
                수정
              </Button>
            ) : null}
            <Button size="sm" variant="quiet" type="button" onClick={() => setReportingCommentId(reportingCommentId === comment.id ? null : comment.id)}>
              <Icon name="report" className="mr-1 h-3.5 w-3.5" />
              신고 {comment.report_count ?? 0}
            </Button>
            {canRemove ? (
              <Button size="sm" variant="danger" type="button" disabled={pendingCommentAction !== null} onClick={() => removeComment(comment.id)}>
                {pendingCommentAction === `delete-${comment.id}` ? "삭제 중..." : "삭제"}
              </Button>
            ) : null}
          </div>
        ) : null}
        {reportingCommentId === comment.id ? (
          <form onSubmit={(event) => reportComment(event, comment.id)} className="mt-2 space-y-2 border border-line bg-field p-2">
            <p className="text-sm font-medium leading-6 text-muted">문제 댓글은 신고 후 운영자가 확인합니다.</p>
            <Select name="reason" defaultValue="other">
              {REPORT_REASONS.map((reason) => (
                <option key={reason.key} value={reason.key}>
                  {reason.label}
                </option>
              ))}
            </Select>
            <Textarea className="min-h-24" name="detail" placeholder="신고 내용을 적어주세요" />
            <Button size="sm" type="submit" disabled={pendingCommentAction !== null}>
              {pendingCommentAction === `report-${comment.id}` ? "신고 접수 중..." : "신고 접수"}
            </Button>
          </form>
        ) : null}
        {replies[comment.id]?.map((reply) => renderComment(reply, true))}
      </div>
    );
  }

  return (
    <section className="board-panel p-3">
      <div className="border-b border-line-strong pb-2">
        <h2 className="text-xl font-bold leading-[1.35] text-ink">댓글 {comments.length}</h2>
        <p className="mt-1 text-sm font-medium leading-5 text-muted">조건 확인, 추가 질문, 거래 문의를 댓글로 남길 수 있습니다.</p>
      </div>
      {isBlocked ? (
        <NoticeBox className="mt-3" tone="muted">
          <p>현재 계정은 댓글을 작성할 수 없습니다.</p>
        </NoticeBox>
      ) : authChecked && !userId ? (
        <NoticeBox className="mt-3" tone="muted" title="댓글은 로그인 후 쓸 수 있습니다">
          <p>로그인하면 댓글, 대댓글, 신고를 이용할 수 있습니다.</p>
          <ButtonLink className="mt-2" href="/login" size="sm">
            로그인하러 가기
          </ButtonLink>
        </NoticeBox>
      ) : !authChecked ? (
        <NoticeBox className="mt-3" tone="muted">
          <p>댓글 입력 준비 중입니다.</p>
        </NoticeBox>
      ) : (
        <form onSubmit={submitComment} className="mt-3 space-y-2">
          {replyTo ? (
            <div className="flex items-center justify-between bg-amber-50 px-3 py-2 text-sm font-semibold text-ink">
              <span>대댓글 작성 중</span>
              <Button size="sm" variant="quiet" type="button" onClick={() => setReplyTo(null)}>
                취소
              </Button>
            </div>
          ) : null}
          <Textarea className="min-h-32" name="body" placeholder={replyTo ? "답글 내용을 입력하세요" : "조건 질문이나 의견을 댓글로 남겨보세요"} />
          <Button fullWidth type="submit" variant="primary" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (replyTo ? "대댓글 등록 중..." : "댓글 등록 중...") : replyTo ? "대댓글 쓰기" : "댓글 쓰기"}
          </Button>
        </form>
      )}
      {message ? <ToastMessage tone={messageTone}>{message}</ToastMessage> : null}
      <div className="mt-4 divide-y divide-slate-200">
        {topLevel.length ? (
          topLevel.map((comment) => renderComment(comment))
        ) : (
          <EmptyState title="댓글 없음" body="조건 확인이나 추가 질문이 있으면 첫 댓글을 남겨보세요." />
        )}
      </div>
    </section>
  );
}
