import type { ReactNode } from "react";
import { AdSlot } from "@/components/ad-slot";
import { AuthorProfileMiniCard } from "@/components/author-profile-mini-card";
import { BoardNavigationTabs } from "@/components/board-navigation-tabs";
import { CommentSection } from "@/components/comment-section";
import { ConditionClarity } from "@/components/condition-clarity";
import { AuthorIdentity, Badge, ButtonLink, Icon, SectionHeader } from "@/components/design-system";
import { HiddenPostNotice } from "@/components/hidden-post-notice";
import { LegalNotice } from "@/components/legal-notice";
import { PostInteractions } from "@/components/post-interactions";
import { PostOwnerActions } from "@/components/post-owner-actions";
import { SavePostButton } from "@/components/save-post-button";
import { ShareSummaryButton } from "@/components/share-summary-button";
import { StatusBadge } from "@/components/status-badge";
import { MARKET_BOARD_SLUGS, POST_STATUS_LABELS, SPECIAL_FIELDS_BY_BOARD, WORK_BOARD_SLUGS } from "@/lib/constants";
import { asText, formatDate, formatDay, formatMoney, isActiveUntil } from "@/lib/format";
import { getBoards, getComments, getPost, getPosts } from "@/lib/data";
import type { Post } from "@/types/domain";

export const dynamic = "force-dynamic";

function DetailItem({
  label,
  value,
  money = false,
  important = false
}: {
  label: string;
  value: unknown;
  money?: boolean;
  important?: boolean;
}) {
  return (
    <div className="border-b border-r border-line-strong bg-white px-3 py-3">
      <dt className="text-[13px] font-medium leading-5 text-muted">{label}</dt>
      <dd className={`mt-1 text-base font-bold leading-6 ${important ? "text-amber-900" : "text-ink"}`}>
        {money ? formatMoney(value as string | number | null | undefined) : asText(value)}
      </dd>
    </div>
  );
}

function DetailBox({
  title,
  children,
  collapsible = false
}: {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
}) {
  const grid = <dl className="grid grid-cols-2 border-l border-t border-line-strong sm:grid-cols-4">{children}</dl>;

  if (collapsible) {
    return (
      <details className="border-t border-line-strong bg-slate-50" open>
        <summary className="flex min-h-11 cursor-pointer items-center justify-between px-3 py-2 text-base font-bold text-ink">
          <span>{title}</span>
          <span className="text-sm font-medium text-muted">접기/펼치기</span>
        </summary>
        {grid}
      </details>
    );
  }

  return (
    <section className="border-t-4 border-accent bg-accent-soft">
      <h2 className="px-3 py-2 text-base font-bold text-ink">{title}</h2>
      {grid}
    </section>
  );
}

function extraValue(post: Awaited<ReturnType<typeof getPost>>, names: string[]) {
  if (!post) return null;
  for (const name of names) {
    const value = post.extra?.[name];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
}

function boolText(value: unknown) {
  if (value === true || value === "true" || value === "예" || value === "가능") return "예";
  if (value === false || value === "false" || value === "아니오" || value === "불가") return "아니오";
  return value;
}

function isTruthy(value: unknown) {
  return value === true || value === "true" || value === "예" || value === "가능";
}

function isFreePrice(value: unknown) {
  return value === 0 || value === "0";
}

function marketPrice(value: unknown) {
  return isFreePrice(value) ? "무료나눔" : value;
}

function safeReturnHref(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) return fallback;
  return value;
}

function detailHref(postId: string, fromHref: string) {
  return `/posts/${postId}?from=${encodeURIComponent(fromHref)}`;
}

function sameText(left: unknown, right: unknown) {
  const leftText = asText(left);
  const rightText = asText(right);
  if (leftText === "-" || rightText === "-") return false;
  return leftText === rightText || leftText.includes(rightText) || rightText.includes(leftText);
}

function postRegion(post: Post) {
  return extraValue(post, ["site_region", "available_region", "market_region"]) ?? post.region_text;
}

function postTrade(post: Post) {
  return extraValue(post, ["trade", "available_trade"]) ?? post.trade_text;
}

function postDate(post: Post) {
  return extraValue(post, ["work_date", "available_date"]) ?? post.work_date;
}

function postPay(post: Post) {
  return extraValue(post, ["daily_pay", "desired_pay", "price"]) ?? post.daily_pay;
}

