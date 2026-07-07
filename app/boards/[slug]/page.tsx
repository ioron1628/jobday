import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ad-slot";
import { BoardNavigationTabs } from "@/components/board-navigation-tabs";
import { BoardFilters, type BoardFilterValues } from "@/components/board-filters";
import { BoardIconFrame, ButtonLink, CompactEmptyState, EmptyState, Icon, SectionHeader } from "@/components/design-system";
import { LegalNotice } from "@/components/legal-notice";
import { PostCard } from "@/components/post-card";
import { MARKET_BOARD_SLUGS, WORK_BOARD_SLUGS } from "@/lib/constants";
import { getBoard, getBoards, getPosts, getRegions, getTrades } from "@/lib/data";
import { asText, isActiveUntil } from "@/lib/format";
import type { Post } from "@/types/domain";

export const dynamic = "force-dynamic";

function pickExtra(post: Post, names: string[]) {
  for (const name of names) {
    const value = post.extra?.[name];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
}

function textMatches(value: unknown, filter: string) {
  if (!filter) return true;
  return asText(value).toLowerCase().includes(filter.toLowerCase());
}

function isTruthy(value: unknown) {
  return value === true || value === "true" || value === "예" || value === "가능" || value === "1";
}

function dateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function matchesDateFilter(value: unknown, filter: string) {
  if (!filter) return true;
  const text = asText(value);
  if (text === "-") return false;

  const target = new Date(text);
  if (Number.isNaN(target.getTime())) return text.includes(filter);

  const today = new Date();
  const compare = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (filter === "tomorrow") compare.setDate(compare.getDate() + 1);
  if (filter !== "today" && filter !== "tomorrow") return true;

  return dateKey(target) === dateKey(compare);
}

function popularityScore(post: Post) {
  return post.up_count * 4 + post.comment_count * 3 + post.view_count;
}

function sortPosts(posts: Post[], sort: string) {
  return [...posts].sort((left, right) => {
    if (sort === "popular") {
      const scoreDiff = popularityScore(right) - popularityScore(left);
      if (scoreDiff !== 0) return scoreDiff;
    }

    const pinnedDiff = new Date(right.pinned_until ?? 0).getTime() - new Date(left.pinned_until ?? 0).getTime();
    if (pinnedDiff !== 0) return pinnedDiff;
    return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
  });
}

function adPlacementForBoard(slug: string) {
  if (slug === "tool-market") return { placement: "tool_market_sponsor", label: "공구장터 스폰서 자리" };
  if (slug === "materials") return { placement: "market_top", label: "자재/공구 마켓 광고 자리" };
  if (slug === "beginner") return { placement: "beginner_guide_sponsor", label: "초보입문 후원 자리" };
  if (slug === "work-raid" || slug === "remote-raid" || slug === "dimodo") {
    return { placement: "region_board_top", label: "지역 작업 광고 자리" };
  }
  return { placement: "trade_board_top", label: "직종/게시판 광고 자리" };
}

function isPinnedOrUrgent(post: Post) {
  return isActiveUntil(post.pinned_until) || isActiveUntil(post.urgent_until);
}

function boardListHref(slug: string, filters: BoardFilterValues) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (!value) return;
    if (key === "sort" && value === "latest") return;
    params.set(key, String(value));
  });
  const query = params.toString();
  return query ? `/boards/${slug}?${query}` : `/boards/${slug}`;
}

function writeButtonLabel(slug: string, fallbackName: string) {
  if (slug === "work-raid") return "작업레이드 올리기";
  if (slug === "remote-raid") return "원정레이드 올리기";
  if (slug === "dimodo") return "보조글 올리기";
  if (slug === "available-today") return "일당 가능글 올리기";
  if (slug === "tool-market") return "공구글 올리기";
  if (slug === "materials") return "자재글 올리기";
  return `${fallbackName} 글쓰기`;
}

