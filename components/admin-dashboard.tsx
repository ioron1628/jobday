"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminProfile } from "@/lib/admin";
import { POST_STATUS_LABELS, REPORT_REASON_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { ACTION_FAILED_MESSAGE, LOAD_FAILED_MESSAGE, LOGIN_REQUIRED_MESSAGE, SUPABASE_SETUP_REQUIRED_MESSAGE } from "@/lib/user-messages";
import type { AdSlot, Comment, Notice, Post, Profile, Report } from "@/types/domain";
import { ButtonLink, ErrorMessage, LoadingState, NoticeBox } from "./design-system";

export type AdminSection = "overview" | "posts" | "reports" | "comments" | "users" | "notices" | "promotions" | "banners";

type AdminPost = Pick<Post, "id" | "title" | "status" | "author_id" | "created_at" | "pinned_until" | "urgent_until"> & {
  board?: { name: string; slug: string } | null;
  author?: { nickname: string } | null;
};

type AdminComment = Comment & {
  post?: { title: string } | null;
};

type Promotion = {
  id: string;
  post_id: string;
  placement: string;
  starts_at: string;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  post?: { title: string } | null;
};

type AdminAction = {
  id: string;
  admin_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  detail: Record<string, string | null> | null;
  created_at: string;
  admin?: { nickname: string } | null;
};

type ReportFilter = "pending" | "done" | "post" | "comment";

const adminNav: { section: AdminSection; href: string; label: string }[] = [
  { section: "overview", href: "/admin", label: "관리 홈" },
  { section: "posts", href: "/admin/posts", label: "게시글" },
  { section: "reports", href: "/admin/reports", label: "신고" },
  { section: "comments", href: "/admin/comments", label: "댓글" },
  { section: "users", href: "/admin/users", label: "유저" },
  { section: "notices", href: "/admin/notices", label: "공지" },
  { section: "promotions", href: "/admin/promotions", label: "상단고정" },
  { section: "banners", href: "/admin/banners", label: "배너" }
];

const promotionPlacements = [
  { value: "home_top", label: "홈 상단" },
  { value: "board_top", label: "게시판 상단" },
  { value: "urgent_raid", label: "긴급 구인글" },
  { value: "market_top", label: "마켓 상단" }
];

const bannerPlacements = [
  { value: "home_top", label: "메인 상단" },
  { value: "region_board_top", label: "지역 게시판 상단" },
  { value: "trade_board_top", label: "직종 게시판 상단" },
  { value: "post_inline", label: "글 상세 중간" },
  { value: "market_top", label: "마켓 상단" },
  { value: "tool_market_sponsor", label: "공구장터 추천 업체" },
  { value: "workwear_safety_sponsor", label: "작업복/안전화 광고" },
  { value: "beginner_guide_sponsor", label: "초보입문 가이드 후원" },
  { value: "group_buy_preview", label: "공구/자재 공동구매 예고" },
  { value: "company_profile_sponsor", label: "사업자 프로필 노출" }
];

const sponsorTypes = [
  { value: "general", label: "일반 광고" },
  { value: "tool_vendor", label: "공구상" },
  { value: "workwear", label: "작업복" },
  { value: "safety_shoes", label: "안전화" },
  { value: "materials", label: "자재상" },
  { value: "beginner_guide", label: "초보입문 후원" },
  { value: "group_buy", label: "공동구매 예고" },
  { value: "company_profile", label: "사업자 프로필" }
];

function asDateTimeInput(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function inputToIso(value: string) {
  return value ? new Date(value).toISOString() : null;
}

function normalizeAdminPost(post: AdminPost): AdminPost {
  if (post.board?.slug !== "dimodo") return post;

  return {
    ...post,
    board: {
      ...post.board,
      name: "보조구함"
    }
  };
}

function formText(form: FormData, name: string) {
  return String(form.get(name) ?? "").trim();
}

function isPendingReport(report: Report) {
  return report.status === "pending" || report.status === "reviewing";
}

function reportReasonLabel(report: Report) {
  const firstLine = report.detail?.split("\n")[0]?.replace("신고 사유:", "").trim();
  return firstLine || REPORT_REASON_LABELS[report.reason] || report.reason;
}

function isHighRiskReport(report: Report) {
  const label = reportReasonLabel(report);
  return report.reason === "scam" || report.reason === "personal_info" || label.includes("허위") || label.includes("사기") || label.includes("개인정보");
}

function reportStatusLabel(status: Report["status"]) {
  if (status === "pending") return "미처리";
  if (status === "reviewing") return "검토중";
  if (status === "resolved") return "처리완료";
  return "기각";
}

function targetTypeLabel(type: Report["target_type"]) {
  if (type === "post") return "게시글 신고";
  if (type === "comment") return "댓글 신고";
  return "유저 신고";
}

function AdminCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="board-panel p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold leading-[1.35] text-ink">{title}</h2>
          {description ? <p className="mt-1 text-sm font-medium leading-5 text-muted">{description}</p> : null}
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function EmptyAdminState({ children }: { children: ReactNode }) {
  return (
    <NoticeBox tone="muted" title="처리할 항목이 없습니다">
      <p>{children}</p>
    </NoticeBox>
  );
}

export function AdminDashboard({ section = "overview" }: { section?: AdminSection }) {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [actions, setActions] = useState<AdminAction[]>([]);
  const [reportFilter, setReportFilter] = useState<ReportFilter>("pending");
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  const counts = useMemo(
    () => ({
      pendingReports: reports.filter((report) => report.status === "pending" || report.status === "reviewing").length,
      hiddenPosts: posts.filter((post) => post.status === "hidden").length,
      deletedComments: comments.filter((comment) => comment.status === "deleted").length,
      bannedUsers: profiles.filter((profile) => profile.status === "suspended").length,
      activePromotions: promotions.filter((promotion) => promotion.is_active).length,
      activeBanners: adSlots.filter((slot) => slot.is_active).length
    }),
    [adSlots, comments, posts, profiles, promotions, reports]
  );

  const filteredReports = useMemo(() => {
    const filtered = reports.filter((report) => {
      if (reportFilter === "pending") return isPendingReport(report);
      if (reportFilter === "done") return !isPendingReport(report);
      if (reportFilter === "post") return report.target_type === "post";
      return report.target_type === "comment";
    });

    return [...filtered].sort((left, right) => {
      const pendingDiff = Number(isPendingReport(right)) - Number(isPendingReport(left));
      if (pendingDiff) return pendingDiff;

      const riskDiff = Number(isHighRiskReport(right)) - Number(isHighRiskReport(left));
      if (riskDiff) return riskDiff;

      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    });
  }, [reportFilter, reports]);

  async function logAction(action: string, targetType?: string, targetId?: string, detail: Record<string, string | null> = {}) {
    const supabase = createBrowserSupabaseClient();
    if (!supabase || !userId) return;
    await supabase.from("admin_actions").insert({
      admin_id: userId,
      action,
      target_type: targetType ?? null,
      target_id: targetId ?? null,
      detail
    });
  }

  function confirmAction(messageText: string) {
    return window.confirm(`${messageText}\n\n처리 후 관리자 활동 로그에 기록됩니다.`);
  }

  function noteForReport(reportId: string) {
    return adminNotes[reportId]?.trim() ?? "";
  }

  async function loadAdminData() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setMessage(SUPABASE_SETUP_REQUIRED_MESSAGE);
      setLoading(false);
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage(LOGIN_REQUIRED_MESSAGE);
      setLoading(false);
      return;
    }

    setUserId(user.id);
    const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (profileError) {
      setMessage(LOAD_FAILED_MESSAGE);
      setLoading(false);
      return;
    }

    const currentProfile = profile as Profile | null;
    if (!isAdminProfile(currentProfile)) {
      setMessage("관리자 권한이 필요합니다.");
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setIsAdmin(true);
    const [reportResult, postResult, commentResult, profileResult, noticeResult, promotionResult, slotResult, actionResult] = await Promise.all([
      supabase.from("reports").select("*").order("created_at", { ascending: false }).limit(100),
      supabase
        .from("posts")
        .select("id,title,status,author_id,created_at,pinned_until,urgent_until, board:boards(name,slug), author:profiles!posts_author_id_fkey(nickname)")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("comments")
        .select("*, author:profiles!comments_author_id_fkey(id,nickname), post:posts(title)")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("notices").select("*").order("created_at", { ascending: false }).limit(100),
      supabase
        .from("promoted_posts")
        .select("*, post:posts(title)")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase.from("ad_slots").select("*").order("placement", { ascending: true }),
      supabase
        .from("admin_actions")
        .select("*, admin:profiles!admin_actions_admin_id_fkey(nickname)")
        .order("created_at", { ascending: false })
        .limit(50)
    ]);

    setReports((reportResult.data ?? []) as Report[]);
    setPosts(((postResult.data ?? []) as unknown as AdminPost[]).map(normalizeAdminPost));
    setComments((commentResult.data ?? []) as unknown as AdminComment[]);
    setProfiles((profileResult.data ?? []) as Profile[]);
    setNotices((noticeResult.data ?? []) as Notice[]);
    setPromotions((promotionResult.data ?? []) as unknown as Promotion[]);
    setAdSlots((slotResult.data ?? []) as AdSlot[]);
    setActions((actionResult.data ?? []) as unknown as AdminAction[]);
    setLoading(false);
  }

  useEffect(() => {
    void loadAdminData();
  }, []);

  async function updatePost(
    postId: string,
    values: Record<string, string | boolean | null>,
    confirmMessage = "게시글을 처리할까요?",
    detail: Record<string, string | null> = {}
  ) {
    if (!confirmAction(confirmMessage)) return;
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const { error } = await supabase.from("posts").update(values).eq("id", postId);
    setMessage(error ? ACTION_FAILED_MESSAGE : "게시글을 처리했습니다.");
    await logAction("post_update", "post", postId, {
      ...Object.fromEntries(Object.entries(values).map(([key, value]) => [key, String(value)])),
      ...detail
    });
    await loadAdminData();
    router.refresh();
  }

  async function resolveReport(reportId: string, status: "resolved" | "dismissed", adminNote = "") {
    if (!confirmAction(status === "resolved" ? "신고를 처리완료로 바꿀까요?" : "신고를 기각 처리할까요?")) return;
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const { error } = await supabase
      .from("reports")
      .update({ status, admin_note: adminNote || null, resolved_by: userId, resolved_at: new Date().toISOString() })
      .eq("id", reportId);
    setMessage(error ? ACTION_FAILED_MESSAGE : "신고를 처리했습니다.");
    await logAction("report_update", "report", reportId, { status, admin_note: adminNote || null });
    await loadAdminData();
  }

  async function deleteComment(commentId: string, adminNote = "", confirmMessage = "댓글을 삭제 처리할까요?") {
    if (!confirmAction(confirmMessage)) return;
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const { error } = await supabase.from("comments").update({ status: "deleted" }).eq("id", commentId);
    setMessage(error ? ACTION_FAILED_MESSAGE : "댓글을 삭제 처리했습니다.");
    await logAction("comment_delete", "comment", commentId, { admin_note: adminNote || null });
    await loadAdminData();
  }

  async function hideReportedPost(report: Report) {
    if (!confirmAction("신고 대상 게시글을 숨김 처리하고 신고를 처리완료로 바꿀까요?")) return;
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const adminNote = noteForReport(report.id);
    const [postResult, reportResult] = await Promise.all([
      supabase.from("posts").update({ status: "hidden" }).eq("id", report.target_id),
      supabase
        .from("reports")
        .update({ status: "resolved", admin_note: adminNote || null, resolved_by: userId, resolved_at: new Date().toISOString() })
        .eq("id", report.id)
    ]);
    setMessage(postResult.error || reportResult.error ? ACTION_FAILED_MESSAGE : "게시글을 숨김 처리하고 신고를 완료했습니다.");
    await logAction("report_post_hide", "post", report.target_id, { report_id: report.id, admin_note: adminNote || null });
    await loadAdminData();
    router.refresh();
  }

  async function deleteReportedComment(report: Report) {
    if (!confirmAction("신고 대상 댓글을 삭제 처리하고 신고를 처리완료로 바꿀까요?")) return;
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const adminNote = noteForReport(report.id);
    const [commentResult, reportResult] = await Promise.all([
      supabase.from("comments").update({ status: "deleted" }).eq("id", report.target_id),
      supabase
        .from("reports")
        .update({ status: "resolved", admin_note: adminNote || null, resolved_by: userId, resolved_at: new Date().toISOString() })
        .eq("id", report.id)
    ]);
    setMessage(commentResult.error || reportResult.error ? ACTION_FAILED_MESSAGE : "댓글을 삭제 처리하고 신고를 완료했습니다.");
    await logAction("report_comment_delete", "comment", report.target_id, { report_id: report.id, admin_note: adminNote || null });
    await loadAdminData();
    router.refresh();
  }

  async function banUserById(targetUserId: string, reason: string, confirmMessage = "유저를 차단할까요?") {
    if (!targetUserId || !reason) {
      setMessage("유저 ID와 제한 사유가 필요합니다.");
      return;
    }
    if (targetUserId === userId) {
      setMessage("현재 로그인한 관리자 본인은 차단할 수 없습니다.");
      return;
    }
    if (!confirmAction(confirmMessage)) return;
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const { error } = await supabase.from("bans").insert({
      user_id: targetUserId,
      reason,
      created_by: userId
    });

    if (!error) {
      await supabase.from("profiles").update({ status: "suspended" }).eq("id", targetUserId);
    }

    setMessage(error ? ACTION_FAILED_MESSAGE : "유저를 제한했습니다.");
    await logAction("user_ban", "profile", targetUserId, { reason });
    await loadAdminData();
  }

  async function banUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const form = new FormData(event.currentTarget);
    const targetUserId = formText(form, "user_id");
    const reason = formText(form, "reason");
    if (!targetUserId || !reason) {
      setMessage("유저 ID와 제한 사유가 필요합니다.");
      return;
    }

    await banUserById(targetUserId, reason, "입력한 유저를 차단할까요?");
    event.currentTarget.reset();
  }

  async function unbanUser(profileId: string) {
    if (!confirmAction("차단을 해제할까요?")) return;
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const [banResult, profileResult] = await Promise.all([
      supabase.from("bans").update({ is_active: false }).eq("user_id", profileId),
      supabase.from("profiles").update({ status: "active" }).eq("id", profileId)
    ]);
    setMessage(banResult.error || profileResult.error ? ACTION_FAILED_MESSAGE : "차단을 해제했습니다.");
    await logAction("user_unban", "profile", profileId);
    await loadAdminData();
  }

  async function createNotice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const form = new FormData(event.currentTarget);
    const title = formText(form, "title");
    const body = formText(form, "body");
    if (!title || !body) {
      setMessage("공지 제목과 내용이 필요합니다.");
      return;
    }
    if (!confirmAction("공지를 등록할까요?")) return;

    const { data, error } = await supabase
      .from("notices")
      .insert({ title, body, author_id: userId, is_published: form.get("is_published") === "on" })
      .select("id")
      .single();

    setMessage(error ? ACTION_FAILED_MESSAGE : "공지를 등록했습니다.");
    if (data?.id) await logAction("notice_create", "notice", data.id);
    event.currentTarget.reset();
    await loadAdminData();
  }

  async function updateNotice(event: FormEvent<HTMLFormElement>, noticeId: string) {
    event.preventDefault();
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const form = new FormData(event.currentTarget);
    if (!confirmAction("공지를 수정할까요?")) return;
    const { error } = await supabase
      .from("notices")
      .update({
        title: formText(form, "title"),
        body: formText(form, "body"),
        is_published: form.get("is_published") === "on"
      })
      .eq("id", noticeId);
    setMessage(error ? ACTION_FAILED_MESSAGE : "공지를 수정했습니다.");
    await logAction("notice_update", "notice", noticeId);
    await loadAdminData();
  }

  async function deleteNotice(noticeId: string) {
    if (!confirmAction("공지를 삭제할까요?")) return;
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const { error } = await supabase.from("notices").delete().eq("id", noticeId);
    setMessage(error ? ACTION_FAILED_MESSAGE : "공지를 삭제했습니다.");
    await logAction("notice_delete", "notice", noticeId);
    await loadAdminData();
  }

  async function pinPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const form = new FormData(event.currentTarget);
    const postId = formText(form, "post_id");
    const placement = formText(form, "placement") || "board_top";
    const startsAt = inputToIso(formText(form, "starts_at"));
    const endsAt = inputToIso(formText(form, "ends_at"));
    if (!postId || !endsAt) {
      setMessage("게시글 ID와 종료 시각이 필요합니다.");
      return;
    }
    if (!confirmAction("게시글 상단고정을 등록할까요?")) return;

    const payload: Record<string, string | boolean | null> = {
      post_id: postId,
      placement,
      ends_at: endsAt,
      is_active: true,
      created_by: userId
    };
    if (startsAt) payload.starts_at = startsAt;

    const { error } = await supabase.from("promoted_posts").insert(payload);

    if (!error) {
      await supabase
        .from("posts")
        .update({
          pinned_until: endsAt,
          urgent_until: placement === "urgent_raid" ? endsAt : null
        })
        .eq("id", postId);
    }

    setMessage(error ? ACTION_FAILED_MESSAGE : "상단고정을 등록했습니다.");
    await logAction("promote_post", "post", postId, { placement, ends_at: endsAt });
    event.currentTarget.reset();
    await loadAdminData();
    router.refresh();
  }

  async function updatePromotion(event: FormEvent<HTMLFormElement>, promotion: Promotion) {
    event.preventDefault();
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const form = new FormData(event.currentTarget);
    const placement = formText(form, "placement");
    const startsAt = inputToIso(formText(form, "starts_at")) ?? new Date().toISOString();
    const endsAt = inputToIso(formText(form, "ends_at"));
    const isActive = form.get("is_active") === "on";
    if (!confirmAction("상단고정 설정을 수정할까요?")) return;
    const { error } = await supabase
      .from("promoted_posts")
      .update({ placement, starts_at: startsAt, ends_at: endsAt, is_active: isActive })
      .eq("id", promotion.id);

    if (!error) {
      await supabase
        .from("posts")
        .update({
          pinned_until: isActive ? endsAt : null,
          urgent_until: isActive && placement === "urgent_raid" ? endsAt : null
        })
        .eq("id", promotion.post_id);
    }

    setMessage(error ? ACTION_FAILED_MESSAGE : "상단고정을 수정했습니다.");
    await logAction("promotion_update", "post", promotion.post_id, { placement, is_active: String(isActive) });
    await loadAdminData();
    router.refresh();
  }

  async function stopPromotion(promotion: Promotion) {
    if (!confirmAction("상단고정을 종료할까요?")) return;
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const { error } = await supabase.from("promoted_posts").update({ is_active: false }).eq("id", promotion.id);
    if (!error) {
      await supabase.from("posts").update({ pinned_until: null, urgent_until: null }).eq("id", promotion.post_id);
    }
    setMessage(error ? ACTION_FAILED_MESSAGE : "상단고정을 종료했습니다.");
    await logAction("promotion_stop", "post", promotion.post_id);
    await loadAdminData();
    router.refresh();
  }

  async function upsertBanner(event: FormEvent<HTMLFormElement>, slotId?: string) {
    event.preventDefault();
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const form = new FormData(event.currentTarget);
    const placement = formText(form, "placement");
    const label = formText(form, "label");
    if (!placement || !label) {
      setMessage("배너 위치와 제목이 필요합니다.");
      return;
    }
    if (!confirmAction(slotId ? "배너 설정을 수정할까요?" : "배너를 등록할까요?")) return;

    const payload = {
      placement,
      label,
      description: formText(form, "description") || null,
      advertiser_name: formText(form, "advertiser_name") || null,
      sponsor_type: formText(form, "sponsor_type") || "general",
      target_region: formText(form, "target_region") || null,
      target_trade: formText(form, "target_trade") || null,
      image_path: formText(form, "image_path") || null,
      link_url: formText(form, "link_url") || null,
      starts_at: inputToIso(formText(form, "starts_at")) ?? new Date().toISOString(),
      ends_at: inputToIso(formText(form, "ends_at")),
      is_active: form.get("is_active") === "on",
      admin_memo: formText(form, "admin_memo") || null,
      updated_by: userId
    };

    const query = slotId ? supabase.from("ad_slots").update(payload).eq("id", slotId) : supabase.from("ad_slots").upsert(payload, { onConflict: "placement" });
    const { error } = await query;
    setMessage(error ? ACTION_FAILED_MESSAGE : "배너를 저장했습니다.");
    await logAction(slotId ? "banner_update" : "banner_upsert", "ad_slot", slotId, { placement });
    if (!slotId) event.currentTarget.reset();
    await loadAdminData();
    router.refresh();
  }

  async function updateUserCommercialStatus(profileId: string, payload: Partial<Pick<Profile, "role" | "is_premium_company">>, confirmMessage: string) {
    if (!confirmAction(confirmMessage)) return;
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const { error } = await supabase.from("profiles").update(payload).eq("id", profileId);
    setMessage(error ? ACTION_FAILED_MESSAGE : "사업자 표시 설정을 저장했습니다.");
    await logAction("profile_commercial_update", "profile", profileId, {
      role: payload.role ?? null,
      is_premium_company: payload.is_premium_company === undefined ? null : String(payload.is_premium_company)
    });
    await loadAdminData();
  }

  function reportTargetPost(report: Report) {
    if (report.target_type !== "post") return null;
    return posts.find((post) => post.id === report.target_id) ?? null;
  }

  function reportTargetComment(report: Report) {
    if (report.target_type !== "comment") return null;
    return comments.find((comment) => comment.id === report.target_id) ?? null;
  }

  function reportTargetHref(report: Report) {
    const comment = reportTargetComment(report);
    if (comment) return `/posts/${comment.post_id}`;
    if (report.target_type === "post") return `/posts/${report.target_id}`;
    return `/admin/users`;
  }

  function reportTargetTitle(report: Report) {
    const post = reportTargetPost(report);
    if (post) return post.title;

    const comment = reportTargetComment(report);
    if (comment) return comment.post?.title ?? "댓글이 달린 게시글";

    return "유저 신고";
  }

  function reportTargetAuthorId(report: Report) {
    const post = reportTargetPost(report);
    if (post) return post.author_id;

    const comment = reportTargetComment(report);
    if (comment) return comment.author_id;

    return "";
  }

  function renderReports(limit?: number) {
    const visibleReports = limit ? filteredReports.slice(0, limit) : filteredReports;
    const filterControls = (
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {[
          { key: "pending", label: `미처리 ${counts.pendingReports}` },
          { key: "done", label: `처리완료 ${reports.filter((report) => !isPendingReport(report)).length}` },
          { key: "post", label: `게시글 신고 ${reports.filter((report) => report.target_type === "post").length}` },
          { key: "comment", label: `댓글 신고 ${reports.filter((report) => report.target_type === "comment").length}` }
        ].map((filter) => (
          <button
            key={filter.key}
            className={`sub-button justify-center ${reportFilter === filter.key ? "border-accent bg-accent-soft text-amber-950" : ""}`}
            type="button"
            onClick={() => setReportFilter(filter.key as ReportFilter)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    );

    return (
      <div className="space-y-3">
        {!limit ? filterControls : null}
        {!visibleReports.length ? <EmptyAdminState>이 조건에 해당하는 신고가 없습니다.</EmptyAdminState> : null}
        {visibleReports.map((report) => (
          <div
            key={report.id}
            className={`rounded-md border p-3 ${
              isHighRiskReport(report) && isPendingReport(report) ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {isHighRiskReport(report) ? "긴급 확인 / " : ""}
                  {targetTypeLabel(report.target_type)} / {reportReasonLabel(report)} / {reportStatusLabel(report.status)}
                </p>
                <p className="mt-1 text-base font-bold text-slate-950">{reportTargetTitle(report)}</p>
                <p className="mt-1 break-all text-[12px] text-slate-500">대상 ID: {report.target_id}</p>
              </div>
              <Link className="sub-button" href={reportTargetHref(report)}>
                대상 보기
              </Link>
            </div>

            {report.detail ? <p className="mt-2 whitespace-pre-wrap rounded-sm border border-slate-200 bg-white p-2 text-sm font-normal leading-6 text-slate-700">{report.detail}</p> : null}
            {report.admin_note ? <p className="mt-2 whitespace-pre-wrap rounded-sm border border-amber-200 bg-amber-50 p-2 text-sm font-bold text-amber-950">처리 메모: {report.admin_note}</p> : null}

            <textarea
              className="field-input mt-2 min-h-20"
              value={adminNotes[report.id] ?? ""}
              onChange={(event) => setAdminNotes((current) => ({ ...current, [report.id]: event.target.value }))}
              placeholder="관리자 처리 메모. 예: 연락처 노출로 숨김, 사기 의심으로 작성자 차단"
            />

            <div className="mt-2 flex flex-wrap gap-2">
              {report.target_type === "post" ? (
                <button className="sub-button" type="button" onClick={() => hideReportedPost(report)}>
                  숨김 + 처리완료
                </button>
              ) : null}
              {report.target_type === "comment" ? (
                <button className="sub-button" type="button" onClick={() => deleteReportedComment(report)}>
                  댓글삭제 + 처리완료
                </button>
              ) : null}
              {reportTargetAuthorId(report) ? (
                <button
                  className="sub-button border-red-200 text-red-700"
                  type="button"
                  onClick={() =>
                    banUserById(reportTargetAuthorId(report), `신고 처리: ${reportReasonLabel(report)} ${noteForReport(report.id)}`, "신고 대상 작성자를 차단할까요?")
                  }
                >
                  작성자 차단
                </button>
              ) : null}
              <button className="sub-button" type="button" onClick={() => resolveReport(report.id, "resolved", noteForReport(report.id))}>
                처리 완료
              </button>
              <button className="sub-button" type="button" onClick={() => resolveReport(report.id, "dismissed", noteForReport(report.id))}>
                기각
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderPosts(limit?: number) {
    const visiblePosts = limit ? posts.slice(0, limit) : posts;
    if (!visiblePosts.length) return <EmptyAdminState>게시글이 없습니다.</EmptyAdminState>;

    return (
      <div className="space-y-2">
        {visiblePosts.map((post) => (
          <div key={post.id} className="rounded-md border border-slate-200 p-3">
            <p className="text-[12px] font-medium text-slate-500">
              {post.board?.name ?? "게시판"} / {POST_STATUS_LABELS[post.status]} / {formatDate(post.created_at)}
            </p>
            <p className="mt-1 text-base font-bold text-slate-950">{post.title}</p>
            <p className="mt-1 break-all text-[12px] text-slate-500">ID: {post.id}</p>
            <p className="mt-1 text-[12px] text-slate-500">작성자: {post.author?.nickname ?? post.author_id}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="sub-button" type="button" onClick={() => updatePost(post.id, { status: "hidden" }, "게시글을 숨김 처리할까요?")}>
                숨김
              </button>
              <button className="sub-button" type="button" onClick={() => updatePost(post.id, { status: "recruiting" }, "게시글 숨김을 해제하고 공개 상태로 바꿀까요?")}>
                숨김해제
              </button>
              <button className="sub-button" type="button" onClick={() => updatePost(post.id, { status: "closed" }, "게시글을 마감 또는 거래완료 상태로 바꿀까요?")}>
                {post.board?.slug === "tool-market" || post.board?.slug === "materials" ? "거래완료" : "마감"}
              </button>
              <button
                className="sub-button"
                type="button"
                onClick={() => updatePost(post.id, { urgent_until: new Date(Date.now() + 86_400_000).toISOString() }, "게시글을 긴급 24시간 노출로 처리할까요?")}
              >
                긴급 24시간
              </button>
              <Link className="sub-button" href={`/posts/${post.id}`}>
                보기
              </Link>
              <button className="sub-button border-red-200 text-red-700" type="button" onClick={() => updatePost(post.id, { status: "deleted" }, "게시글을 삭제 상태로 처리할까요?")}>
                삭제 처리
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderComments(limit?: number) {
    const visibleComments = limit ? comments.slice(0, limit) : comments;
    if (!visibleComments.length) return <EmptyAdminState>댓글이 없습니다.</EmptyAdminState>;

    return (
      <div className="space-y-2">
        {visibleComments.map((comment) => (
          <div key={comment.id} className="rounded-md border border-slate-200 p-3">
            <p className="text-[12px] font-medium text-slate-500">
              {comment.post?.title ?? "게시글"} / {comment.status} / {formatDate(comment.created_at)}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm font-bold text-slate-900">{comment.status === "deleted" ? "삭제된 댓글입니다." : comment.body}</p>
            <p className="mt-1 text-[12px] text-slate-500">작성자: {comment.author?.nickname ?? comment.author_id}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="sub-button" type="button" onClick={() => deleteComment(comment.id)} disabled={comment.status === "deleted"}>
                댓글 삭제
              </button>
              <Link className="sub-button" href={`/posts/${comment.post_id}`}>
                게시글 보기
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderUsers() {
    if (!profiles.length) return <EmptyAdminState>유저가 없습니다.</EmptyAdminState>;

    return (
      <div className="space-y-2">
        {profiles.map((profile) => (
          <div key={profile.id} className="rounded-md border border-slate-200 p-3">
            <p className="text-base font-bold text-slate-950">{profile.nickname}</p>
            <p className="mt-1 text-[12px] font-medium text-slate-500">
              {profile.role}
              {profile.is_admin ? " / 관리자" : ""}
              {profile.is_premium_company ? " / 사업자 정보 등록" : ""} / {profile.status} / {formatDate(profile.created_at)}
            </p>
            <p className="mt-1 break-all text-[12px] text-slate-500">ID: {profile.id}</p>
            <p className="mt-1 text-[12px] text-slate-500">
              지역: {profile.region ?? "-"} / 직종: {profile.interested_trade ?? "-"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                className="sub-button border-red-200 text-red-700"
                type="button"
                onClick={() => banUserById(profile.id, "관리자 직접 제한", "선택한 유저를 차단할까요?")}
                disabled={profile.status === "suspended" || profile.is_admin}
              >
                차단
              </button>
              <button className="sub-button" type="button" onClick={() => void unbanUser(profile.id)} disabled={profile.status !== "suspended"}>
                차단해제
              </button>
              <button
                className="sub-button"
                type="button"
                onClick={() => updateUserCommercialStatus(profile.id, { role: "company", is_premium_company: true }, "이 계정을 사업자 정보 등록 계정으로 표시할까요? 검증 보장이 아니라 노출 표시입니다.")}
              >
                사업자 정보 등록 표시
              </button>
              <button
                className="sub-button"
                type="button"
                onClick={() => updateUserCommercialStatus(profile.id, { role: "user", is_premium_company: false }, "이 계정을 일반 계정 표시로 되돌릴까요?")}
                disabled={profile.is_admin || profile.role === "admin"}
              >
                일반 표시로 변경
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderNotices() {
    return (
      <div className="space-y-4">
        <form onSubmit={createNotice} className="grid gap-3 rounded-md border border-slate-200 p-3">
          <h3 className="text-base font-bold text-slate-950">공지 등록</h3>
          <input className="field-input" name="title" placeholder="공지 제목" />
          <textarea className="field-input min-h-28" name="body" placeholder="공지 내용" />
          <label className="flex min-h-12 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 font-bold">
            <input name="is_published" type="checkbox" defaultChecked />
            공개
          </label>
          <button className="big-button" type="submit">
            공지 등록
          </button>
        </form>

        {notices.length ? (
          <div className="space-y-2">
            {notices.map((notice) => (
              <form key={notice.id} onSubmit={(event) => updateNotice(event, notice.id)} className="grid gap-2 rounded-md border border-slate-200 p-3">
                <input className="field-input" name="title" defaultValue={notice.title} />
                <textarea className="field-input min-h-28" name="body" defaultValue={notice.body} />
                <label className="flex min-h-12 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 font-bold">
                  <input name="is_published" type="checkbox" defaultChecked={notice.is_published} />
                  공개
                </label>
                <div className="flex flex-wrap gap-2">
                  <button className="sub-button" type="submit">
                    수정
                  </button>
                  <button className="sub-button border-red-200 text-red-700" type="button" onClick={() => deleteNotice(notice.id)}>
                    삭제
                  </button>
                </div>
              </form>
            ))}
          </div>
        ) : (
          <EmptyAdminState>공지 글이 없습니다.</EmptyAdminState>
        )}
      </div>
    );
  }

  function renderPromotions() {
    return (
      <div className="space-y-4">
        <NoticeBox tone="muted" title="상단고정/급구 운영 기준">
          <p>상단고정과 긴급 노출은 결제 없이 운영자가 수동으로 등록합니다.</p>
          <p>급구 표시는 노출 강조일 뿐이며, JOBDAY가 출근이나 임금 지급을 보장한다는 뜻이 아닙니다.</p>
        </NoticeBox>
        <form onSubmit={pinPost} className="grid gap-3 rounded-md border border-slate-200 p-3">
          <h3 className="text-base font-bold text-slate-950">상단고정 등록</h3>
          <input className="field-input" name="post_id" placeholder="게시글 ID" />
          <select className="field-input" name="placement" defaultValue="board_top">
            {promotionPlacements.map((placement) => (
              <option key={placement.value} value={placement.value}>
                {placement.label}
              </option>
            ))}
          </select>
          <input className="field-input" name="starts_at" type="datetime-local" aria-label="시작일" />
          <input className="field-input" name="ends_at" type="datetime-local" aria-label="종료일" />
          <button className="big-button" type="submit">
            고정 등록
          </button>
        </form>

        {promotions.length ? (
          <div className="space-y-2">
            {promotions.map((promotion) => (
              <form key={promotion.id} onSubmit={(event) => updatePromotion(event, promotion)} className="grid gap-2 rounded-md border border-slate-200 p-3">
                <p className="text-base font-bold text-slate-950">{promotion.post?.title ?? promotion.post_id}</p>
                <p className="break-all text-[12px] text-slate-500">게시글 ID: {promotion.post_id}</p>
                <select className="field-input" name="placement" defaultValue={promotion.placement}>
                  {promotionPlacements.map((placement) => (
                    <option key={placement.value} value={placement.value}>
                      {placement.label}
                    </option>
                  ))}
                </select>
                <input className="field-input" name="starts_at" type="datetime-local" defaultValue={asDateTimeInput(promotion.starts_at)} aria-label="시작일" />
                <input className="field-input" name="ends_at" type="datetime-local" defaultValue={asDateTimeInput(promotion.ends_at)} aria-label="종료일" />
                <label className="flex min-h-12 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 font-bold">
                  <input name="is_active" type="checkbox" defaultChecked={promotion.is_active} />
                  활성
                </label>
                <div className="flex flex-wrap gap-2">
                  <button className="sub-button" type="submit">
                    수정
                  </button>
                  <button className="sub-button" type="button" onClick={() => stopPromotion(promotion)}>
                    고정 종료
                  </button>
                </div>
              </form>
            ))}
          </div>
        ) : (
          <EmptyAdminState>상단고정 글이 없습니다.</EmptyAdminState>
        )}
      </div>
    );
  }

  function renderBanners() {
    return (
      <div className="space-y-4">
        <NoticeBox tone="muted" title="광고/스폰서 수동 운영 안내">
          <p>베타 단계에서는 광고 결제, 요금제, 자동 과금을 만들지 않습니다. 운영자가 외부에서 합의한 내용을 이 화면에 수동 등록합니다.</p>
          <p>사용자 화면에는 광고 또는 스폰서 라벨이 표시되며, 사업자 정보 등록은 검증 보장이 아닌 공개 정보 표시입니다.</p>
        </NoticeBox>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {bannerPlacements.map((placement) => (
            <div key={placement.value} className="rounded-md border border-slate-200 bg-white p-3">
              <p className="text-sm font-bold leading-5 text-slate-950">{placement.label}</p>
              <p className="mt-1 break-all text-[12px] font-medium leading-5 text-slate-500">{placement.value}</p>
            </div>
          ))}
        </div>
        <form onSubmit={(event) => upsertBanner(event)} className="grid gap-3 rounded-md border border-slate-200 p-3">
          <h3 className="text-base font-bold text-slate-950">배너 등록</h3>
          <select className="field-input" name="placement" defaultValue="home_top">
            {bannerPlacements.map((placement) => (
              <option key={placement.value} value={placement.value}>
                {placement.label}
              </option>
            ))}
          </select>
          <input className="field-input" name="label" placeholder="배너 제목" />
          <input className="field-input" name="advertiser_name" placeholder="업체명 또는 광고주명" />
          <select className="field-input" name="sponsor_type" defaultValue="general">
            {sponsorTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <input className="field-input" name="target_region" placeholder="대상 지역. 예: 경기, 부산" />
          <input className="field-input" name="target_trade" placeholder="대상 직종. 예: 타일, 전기" />
          <input className="field-input" name="description" placeholder="관리용 설명. 예: 7월 공구상 배너" />
          <input className="field-input" name="image_path" placeholder="이미지 URL" />
          <input className="field-input" name="link_url" placeholder="링크 URL" />
          <input className="field-input" name="starts_at" type="datetime-local" aria-label="시작일" />
          <input className="field-input" name="ends_at" type="datetime-local" aria-label="종료일" />
          <textarea className="field-input min-h-20" name="admin_memo" placeholder="운영 메모. 예: 결제는 외부 수동 처리, 노출 종료 전 확인" />
          <label className="flex min-h-12 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 font-bold">
            <input name="is_active" type="checkbox" defaultChecked />
            활성
          </label>
          <button className="big-button" type="submit">
            배너 저장
          </button>
        </form>

        {adSlots.length ? (
          <div className="space-y-2">
            {adSlots.map((slot) => (
              <form key={slot.id} onSubmit={(event) => upsertBanner(event, slot.id)} className="grid gap-2 rounded-md border border-slate-200 p-3">
                <select className="field-input" name="placement" defaultValue={slot.placement}>
                  {bannerPlacements.map((placement) => (
                    <option key={placement.value} value={placement.value}>
                      {placement.label}
                    </option>
                  ))}
                </select>
                <input className="field-input" name="label" defaultValue={slot.label} />
                <input className="field-input" name="advertiser_name" placeholder="업체명 또는 광고주명" defaultValue={slot.advertiser_name ?? ""} />
                <select className="field-input" name="sponsor_type" defaultValue={slot.sponsor_type ?? "general"}>
                  {sponsorTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <input className="field-input" name="target_region" placeholder="대상 지역" defaultValue={slot.target_region ?? ""} />
                <input className="field-input" name="target_trade" placeholder="대상 직종" defaultValue={slot.target_trade ?? ""} />
                <input className="field-input" name="description" placeholder="관리용 설명" defaultValue={slot.description ?? ""} />
                <input className="field-input" name="image_path" placeholder="이미지 URL" defaultValue={slot.image_path ?? ""} />
                <input className="field-input" name="link_url" placeholder="링크 URL" defaultValue={slot.link_url ?? ""} />
                <input className="field-input" name="starts_at" type="datetime-local" defaultValue={asDateTimeInput(slot.starts_at)} aria-label="시작일" />
                <input className="field-input" name="ends_at" type="datetime-local" defaultValue={asDateTimeInput(slot.ends_at)} aria-label="종료일" />
                <textarea className="field-input min-h-20" name="admin_memo" placeholder="운영 메모" defaultValue={slot.admin_memo ?? ""} />
                <label className="flex min-h-12 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 font-bold">
                  <input name="is_active" type="checkbox" defaultChecked={slot.is_active} />
                  활성
                </label>
                <button className="sub-button" type="submit">
                  저장
                </button>
              </form>
            ))}
          </div>
        ) : (
          <EmptyAdminState>배너 자리가 없습니다.</EmptyAdminState>
        )}
      </div>
    );
  }

  function renderActions() {
    if (!actions.length) return <EmptyAdminState>관리자 활동 로그가 없습니다.</EmptyAdminState>;

    return (
      <div className="divide-y divide-slate-200 rounded-md border border-slate-200">
        {actions.map((action) => (
          <div key={action.id} className="p-3">
            <p className="text-sm font-bold text-slate-950">
              {action.action} / {action.target_type ?? "-"}
            </p>
            <p className="mt-1 text-[12px] text-slate-500">
              {action.admin?.nickname ?? action.admin_id} / {formatDate(action.created_at)}
            </p>
            {action.target_id ? <p className="mt-1 break-all text-[12px] text-slate-500">대상 ID: {action.target_id}</p> : null}
            {action.detail && Object.keys(action.detail).length ? (
              <p className="mt-1 break-all text-[12px] font-medium text-slate-600">
                {Object.entries(action.detail)
                  .filter(([, value]) => value)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(" / ")}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  if (loading) {
    return <LoadingState title="관리자 정보를 확인하는 중입니다" />;
  }

  if (!isAdmin) {
    return (
      <NoticeBox title="접근할 수 없습니다" tone="muted">
        <p>{message || "관리자 권한이 있는 계정으로 로그인해야 합니다."}</p>
        <p>관리자 계정 설정이 필요하면 운영자가 계정 권한을 먼저 확인해야 합니다.</p>
      </NoticeBox>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[190px_minmax(0,1fr)]">
      <aside className="board-panel p-3 lg:sticky lg:top-3 lg:self-start">
        <p className="mb-2 text-sm font-medium text-muted">관리 메뉴</p>
        <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {adminNav.map((item) => (
            <ButtonLink
              key={item.section}
              className={`justify-start ${section === item.section ? "border-accent bg-accent-soft text-amber-950" : ""}`}
              href={item.href}
            >
              {item.label}
            </ButtonLink>
          ))}
        </nav>
      </aside>

      <div className="space-y-4">
        {message ? <ErrorMessage tone="muted">{message}</ErrorMessage> : null}

        {section === "overview" ? (
          <>
            <AdminCard title="관리 현황" description="결제 없이 운영자가 수동으로 신고, 숨김, 고정, 배너를 처리합니다.">
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                <Link className="rounded-md border border-slate-200 p-3" href="/admin/reports">
                  <p className="text-sm font-medium text-slate-500">대기 신고</p>
                  <p className="mt-1 text-2xl font-bold text-accent">{counts.pendingReports}</p>
                </Link>
                <Link className="rounded-md border border-slate-200 p-3" href="/admin/posts">
                  <p className="text-sm font-medium text-slate-500">숨김 글</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{counts.hiddenPosts}</p>
                </Link>
                <Link className="rounded-md border border-slate-200 p-3" href="/admin/comments">
                  <p className="text-sm font-medium text-slate-500">삭제 댓글</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{counts.deletedComments}</p>
                </Link>
                <Link className="rounded-md border border-slate-200 p-3" href="/admin/users">
                  <p className="text-sm font-medium text-slate-500">차단 유저</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{counts.bannedUsers}</p>
                </Link>
                <Link className="rounded-md border border-slate-200 p-3" href="/admin/promotions">
                  <p className="text-sm font-medium text-slate-500">상단고정</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{counts.activePromotions}</p>
                </Link>
                <Link className="rounded-md border border-slate-200 p-3" href="/admin/banners">
                  <p className="text-sm font-medium text-slate-500">활성 배너</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{counts.activeBanners}</p>
                </Link>
              </div>
            </AdminCard>
            <AdminCard title="최근 신고">{renderReports(5)}</AdminCard>
            <AdminCard title="최근 게시글">{renderPosts(5)}</AdminCard>
            <AdminCard title="관리자 활동 로그">{renderActions()}</AdminCard>
          </>
        ) : null}

        {section === "reports" ? <AdminCard title="신고 목록" description="신고됐다고 자동 삭제하지 않고 운영자가 숨김/삭제 여부를 판단합니다.">{renderReports()}</AdminCard> : null}
        {section === "posts" ? <AdminCard title="게시글 관리" description="게시글 숨김, 숨김해제, 구인글 마감, 삭제 처리를 합니다.">{renderPosts()}</AdminCard> : null}
        {section === "comments" ? <AdminCard title="댓글 관리" description="문제 댓글은 삭제 상태로 바꿉니다.">{renderComments()}</AdminCard> : null}
        {section === "users" ? (
          <>
            <AdminCard title="유저 차단" description="비공개 운영 제한입니다. 공개 블랙리스트로 노출하지 않습니다.">
              <form onSubmit={banUser} className="grid gap-3">
                <input className="field-input" name="user_id" placeholder="유저 ID" />
                <input className="field-input" name="reason" placeholder="제한 사유" />
                <button className="big-button" type="submit">
                  제한 등록
                </button>
              </form>
            </AdminCard>
            <AdminCard title="유저 목록">{renderUsers()}</AdminCard>
          </>
        ) : null}
        {section === "notices" ? <AdminCard title="공지 관리" description="공지 등록, 수정, 삭제를 처리합니다.">{renderNotices()}</AdminCard> : null}
        {section === "promotions" ? <AdminCard title="상단고정 관리" description="결제 없이 운영자가 수동으로 노출 기간을 관리합니다.">{renderPromotions()}</AdminCard> : null}
        {section === "banners" ? <AdminCard title="배너 관리" description="결제 없이 배너 자리와 노출 기간만 관리합니다.">{renderBanners()}</AdminCard> : null}
      </div>
    </div>
  );
}
