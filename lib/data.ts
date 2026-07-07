import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mockAdSlots, mockBoards, mockComments, mockNotices, mockPosts, mockRegions, mockTrades } from "@/lib/mock-data";
import type { AdSlot, Board, Comment, JsonValue, Notice, Post, PostExtra, PostImage, Region, Trade } from "@/types/domain";

function withImageUrls(images: PostImage[] | null | undefined): PostImage[] {
  const supabase = createServerSupabaseClient();
  if (!images || !supabase) return images ?? [];

  return images.map((image) => ({
    ...image,
    public_url: supabase.storage.from("post-images").getPublicUrl(image.storage_path).data.publicUrl
  }));
}

function normalizeBoard(board: Board): Board {
  if (board.slug !== "dimodo") return board;

  return {
    ...board,
    name: "보조구함",
    description: "보조 인력, 조공, 현장 보조 정보 공유 게시판"
  };
}

function normalizeLegacyLabel(value: string) {
  return value.replaceAll("디모도구함", "보조구함").replaceAll("디모도", "보조");
}

function normalizeNullableText(value: string | null) {
  return typeof value === "string" ? normalizeLegacyLabel(value) : value;
}

function normalizeJsonValue(value: JsonValue): JsonValue {
  if (typeof value === "string") return normalizeLegacyLabel(value);
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === "string")) return value.map(normalizeLegacyLabel);
    return value;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, typeof item === "string" ? normalizeLegacyLabel(item) : item])
    ) as Record<string, string | number | boolean | null>;
  }

  return value;
}

function normalizePostExtra(extra: PostExtra): PostExtra {
  return Object.fromEntries(Object.entries(extra ?? {}).map(([key, value]) => [key, normalizeJsonValue(value)]));
}

function normalizePost(post: Post): Post {
  return {
    ...post,
    title: normalizeLegacyLabel(post.title),
    body: normalizeLegacyLabel(post.body),
    region_text: normalizeNullableText(post.region_text),
    trade_text: normalizeNullableText(post.trade_text),
    contact_method: normalizeNullableText(post.contact_method),
    extra: normalizePostExtra(post.extra),
    board: post.board ? normalizeBoard(post.board) : post.board,
    images: withImageUrls(post.images)
  };
}

async function getReportCount(targetType: "post" | "comment", targetId: string) {
  const supabase = createServerSupabaseClient();
  if (!supabase) return 0;

  const { data, error } = await supabase.rpc("get_report_count", {
    target_type_input: targetType,
    target_id_input: targetId
  });

  if (error || typeof data !== "number") return 0;
  return data;
}

export async function getBoards() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return mockBoards.map(normalizeBoard);

  const { data } = await supabase
    .from("boards")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return ((data ?? []) as Board[]).map(normalizeBoard);
}

export async function getBoard(slug: string) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    const board = mockBoards.find((item) => item.slug === slug);
    return board ? normalizeBoard(board) : null;
  }

  const { data } = await supabase.from("boards").select("*").eq("slug", slug).maybeSingle();
  return data ? normalizeBoard(data as Board) : null;
}

export async function getRegions() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return mockRegions;

  const { data } = await supabase.from("regions").select("*").order("sort_order", { ascending: true });
  return (data ?? []) as Region[];
}

export async function getTrades() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return mockTrades;

  const { data } = await supabase.from("trades").select("*").order("sort_order", { ascending: true });
  return (data ?? []) as Trade[];
}

type PostQuery = {
  boardSlug?: string;
  search?: string;
  limit?: number;
};

export async function getPosts({ boardSlug, search, limit = 40 }: PostQuery = {}) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    const keyword = search?.trim().toLowerCase();
    return mockPosts
      .filter((post) => !boardSlug || post.board?.slug === boardSlug)
      .filter((post) => {
        if (!keyword) return true;
        return [post.title, post.body, post.region_text, post.trade_text, post.board?.name]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(keyword));
      })
      .slice(0, limit)
      .map(normalizePost);
  }

  let boardId: string | undefined;
  if (boardSlug) {
    const board = await getBoard(boardSlug);
    if (!board) return [] as Post[];
    boardId = board.id;
  }

  let query = supabase
    .from("posts")
    .select(
      "*, board:boards(*), author:profiles!posts_author_id_fkey(id,nickname,region,interested_trade,available_trades,can_travel,is_premium_company), images:post_images(*)"
    )
    .in("status", ["recruiting", "closed"]);

  if (boardId) {
    query = query.eq("board_id", boardId);
  }

  if (search?.trim()) {
    const keyword = search.trim().replace(/[%,]/g, "");
    query = query.or(
      `title.ilike.%${keyword}%,body.ilike.%${keyword}%,region_text.ilike.%${keyword}%,trade_text.ilike.%${keyword}%`
    );
  }

  const { data } = await query
    .order("pinned_until", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  return ((data ?? []) as Post[]).map(normalizePost);
}

export async function getPost(id: string) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    const post = mockPosts.find((item) => item.id === id);
    return post ? normalizePost(post) : null;
  }

  await supabase.rpc("increment_post_view_count", { post_id_input: id });

  const { data } = await supabase
    .from("posts")
    .select(
      "*, board:boards(*), author:profiles!posts_author_id_fkey(id,nickname,region,interested_trade,available_trades,can_travel,is_premium_company), images:post_images(*)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;

  const post = normalizePost(data as Post);
  post.report_count = await getReportCount("post", post.id);
  return post;
}

export async function getComments(postId: string) {
  const supabase = createServerSupabaseClient();
  if (!supabase) return mockComments.filter((comment) => comment.post_id === postId);

  const { data } = await supabase
    .from("comments")
    .select("*, author:profiles!comments_author_id_fkey(id,nickname,region,interested_trade,available_trades,can_travel,is_premium_company)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  const comments = (data ?? []) as Comment[];
  return Promise.all(
    comments.map(async (comment) => ({
      ...comment,
      report_count: await getReportCount("comment", comment.id)
    }))
  );
}

export async function getNotices() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return mockNotices;

  const { data } = await supabase
    .from("notices")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (data ?? []) as Notice[];
}

export async function getAdSlots() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return mockAdSlots;

  const { data } = await supabase.from("ad_slots").select("*").order("placement", { ascending: true });
  return (data ?? []) as AdSlot[];
}

export async function getAdSlot(placement: string) {
  const supabase = createServerSupabaseClient();
  if (!supabase) return mockAdSlots.find((slot) => slot.placement === placement) ?? null;

  const { data } = await supabase.from("ad_slots").select("*").eq("placement", placement).maybeSingle();
  return data as AdSlot | null;
}