function matchesFilters(post: Post, filters: BoardFilterValues) {
  if (filters.region) {
    const values = [
      post.region_text,
      pickExtra(post, ["site_region"]),
      pickExtra(post, ["available_region"]),
      pickExtra(post, ["market_region"]),
      pickExtra(post, ["departure_region"])
    ];
    if (!values.some((value) => textMatches(value, filters.region ?? ""))) return false;
  }

  if (filters.trade) {
    const values = [post.trade_text, pickExtra(post, ["trade"]), pickExtra(post, ["available_trade"])];
    if (!values.some((value) => textMatches(value, filters.trade ?? ""))) return false;
  }

  if (filters.status && post.status !== filters.status) return false;
  if (filters.recruitingOnly === "1" && post.status !== "recruiting") return false;
  if (filters.date) {
    const dateValues = [post.work_date, pickExtra(post, ["work_date"]), pickExtra(post, ["available_date"])];
    if (!dateValues.some((value) => matchesDateFilter(value, filters.date ?? ""))) return false;
  }
  if (filters.lodging === "1" && !isTruthy(pickExtra(post, ["lodging_provided"]))) return false;
  if (filters.beginner === "1" && !isTruthy(pickExtra(post, ["beginner_ok"]))) return false;
  if (filters.travel === "1") {
    const travelValues = [
      pickExtra(post, ["can_travel"]),
      pickExtra(post, ["transportation_provided"]),
      pickExtra(post, ["ride_share_available"]),
      pickExtra(post, ["transport"])
    ];
    if (!travelValues.some((value) => isTruthy(value) || asText(value).includes("원정") || asText(value).includes("동승"))) return false;
  }

  return true;
}