function postTransaction(post: Post) {
  return extraValue(post, ["transaction_type"]);
}

function relatedMeta(post: Post) {
  return [postRegion(post), postTrade(post), formatDay(asText(postDate(post))), postPay(post) ? formatMoney(postPay(post) as string | number | null | undefined) : null]
    .map((item) => asText(item))
    .filter((item) => item !== "-")
    .slice(0, 4)
    .join(" · ");
}

function relatedByRegion(posts: Post[], region: unknown) {
  return posts.filter((item) => sameText(postRegion(item), region));
}

function relatedByTrade(posts: Post[], trade: unknown) {
  return posts.filter((item) => sameText(postTrade(item), trade));
}

function relatedByTransaction(posts: Post[], transaction: unknown) {
  return posts.filter((item) => sameText(postTransaction(item), transaction));
}

function freeMarketPosts(posts: Post[]) {
  return posts.filter((item) => isFreePrice(postPay(item)) || asText(postPay(item)).includes("무료"));
}

function recruitingPosts(posts: Post[]) {
  return posts.filter((item) => item.status === "recruiting");
}

function RelatedPostList({ title, posts, fromHref }: { title: string; posts: Post[]; fromHref: string }) {
  const visiblePosts = posts.slice(0, 4);
  if (!visiblePosts.length) return null;

  return (
    <section className="border border-line bg-white">
      <SectionHeader title={title} count={`${visiblePosts.length}개`} />
      <div className="border-t border-line">
        {visiblePosts.map((item) => (
          <ButtonLink
            key={item.id}
            href={detailHref(item.id, fromHref)}
            className="flex min-h-14 w-full justify-start rounded-none border-0 border-b border-line bg-white px-3 py-2 text-left active:bg-amber-50"
          >
            <span className="min-w-0">
              <span className="block truncate text-base font-bold leading-6 text-ink">{item.title}</span>
              <span className="mt-0.5 block truncate text-[13px] font-medium leading-5 text-muted">{relatedMeta(item)}</span>
            </span>
          </ButtonLink>
        ))}
      </div>
    </section>
  );
}

function quickWriteLabel(boardSlug: string) {
  if (boardSlug === "work-raid") return "작업레이드 올리기";
  if (boardSlug === "remote-raid") return "원정레이드 올리기";
  if (boardSlug === "dimodo") return "보조글 올리기";
  if (boardSlug === "available-today") return "일당 가능글 올리기";
  if (boardSlug === "tool-market") return "공구글 올리기";
  if (boardSlug === "materials") return "자재글 올리기";
  return "글쓰기";
}

function shareSummaryLine(label: string, value: unknown, money = false) {
  const text = money ? formatMoney(value as string | number | null | undefined) : asText(value);
  if (text === "-") return null;
  return `${label}: ${text}`;
}

function buildWorkShareSummary({
  title,
  boardName,
  departure,
  siteRegion,
  workDate,
  trade,
  neededCount,
  pay,
  lodging,
  beginner,
  contactMethod
}: {
  title: string;
  boardName: string;
  departure: unknown;
  siteRegion: unknown;
  workDate: unknown;
  trade: unknown;
  neededCount: unknown;
  pay: unknown;
  lodging: unknown;
  beginner: unknown;
  contactMethod: unknown;
}) {
  return [
    `[JOBDAY ${boardName}] ${title}`,
    shareSummaryLine("출발/현장", departure ? `${asText(departure)} -> ${asText(siteRegion)}` : siteRegion),
    shareSummaryLine("날짜", formatDay(asText(workDate))),
    shareSummaryLine("직종", trade),
    neededCount ? shareSummaryLine("인원", `${asText(neededCount)}명`) : null,
    shareSummaryLine("일당", pay, true),
    shareSummaryLine("숙소", boolText(lodging)),
    shareSummaryLine("초보", boolText(beginner)),
    shareSummaryLine("연락", contactMethod)
  ]
    .filter(Boolean)
    .join("\n");
}

