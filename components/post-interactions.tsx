"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { REPORT_REASONS } from "@/lib/constants";
import { buildReportDetail, getReportReason } from "@/lib/report-utils";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { ACTION_FAILED_MESSAGE, LOGIN_REQUIRED_MESSAGE, SUPABASE_SETUP_REQUIRED_MESSAGE } from "@/lib/user-messages";
import { Button, Icon, Select, Textarea, ToastMessage } from "./design-system";

type Props = {
  postId: string;
  authorId: string;
  upCount: number;
  downCount: number;
  reportCount: number;
};

export function PostInteractions({ postId, authorId, upCount, downCount, reportCount }: Props) {
  const router = useRouter();
  const [showReport, setShowReport] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"danger" | "success" | "warning" | "muted">("success");
  const [pendingAction, setPendingAction] = useState<"up" | "down" | "report" | null>(null);
  const [currentVote, setCurrentVote] = useState<1 | -1 | 0>(0);
  const [localUpCount, setLocalUpCount] = useState(upCount);
  const [localDownCount, setLocalDownCount] = useState(downCount);
  const [localReportCount, setLocalReportCount] = useState(reportCount);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    setLocalUpCount(upCount);
    setLocalDownCount(downCount);
    setLocalReportCount(reportCount);
  }, [downCount, reportCount, upCount]);

  useEffect(() => {
    let ignored = false;

    async function loadUserReaction() {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) return;

      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user || user.id === authorId) return;

      const { data: voteData } = await supabase.from("votes").select("value").eq("post_id", postId).eq("user_id", user.id).maybeSingle();
      if (!ignored && (voteData?.value === 1 || voteData?.value === -1)) {
        setCurrentVote(voteData.value);
      }

      const { data: reportData } = await supabase
        .from("reports")
        .select("id")
        .eq("reporter_id", user.id)
        .eq("target_type", "post")
        .eq("target_id", postId)
        .maybeSingle();
      if (!ignored && reportData) {
        setReported(true);
      }
    }

    void loadUserReaction();
    return () => {
      ignored = true;
    };
  }, [authorId, postId]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 3600);
    return () => window.clearTimeout(timer);
  }, [message]);

  function showMessage(text: string, tone: "danger" | "success" | "warning" | "muted" = "success") {
    setMessage(text);
    setMessageTone(tone);
  }

  function nextVoteCounts(previousVote: 1 | -1 | 0, nextVote: 1 | -1, up: number, down: number) {
    let nextUp = up;
    let nextDown = down;

    if (previousVote === 1) nextUp = Math.max(0, nextUp - 1);
    if (previousVote === -1) nextDown = Math.max(0, nextDown - 1);
    if (nextVote === 1) nextUp += 1;
    if (nextVote === -1) nextDown += 1;

    return { nextUp, nextDown };
  }

  async function vote(value: 1 | -1) {
    if (pendingAction) return;

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

    if (user.id === authorId) {
      showMessage("자기 글에는 추천/비추천을 할 수 없습니다.", "warning");
      return;
    }

    if (currentVote === value) {
      showMessage(value === 1 ? "이미 추천한 글입니다." : "이미 비추천한 글입니다.", "muted");
      return;
    }

    const previousVote = currentVote;
    const previousUpCount = localUpCount;
    const previousDownCount = localDownCount;
    const { nextUp, nextDown } = nextVoteCounts(previousVote, value, previousUpCount, previousDownCount);

    setCurrentVote(value);
    setLocalUpCount(nextUp);
    setLocalDownCount(nextDown);
    setPendingAction(value === 1 ? "up" : "down");
    const { error } = await supabase.from("votes").upsert({ post_id: postId, user_id: user.id, value }, { onConflict: "post_id,user_id" });
    setPendingAction(null);
    if (error) {
      setCurrentVote(previousVote);
      setLocalUpCount(previousUpCount);
      setLocalDownCount(previousDownCount);
      showMessage(ACTION_FAILED_MESSAGE, "danger");
      return;
    }

    showMessage(value === 1 ? "추천했습니다." : "비추천했습니다.");
    router.refresh();
  }

  async function report(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingAction) return;
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

    if (reported) {
      showMessage("이미 신고한 글입니다. 운영자가 확인합니다.", "warning");
      setShowReport(false);
      return;
    }

    setPendingAction("report");
    const { data: existingReport } = await supabase
      .from("reports")
      .select("id")
      .eq("reporter_id", user.id)
      .eq("target_type", "post")
      .eq("target_id", postId)
      .maybeSingle();

    if (existingReport) {
      setReported(true);
      setPendingAction(null);
      setShowReport(false);
      showMessage("이미 신고한 글입니다. 운영자가 확인합니다.", "warning");
      return;
    }

    const { error } = await supabase.from("reports").insert({
      reporter_id: user.id,
      target_type: "post",
      target_id: postId,
      reason: selectedReason.value,
      detail: buildReportDetail(selectedReason.label, detail)
    });

    setPendingAction(null);
    if (error) {
      const isDuplicateReport = error.code === "23505" || error.message.toLowerCase().includes("duplicate");
      if (isDuplicateReport) {
        setReported(true);
        setShowReport(false);
        showMessage("이미 신고한 글입니다. 운영자가 확인합니다.", "warning");
        return;
      }
      showMessage(ACTION_FAILED_MESSAGE, "danger");
      return;
    }

    setReported(true);
    setLocalReportCount((count) => count + 1);
    showMessage("신고가 접수되었습니다.");
    setShowReport(false);
    router.refresh();
  }

  return (
    <section className="board-panel space-y-3 p-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold leading-[1.35] text-ink">추천 / 신고</h2>
        <span className="text-[12px] font-medium text-muted">로그인 후 이용 가능</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          aria-pressed={currentVote === 1}
          className={currentVote === 1 ? "!border-green-300 !bg-green-50 !text-green-800" : ""}
          disabled={pendingAction !== null}
          onClick={() => vote(1)}
        >
          <Icon name="check" className="mr-1 h-3.5 w-3.5" />
          {pendingAction === "up" ? "추천 반영 중..." : `추천 ${localUpCount}`}
        </Button>
        <Button
          type="button"
          aria-pressed={currentVote === -1}
          className={currentVote === -1 ? "!border-slate-400 !bg-slate-100 !text-slate-900" : ""}
          disabled={pendingAction !== null}
          onClick={() => vote(-1)}
        >
          <Icon name="closed" className="mr-1 h-3.5 w-3.5" />
          {pendingAction === "down" ? "비추천 반영 중..." : `비추천 ${localDownCount}`}
        </Button>
        <Button type="button" variant="quiet" disabled={pendingAction !== null} onClick={() => setShowReport((value) => !value)}>
          <Icon name="report" className="mr-1 h-3.5 w-3.5" />
          신고 {localReportCount}
        </Button>
      </div>

      {showReport ? (
        <form onSubmit={report} className="space-y-2">
          <p className="text-sm font-medium leading-6 text-muted">신고만으로 자동 삭제되지는 않고, 운영자가 확인합니다.</p>
          <Select name="reason" defaultValue="other">
            {REPORT_REASONS.map((reason) => (
              <option key={reason.key} value={reason.key}>
                {reason.label}
              </option>
            ))}
          </Select>
          <Textarea className="min-h-28" name="detail" placeholder="신고 내용을 적어주세요" />
          <Button fullWidth type="submit" variant="primary" size="lg" disabled={pendingAction !== null}>
            {pendingAction === "report" ? "신고 접수 중..." : "신고 접수"}
          </Button>
        </form>
      ) : null}

      {message ? <ToastMessage tone={messageTone}>{message}</ToastMessage> : null}
    </section>
  );
}