export default async function BoardDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<BoardFilterValues>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const [board, boards, regions, trades] = await Promise.all([
    getBoard(resolvedParams.slug),
    getBoards(),
    getRegions(),
    getTrades()
  ]);
  if (!board) notFound();

  const filters: BoardFilterValues = {
    q: resolvedSearchParams?.q ?? "",
    region: resolvedSearchParams?.region ?? "",
    trade: resolvedSearchParams?.trade ?? "",
    date: resolvedSearchParams?.date ?? "",
    status: resolvedSearchParams?.status ?? "",
    sort: resolvedSearchParams?.sort ?? "latest",
    lodging: resolvedSearchParams?.lodging ?? "",
    beginner: resolvedSearchParams?.beginner ?? "",
    travel: resolvedSearchParams?.travel ?? "",
    recruitingOnly: resolvedSearchParams?.recruitingOnly ?? ""
  };
  const q = filters.q ?? "";
  const allPosts = await getPosts({ boardSlug: board.slug, search: q, limit: 80 });
  const posts = sortPosts(allPosts.filter((post) => matchesFilters(post, filters)), filters.sort ?? "latest");
  const sideBoards = boards.filter((item) => item.slug !== board.slug).slice(0, 8);
  const isWorkBoard = WORK_BOARD_SLUGS.includes(board.slug);
  const isMarketBoard = MARKET_BOARD_SLUGS.includes(board.slug);
  const adPlacement = adPlacementForBoard(board.slug);
  const showPinnedArea = board.slug === "work-raid" || board.slug === "remote-raid";
  const pinnedPosts = showPinnedArea ? posts.filter(isPinnedOrUrgent) : [];
  const regularPosts = pinnedPosts.length ? posts.filter((post) => !isPinnedOrUrgent(post)) : posts;
  const currentListHref = boardListHref(board.slug, filters);
  const writeLabel = writeButtonLabel(board.slug, board.name);
  const hasActiveFilter = Boolean(q || filters.region || filters.trade || filters.date || filters.status || filters.lodging || filters.beginner || filters.travel || filters.recruitingOnly);
  const isBeginnerBoard = board.slug === "beginner";
  const showCommercialBottom = isMarketBoard || isBeginnerBoard;

  return (
    <div className="space-y-3 xl:grid xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-4 xl:space-y-0">
      <div className="space-y-3">
        <section className="border border-line-strong bg-white p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-accent">{board.category}</p>
              <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold leading-[1.3] text-ink">
                <BoardIconFrame board={board} />
                {board.name}
              </h1>
              <p className="mt-1 text-base font-medium leading-6 text-muted">{board.description}</p>
              {isWorkBoard ? (
                <p className="mt-2 text-sm font-semibold leading-5 text-ink">
                  지역, 날짜, 직종, 일당, 인원, 숙소, 초보가능을 먼저 확인하세요.
                </p>
              ) : null}
            </div>
            <ButtonLink href={`/boards/${board.slug}/new`} className="shrink-0" variant="primary" size="lg">
              <Icon name="pencil" className="mr-1.5 h-4 w-4" />
              {writeLabel}
            </ButtonLink>
          </div>
        </section>

        <BoardNavigationTabs boards={boards} currentSlug={board.slug} />

        <BoardFilters
          action={`/boards/${board.slug}`}
          values={filters}
          regions={regions}
          trades={trades}
          showWorkFilters={isWorkBoard}
        />

        <section className="space-y-2">
          {pinnedPosts.length ? (
            <div className="border border-yellow-300 bg-yellow-50">
              <SectionHeader title="상단고정/급구 작업레이드" count={`${pinnedPosts.length}개`} />
              <div className="border-t border-yellow-200">
                {pinnedPosts.map((post) => (
                  <PostCard key={post.id} post={post} fromHref={currentListHref} />
                ))}
              </div>
            </div>
          ) : null}

          <SectionHeader
            title={q || filters.region || filters.trade ? "검색/필터 결과" : "글 목록"}
            count={`${regularPosts.length}개 · ${filters.sort === "popular" ? "인기순" : "최신순"}`}
          />
          {regularPosts.length ? (
            <div className="border-x border-t border-line-strong">
              {regularPosts.map((post) => (
                <PostCard key={post.id} post={post} fromHref={currentListHref} />
              ))}
            </div>
          ) : posts.length ? (
            <CompactEmptyState title="일반 글은 아직 없습니다" body="상단고정/급구 글을 먼저 확인하거나 새 글을 올려보세요." href={`/boards/${board.slug}/new`} actionLabel={writeLabel} />
          ) : (
            <EmptyState
              title={hasActiveFilter ? "조건에 맞는 글이 없습니다" : `아직 ${board.name} 글이 없습니다`}
              body={hasActiveFilter ? "필터를 줄이거나 검색어를 짧게 바꿔보세요." : "첫 글을 올려 현장 정보를 공유해 보세요."}
              href={hasActiveFilter ? `/boards/${board.slug}` : `/boards/${board.slug}/new`}
              actionLabel={hasActiveFilter ? "필터 없이 보기" : writeLabel}
            />
          )}
        </section>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ButtonLink href={`/boards/${board.slug}/new`} variant="primary" size="lg">
            <Icon name="pencil" className="mr-1.5 h-4 w-4" />
            {writeLabel}
          </ButtonLink>
          <ButtonLink href="/boards" size="lg">
            <Icon name="board" className="mr-1.5 h-4 w-4" />
            전체 게시판
          </ButtonLink>
        </div>

        {showCommercialBottom ? (
          <section className="grid gap-2 sm:grid-cols-2 xl:hidden">
            {board.slug === "tool-market" ? <AdSlot placement="tool_market_sponsor" label="공구상 추천 스폰서 자리" /> : null}
            {board.slug === "materials" ? <AdSlot placement="market_top" label="자재/공구 마켓 광고 자리" /> : null}
            {isMarketBoard ? <AdSlot placement="group_buy_preview" label="공구/자재 공동구매 예고 자리" /> : null}
            {isBeginnerBoard ? <AdSlot placement="beginner_guide_sponsor" label="초보입문 가이드 후원 자리" /> : null}
            {isBeginnerBoard ? <AdSlot placement="workwear_safety_sponsor" label="작업복/안전화 스폰서 자리" /> : null}
          </section>
        ) : null}

        <div className="space-y-3 xl:hidden">
          <LegalNotice boardSlug={board.slug} collapsible />
          {!showCommercialBottom ? <AdSlot placement={adPlacement.placement} label={adPlacement.label} /> : null}
        </div>
      </div>

      <aside className="hidden space-y-3 xl:block">
        <section className="border border-line-strong bg-white">
          <h2 className="border-b border-line-strong bg-soft px-3 py-2 text-lg font-bold leading-[1.35] text-ink">게시판 바로가기</h2>
          <div className="divide-y divide-slate-200">
            {sideBoards.map((item) => (
              <Link key={item.id} href={`/boards/${item.slug}`} className="block px-3 py-2 text-base font-semibold text-ink active:bg-amber-50">
                {item.name}
              </Link>
            ))}
          </div>
        </section>
        <AdSlot placement={adPlacement.placement} label={adPlacement.label} />
        {isMarketBoard ? <AdSlot placement="group_buy_preview" label="공구/자재 공동구매 예고 자리" /> : null}
        {board.slug === "beginner" ? <AdSlot placement="workwear_safety_sponsor" label="작업복/안전화 스폰서 자리" /> : null}
        <LegalNotice boardSlug={board.slug} collapsible />
      </aside>
    </div>
  );
}
