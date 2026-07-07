"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import type { Profile, Region, Trade } from "@/types/domain";
import { BlockedUserNotice, LoginRequiredNotice } from "@/components/account-notices";
import { POST_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { LOAD_FAILED_MESSAGE, LOGIN_REQUIRED_MESSAGE, SAVE_FAILED_MESSAGE, SUPABASE_SETUP_REQUIRED_MESSAGE } from "@/lib/user-messages";
import { Button, ButtonLink, EmptyState, ErrorMessage, FieldLabel, Input, LoadingState, SectionHeader, Textarea } from "./design-system";

type Props = {
  regions: Region[];
  trades: Trade[];
  initialMessage?: string;
};

const emptyProfile = {
  nickname: "",
  region: "",
  interested_trade: "",
  available_trades: "",
  bio: "",
  owned_tools: "",
  has_vehicle: false,
  can_travel: false
};

type MyPost = {
  id: string;
  title: string;
  status: "recruiting" | "closed" | "hidden" | "deleted";
  created_at: string;
  board?: { name: string; slug: string } | null;
};

export function ProfileForm({ regions, trades, initialMessage = "" }: Props) {
  const router = useRouter();
  const [profile, setProfile] = useState(emptyProfile);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState(initialMessage);
  const [messageTone, setMessageTone] = useState<"danger" | "success" | "warning" | "muted">("muted");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [myPosts, setMyPosts] = useState<MyPost[]>([]);
  const [myPostsMessage, setMyPostsMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
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
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) {
        setMessage(LOAD_FAILED_MESSAGE);
        setLoading(false);
        return;
      }

      const loaded = data as Profile | null;

      if (loaded) {
        setIsBlocked(loaded.status === "suspended" || loaded.status === "deleted");
        setProfile({
          nickname: loaded.nickname ?? "",
          region: loaded.region ?? "",
          interested_trade: loaded.interested_trade ?? "",
          available_trades: loaded.available_trades?.join(", ") ?? "",
          bio: loaded.bio ?? "",
          owned_tools: loaded.owned_tools ?? "",
          has_vehicle: loaded.has_vehicle ?? false,
          can_travel: loaded.can_travel ?? false
        });
      }

      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("id,title,status,created_at, board:boards(name,slug)")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (postsError) {
        setMyPostsMessage("내가 쓴 글을 불러오지 못했습니다.");
      } else {
        setMyPosts(
          ((posts ?? []) as Array<Omit<MyPost, "board"> & { board?: MyPost["board"] | MyPost["board"][] }>).map((post) => ({
            ...post,
            board: Array.isArray(post.board) ? (post.board[0] ?? null) : (post.board ?? null)
          }))
        );
      }

      setLoading(false);
    }

    void loadProfile();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setMessageTone("muted");
    setSaving(true);

    const supabase = createBrowserSupabaseClient();
    if (!supabase || !userId) {
      setMessageTone("danger");
      setMessage(!supabase ? SUPABASE_SETUP_REQUIRED_MESSAGE : LOGIN_REQUIRED_MESSAGE);
      setSaving(false);
      return;
    }

    const form = new FormData(event.currentTarget);
    const availableTrades = String(form.get("available_trades") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      id: userId,
      nickname: String(form.get("nickname") ?? "").trim(),
      region: String(form.get("region") ?? "").trim() || null,
      interested_trade: String(form.get("interested_trade") ?? "").trim() || null,
      available_trades: availableTrades,
      bio: String(form.get("bio") ?? "").trim() || null,
      owned_tools: String(form.get("owned_tools") ?? "").trim() || null,
      has_vehicle: form.get("has_vehicle") === "on",
      can_travel: form.get("can_travel") === "on"
    };

    const { error } = await supabase.from("profiles").upsert(payload);
    setMessageTone(error ? "danger" : "success");
    setMessage(error ? SAVE_FAILED_MESSAGE : "프로필을 저장했습니다.");
    setSaving(false);
    router.refresh();
  }

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase?.auth.signOut();
    router.push("/login?status=logged-out");
    router.refresh();
  }

  if (loading) {
    return <LoadingState title="내 정보를 불러오는 중입니다" />;
  }

  if (!userId) {
    return (
      <LoginRequiredNotice message={message || "마이페이지는 로그인 후 이용할 수 있습니다."} />
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="board-panel space-y-4 p-4">
        {isBlocked ? (
          <BlockedUserNotice message="현재 계정은 글쓰기와 댓글 작성이 제한되어 있습니다. 프로필 확인과 로그아웃은 가능합니다." />
        ) : null}

        <div>
          <FieldLabel htmlFor="nickname" label="닉네임" required />
          <Input id="nickname" name="nickname" required maxLength={24} defaultValue={profile.nickname} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="region" label="지역" />
            <Input id="region" name="region" list="region-list" defaultValue={profile.region} />
          </div>
          <div>
            <FieldLabel htmlFor="interested_trade" label="관심 직종" />
            <Input id="interested_trade" name="interested_trade" list="trade-list" defaultValue={profile.interested_trade} />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="available_trades" label="가능 직종" />
          <Input
            id="available_trades"
            name="available_trades"
            placeholder="예: 전기, 조공, 철거"
            defaultValue={profile.available_trades}
          />
        </div>

        <div>
          <FieldLabel htmlFor="owned_tools" label="보유 공구" />
          <Input id="owned_tools" name="owned_tools" placeholder="예: 임팩, 안전화, 공구벨트" defaultValue={profile.owned_tools} />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex min-h-12 items-center gap-3 rounded-sm border border-line-strong bg-white px-3 font-bold text-ink">
            <input className="h-5 w-5 accent-amber-700" name="has_vehicle" type="checkbox" defaultChecked={profile.has_vehicle} />
            차량 있음
          </label>
          <label className="flex min-h-12 items-center gap-3 rounded-sm border border-line-strong bg-white px-3 font-bold text-ink">
            <input className="h-5 w-5 accent-amber-700" name="can_travel" type="checkbox" defaultChecked={profile.can_travel} />
            원정 가능
          </label>
        </div>

        <div>
          <FieldLabel htmlFor="bio" label="자기소개" />
          <Textarea className="min-h-28" id="bio" name="bio" defaultValue={profile.bio} />
        </div>

        {message ? <ErrorMessage tone={messageTone}>{message}</ErrorMessage> : null}

        <div className="grid grid-cols-2 gap-2">
          <Button type="submit" variant="primary" size="lg" disabled={saving}>
            {saving ? "저장 중..." : "저장"}
          </Button>
          <Button type="button" onClick={signOut} disabled={saving}>
            로그아웃
          </Button>
        </div>

        <datalist id="region-list">
          {regions.map((region) => (
            <option key={region.id} value={region.name} />
          ))}
        </datalist>
        <datalist id="trade-list">
          {trades.map((trade) => (
            <option key={trade.id} value={trade.name} />
          ))}
        </datalist>
      </form>

      <section className="border border-line-strong bg-white">
        <SectionHeader title="내가 쓴 글" count={`${myPosts.length}개`} />
        {myPostsMessage ? <p className="px-3 py-3 text-sm font-semibold text-red-700">{myPostsMessage}</p> : null}
        {myPosts.length ? (
          <div className="divide-y divide-slate-200">
            {myPosts.map((post) => (
              <div key={post.id} className="px-3 py-3">
                <p className="text-[12px] font-medium leading-4 text-muted">
                  {post.board?.name ?? "게시판"} / {POST_STATUS_LABELS[post.status]} / {formatDate(post.created_at)}
                </p>
                <p className="mt-1 line-clamp-1 text-base font-semibold leading-6 text-ink">{post.title}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ButtonLink href={`/posts/${post.id}`} size="sm">
                    보기
                  </ButtonLink>
                  <ButtonLink href={`/posts/${post.id}/edit`} size="sm">
                    수정
                  </ButtonLink>
                  {post.board?.slug ? (
                    <ButtonLink href={`/boards/${post.board.slug}`} size="sm">
                      게시판
                    </ButtonLink>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3">
            <EmptyState title="아직 작성한 글이 없습니다" body="작업레이드, 공구장터, 현장질문 중 필요한 게시판에 첫 글을 올려보세요." href="/write" actionLabel="글쓰기" />
          </div>
        )}
      </section>
    </div>
  );
}