export default async function PostDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ from?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const [post, comments, boards] = await Promise.all([getPost(resolvedParams.id), getComments(resolvedParams.id), getBoards()]);
  if (!post) return <HiddenPostNotice postId={resolvedParams.id} />;

  const boardSlug = post.board?.slug ?? "";
  const isAvailableToday = boardSlug === "available-today";
  const isRemoteRaid = boardSlug === "remote-raid";
  const isWork = WORK_BOARD_SLUGS.includes(boardSlug);
  const showsConditionClarity = ["work-raid", "remote-raid", "dimodo"].includes(boardSlug);
  const isRecruitingWork = isWork && !isAvailableToday;
  const isMarket = MARKET_BOARD_SLUGS.includes(boardSlug);
  const isMaterials = boardSlug === "materials";
  const specialFields = SPECIAL_FIELDS_BY_BOARD[boardSlug] ?? [];
  const departure = extraValue(post, ["departure_region"]);
  const siteRegion = extraValue(post, ["site_region", "available_region", "market_region"]) ?? post.region_text;
  const trade = extraValue(post, ["trade", "available_trade"]) ?? post.trade_text;
  const workDate = extraValue(post, ["work_date", "available_date"]) ?? post.work_date;
  const workPeriod = extraValue(post, ["work_period"]);
  const pay = extraValue(post, ["daily_pay", "desired_pay", "price"]) ?? post.daily_pay;
  const payMethod = extraValue(post, ["pay_method"]);
  const workHours = extraValue(post, ["work_hours"]);
  const neededCount = extraValue(post, ["needed_count"]);
  const meal = extraValue(post, ["meal_provided"]);
  const lodging = extraValue(post, ["lodging_provided"]);
  const transportation = extraValue(post, ["transportation_provided"]);
  const rideShare = extraValue(post, ["ride_share_available"]);
  const transportMemo = extraValue(post, ["transport"]);
  const beginner = extraValue(post, ["beginner_ok"]);
  const requiredTools = extraValue(post, ["required_tools", "owned_tools"]);
  const canTravel = extraValue(post, ["can_travel"]);
  const hasVehicle = extraValue(post, ["has_vehicle"]);
  const experience = extraValue(post, ["experience"]);
  const recruitingStatus = extraValue(post, ["recruiting_status"]) ?? (post.status === "recruiting" ? "모집중" : POST_STATUS_LABELS[post.status]);
  const itemName = extraValue(post, ["tool_name", "material_name"]);
  const transaction = extraValue(post, ["transaction_type"]);
  const condition = extraValue(post, ["condition"]);
  const quantity = extraValue(post, ["quantity"]);
  const directTrade = extraValue(post, ["direct_trade"]);
  const marketStatus = post.status === "closed" ? "거래완료" : "거래중";
  const contactMethod = post.contact_method ?? extraValue(post, ["contact_method"]);
  const primaryFieldNames = new Set([
    "departure_region",
    "site_region",
    "available_region",
    "market_region",
    "work_date",
    "available_date",
    "work_period",
    "trade",
    "available_trade",
    "experience",
    "daily_pay",
    "desired_pay",
    "price",
    "pay_method",
    "work_hours",
    "needed_count",
    "meal_provided",
    "lodging_provided",
    "transportation_provided",
    "ride_share_available",
    "transport",
    "beginner_ok",
    "can_travel",
    "has_vehicle",
    "required_tools",
    "owned_tools",
    "contact_method",
    "recruiting_status",
    "tool_name",
    "material_name",
    "transaction_type",
    "condition",
    "quantity",
    "direct_trade"
  ]);
  const tradeText = asText(trade);
  const authorRole = post.author?.interested_trade ?? (tradeText !== "-" ? tradeText : null);
  const fallbackListHref = boardSlug ? `/boards/${boardSlug}` : "/boards";
  const listHref = safeReturnHref(resolvedSearchParams?.from, fallbackListHref);
  const allVisiblePosts = await getPosts({ limit: 200 });
  const sameBoardPosts = boardSlug ? allVisiblePosts.filter((item) => item.board?.slug === boardSlug) : [];
  const relatedBasePosts = sameBoardPosts.filter((item) => item.id !== post.id);
  const authorPosts = allVisiblePosts.filter((item) => item.author_id === post.author_id);
  const recentAuthorActivity = authorPosts[0]?.created_at ?? post.created_at;
  const currentIndex = sameBoardPosts.findIndex((item) => item.id === post.id);
  const previousPost = currentIndex > 0 ? sameBoardPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < sameBoardPosts.length - 1 ? sameBoardPosts[currentIndex + 1] : null;
  const sameRegionHref = boardSlug && asText(siteRegion) !== "-" ? `/boards/${boardSlug}?region=${encodeURIComponent(asText(siteRegion))}` : "";
  const sameTradeHref = boardSlug && asText(trade) !== "-" ? `/boards/${boardSlug}?trade=${encodeURIComponent(asText(trade))}` : "";
  const latestTitle = post.board ? `${post.board.name} 최신글` : "같은 게시판 최신글";
  const relatedSections = isMarket
    ? isMaterials
      ? [
          { title: "같은 지역 자재글", posts: relatedByRegion(relatedBasePosts, siteRegion) },
          { title: "무료나눔 글", posts: freeMarketPosts(relatedBasePosts) },
          { title: "최신 자재글", posts: relatedBasePosts }
        ]
      : [
          { title: "같은 지역 공구글", posts: relatedByRegion(relatedBasePosts, siteRegion) },
          { title: "같은 거래유형 공구글", posts: relatedByTransaction(relatedBasePosts, transaction) },
          { title: "최신 공구글", posts: relatedBasePosts }
        ]
    : isWork
      ? [
          { title: "같은 지역 작업레이드", posts: relatedByRegion(relatedBasePosts, siteRegion) },
          { title: "같은 직종 작업레이드", posts: relatedByTrade(relatedBasePosts, trade) },
          { title: "모집중인 작업레이드", posts: recruitingPosts(relatedBasePosts) },
          { title: latestTitle, posts: relatedBasePosts }
        ]
      : [
          { title: latestTitle, posts: relatedBasePosts },
          { title: "같은 지역 글", posts: relatedByRegion(relatedBasePosts, siteRegion) },
          { title: "같은 직종 글", posts: relatedByTrade(relatedBasePosts, trade) }
        ];
  const conditionClarityItems = [
    { label: "지역", value: siteRegion },
    { label: "날짜", value: workDate },
    { label: "직종", value: trade },
    { label: "일당", value: pay },
    { label: "인원", value: neededCount },
    { label: "연락방법", value: contactMethod }
  ];
  const savedEntry = {
    id: post.id,
    title: post.title,
    boardName: post.board?.name ?? "게시글",
    boardSlug: boardSlug || "boards",
    region: asText(siteRegion) === "-" ? undefined : asText(siteRegion),
    trade: asText(trade) === "-" ? undefined : asText(trade)
  };
  const shareSummary = buildWorkShareSummary({
    title: post.title,
    boardName: post.board?.name ?? "작업글",
    departure,
    siteRegion,
    workDate,
    trade,
    neededCount,
    pay,
    lodging,
    beginner,
    contactMethod
  });

  return (
    <div className="space-y-3">
      <BoardNavigationTabs boards={boards} currentSlug={boardSlug} />

      <article className="border border-line-strong bg-white">
        <div className="border-b border-line-strong bg-soft px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            {post.board ? <Badge tone="dark" icon="board">{post.board.name}</Badge> : null}
            {isRecruitingWork ? (
              <Badge tone={post.status === "closed" ? "muted" : "success"} icon={post.status === "closed" ? "closed" : "check"}>{asText(recruitingStatus)}</Badge>
            ) : (
              <StatusBadge status={post.status} />
            )}
            {isRemoteRaid ? <Badge tone="accent" icon="truck">원정</Badge> : null}
            {isActiveUntil(post.urgent_until) ? <Badge tone="warning" icon="megaphone">급구</Badge> : null}
            {isTruthy(lodging) && isRecruitingWork ? <Badge tone="success" icon="home">숙소제공</Badge> : null}
            {isTruthy(beginner) && isRecruitingWork ? <Badge tone="success" icon="question">초보가능</Badge> : null}
            {isActiveUntil(post.pinned_until) ? <Badge tone="warning" icon="pin">상단고정</Badge> : null}
          </div>
        </div>

        <div className="px-3 py-4">
          <h1 className="text-2xl font-bold leading-[1.3] text-ink">{post.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium leading-5 text-muted">
            <AuthorIdentity nickname={post.author?.nickname ?? "익명"} roleLabel={authorRole} premium={post.author?.is_premium_company} className="max-w-[210px]" />
            <span className="inline-flex items-center gap-1">
              <Icon name="calendar" className="h-3.5 w-3.5" />
              작성 {formatDate(post.created_at)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="eye" className="h-3.5 w-3.5" />
              조회 {post.view_count}
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="star" className="h-3.5 w-3.5" />
              추천 {post.up_count}
            </span>
            <span className="inline-flex items-center gap-1 text-accent">
              <Icon name="comment" className="h-3.5 w-3.5" />
              댓글 {post.comment_count}
            </span>
          </div>
        </div>

        {showsConditionClarity ? <ConditionClarity items={conditionClarityItems} /> : null}

        {isMarket ? (
          <DetailBox title="거래 핵심 정보">
            <DetailItem label="거래유형" value={transaction ?? (isTruthy(directTrade) ? "직거래" : "-")} important />
            <DetailItem label={isMaterials ? "자재명" : "공구명"} value={itemName} important />
            <DetailItem label="가격" value={marketPrice(pay)} money={!isFreePrice(pay)} important />
            {isMaterials ? <DetailItem label="수량" value={quantity} /> : <DetailItem label="상태" value={condition} />}
            <DetailItem label="지역" value={siteRegion} important />
            <DetailItem label="연락방법" value={contactMethod} important />
            <DetailItem label="직거래" value={boolText(directTrade)} />
            <DetailItem label="거래상태" value={marketStatus} />
          </DetailBox>
        ) : isRecruitingWork ? (
          <DetailBox title="작업 핵심 조건">
            <DetailItem label="현장지역" value={siteRegion} important />
            <DetailItem label="출발지역" value={departure} />
            <DetailItem label="작업날짜" value={formatDay(asText(workDate))} important />
            <DetailItem label="직종" value={trade} important />
            <DetailItem label="필요인원" value={neededCount ? `${asText(neededCount)}명` : "-"} important />
            <DetailItem label="일당" value={pay} money important />
            <DetailItem label="숙소제공" value={boolText(lodging)} important />
            <DetailItem label="식사제공" value={boolText(meal)} />
            <DetailItem label="초보가능" value={boolText(beginner)} important />
            <DetailItem label="연락방법" value={contactMethod} important />
            <DetailItem label="모집상태" value={recruitingStatus} />
          </DetailBox>
        ) : isAvailableToday ? (
          <DetailBox title="가능 핵심 정보">
            <DetailItem label="가능지역" value={siteRegion} />
            <DetailItem label="원정가능" value={boolText(canTravel)} />
            <DetailItem label="가능날짜" value={formatDay(asText(workDate))} important />
            <DetailItem label="가능직종" value={trade} />
            <DetailItem label="경력" value={experience} />
            <DetailItem label="희망일당" value={pay} money important />
            <DetailItem label="연락방법" value={contactMethod} important />
            <DetailItem label="모집상태" value={recruitingStatus} />
          </DetailBox>
        ) : (
          <DetailBox title="게시글 정보">
            <DetailItem label="지역" value={siteRegion} />
            <DetailItem label="직종" value={trade} />
            <DetailItem label="날짜" value={formatDay(asText(workDate))} />
            <DetailItem label="연락방법" value={contactMethod} important />
            <DetailItem label="상태" value={POST_STATUS_LABELS[post.status]} />
          </DetailBox>
        )}

        {!isMarket && isAvailableToday ? (
          <DetailBox title="가능 추가 정보" collapsible>
            <DetailItem label="보유공구" value={requiredTools} />
            <DetailItem label="차량 여부" value={boolText(hasVehicle)} />
            <DetailItem label="원정가능" value={boolText(canTravel)} />
            <DetailItem label="희망일당" value={pay} money />
          </DetailBox>
        ) : isRecruitingWork ? (
          <DetailBox title="작업 추가 조건" collapsible>
            <DetailItem label="작업기간" value={workPeriod} />
            <DetailItem label="지급방식" value={payMethod} />
            <DetailItem label="작업시간" value={workHours} />
            <DetailItem label="교통비" value={boolText(transportation)} />
            <DetailItem label="차량동승" value={boolText(rideShare)} />
            <DetailItem label="필요공구" value={requiredTools} />
            <DetailItem label="교통/차량 메모" value={transportMemo} />
            <DetailItem label="모집상태" value={recruitingStatus} />
          </DetailBox>
        ) : null}

        {specialFields.length ? (
          <dl className="grid grid-cols-2 border-l border-t border-line-strong sm:grid-cols-4">
            {specialFields.map((field) => {
              if (primaryFieldNames.has(field.name)) return null;
              const value = post.extra?.[field.name];
              if (value === null || value === undefined || value === "") return null;
              return (
                <DetailItem
                  key={field.name}
                  label={field.label}
                  value={value}
                  money={["daily_pay", "desired_pay", "price"].includes(field.name)}
                />
              );
            })}
          </dl>
        ) : null}

        {contactMethod ? (
          <section className="border-t-4 border-accent bg-accent-soft px-3 py-4">
            <h2 className="text-base font-bold text-ink">연락방법 확인</h2>
            <p className="mt-1 whitespace-pre-wrap text-lg font-bold leading-7 text-ink">{asText(contactMethod)}</p>
            <p className="mt-2 text-sm font-medium leading-6 text-amber-900">연락 전 임금, 작업조건, 안전사항, 숙소, 교통비를 직접 확인하세요.</p>
          </section>
        ) : null}

        <div className="whitespace-pre-wrap border-t border-line-strong px-3 py-5 text-[17px] font-normal leading-8 text-ink">{post.body}</div>

        {post.images?.length ? (
          <div className="grid gap-3 border-t border-line-strong p-3">
            {post.images.map((image) =>
              image.public_url ? (
                <figure key={image.id} className="space-y-2">
                  <a href={image.public_url} target="_blank" rel="noreferrer" className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.public_url} alt={image.alt_text ?? post.title} className="w-full rounded-sm border border-line object-cover" />
                  </a>
                  <ButtonLink href={image.public_url} target="_blank" rel="noreferrer">
                    이미지 크게 보기
                  </ButtonLink>
                </figure>
              ) : null
            )}
          </div>
        ) : null}
      </article>

      <AuthorProfileMiniCard
        author={post.author}
        fallbackNickname={post.author?.nickname ?? "익명"}
        roleLabel={authorRole}
        activityCount={Math.max(authorPosts.length, 1)}
        recentActivity={recentAuthorActivity}
      />

      <LegalNotice boardSlug={boardSlug} compact />
      <AdSlot placement="post_inline" label="글 상세 광고 위치" />
      <section className="grid gap-2 sm:grid-cols-2">
        <SavePostButton entry={savedEntry} />
        {showsConditionClarity ? <ShareSummaryButton summary={shareSummary} /> : null}
      </section>
      <PostInteractions postId={post.id} authorId={post.author_id} upCount={post.up_count} downCount={post.down_count} reportCount={post.report_count ?? 0} />
      <PostOwnerActions post={post} />
      <CommentSection postId={post.id} comments={comments} />

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <ButtonLink href={listHref} size="lg">
          <Icon name="board" className="mr-1.5 h-4 w-4" />
          목록으로
        </ButtonLink>
        {previousPost ? (
          <ButtonLink href={detailHref(previousPost.id, listHref)} size="lg">
            <Icon name="reply" className="mr-1.5 h-4 w-4" />
            이전 글
          </ButtonLink>
        ) : (
          <span className="inline-flex min-h-12 items-center justify-center rounded-sm border border-line bg-soft px-4 py-3 text-base font-semibold text-muted">
            이전 글 없음
          </span>
        )}
        {nextPost ? (
          <ButtonLink href={detailHref(nextPost.id, listHref)} size="lg">
            다음 글
            <Icon name="reply" className="ml-1.5 h-4 w-4 rotate-180" />
          </ButtonLink>
        ) : (
          <span className="inline-flex min-h-12 items-center justify-center rounded-sm border border-line bg-soft px-4 py-3 text-base font-semibold text-muted">
            다음 글 없음
          </span>
        )}
        <ButtonLink href={boardSlug ? `/boards/${boardSlug}/new` : "/write"} variant="primary" size="lg">
          <Icon name="pencil" className="mr-1.5 h-4 w-4" />
          {quickWriteLabel(boardSlug)}
        </ButtonLink>
      </section>

      <section className="grid gap-2 sm:grid-cols-2">
        {sameRegionHref ? (
          <ButtonLink href={sameRegionHref} size="lg">
            <Icon name="home" className="mr-1.5 h-4 w-4" />
            같은 지역 글 더 보기
          </ButtonLink>
        ) : null}
        {sameTradeHref ? (
          <ButtonLink href={sameTradeHref} size="lg">
            <Icon name="trade" className="mr-1.5 h-4 w-4" />
            같은 직종 글 더 보기
          </ButtonLink>
        ) : null}
      </section>

      <div className="grid gap-3 xl:grid-cols-3">
        {relatedSections.map((section) => (
          <RelatedPostList key={section.title} title={section.title} posts={section.posts} fromHref={listHref} />
        ))}
      </div>
    </div>
  );
}
