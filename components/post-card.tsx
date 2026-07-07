import { MARKET_BOARD_SLUGS, POST_STATUS_LABELS, WORK_BOARD_SLUGS } from "@/lib/constants";
import { asText, formatDate, formatDay, formatMoney, isActiveUntil } from "@/lib/format";
import type { Post } from "@/types/domain";
import { AuthorIdentity, Badge, Icon, JobConditionRow, JobRaidListItem, MarketConditionRow, MarketListItem, PostListItem, RegionBadge, TradeBadge } from "./design-system";
import { StatusBadge } from "./status-badge";

function pickExtra(post: Post, names: string[]) {
  for (const name of names) {
    const value = post.extra?.[name];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
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

function moneyText(value: unknown) {
  return isFreePrice(value) ? "무료나눔" : formatMoney(value as string | number | null | undefined);
}

function compactMoneyText(value: unknown) {
  if (isFreePrice(value)) return "무료나눔";
  if (value === null || value === undefined || value === "") return "-";
  const number = typeof value === "string" ? Number(value) : value;
  if (typeof number !== "number" || Number.isNaN(number)) return asText(value);
  if (number >= 10000 && number % 10000 === 0) return `${number / 10000}만`;
  if (number >= 10000) return `${Math.round(number / 1000) / 10}만`;
  return `${number.toLocaleString("ko-KR")}원`;
}

function compactDay(value: unknown) {
  const text = asText(value);
  if (text === "-") return "";
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function boolBadge(value: unknown, positiveLabel: string, negativeLabel: string) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? positiveLabel : negativeLabel;
  const text = asText(value);
  if (["true", "예", "가능", "O", "o"].includes(text)) return positiveLabel;
  if (["false", "아니오", "불가", "X", "x"].includes(text)) return negativeLabel;
  return text;
}

function optionBadge(value: unknown, prefix: string, positiveLabel = "O", negativeLabel = "X") {
  const text = boolBadge(value, positiveLabel, negativeLabel);
  return text === "-" ? null : `${prefix}${text}`;
}

function statusText(post: Post, recruitingStatus: unknown) {
  const extraStatus = asText(recruitingStatus);
  if (extraStatus !== "-") return extraStatus;
  return post.status === "recruiting" ? "모집중" : POST_STATUS_LABELS[post.status];
}

function availabilityBadgeLabel(value: unknown) {
  const text = asText(value);
  if (text === "-") return null;

  const target = new Date(text);
  if (Number.isNaN(target.getTime())) return null;

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const dayDiff = Math.round((targetStart - todayStart) / 86400000);

  if (dayDiff === 0) return "오늘 가능";
  if (dayDiff === 1) return "내일 가능";
  return null;
}

function transactionTone(value: unknown) {
  const text = asText(value);
  if (text.includes("대여")) return "warning" as const;
  if (text.includes("교환")) return "market" as const;
  return "accent" as const;
}

function postHref(postId: string, fromHref?: string) {
  if (!fromHref) return `/posts/${postId}`;
  return `/posts/${postId}?from=${encodeURIComponent(fromHref)}`;
}

function listHrefWithAnchor(fromHref: string | undefined, postId: string) {
  if (!fromHref) return undefined;
  return `${fromHref.split("#")[0]}#post-${postId}`;
}

export function PostCard({ post, fromHref }: { post: Post; fromHref?: string }) {
  const boardSlug = post.board?.slug ?? "";
  const isWork = WORK_BOARD_SLUGS.includes(boardSlug);
  const isRemoteRaid = boardSlug === "remote-raid";
  const isAvailableToday = boardSlug === "available-today";
  const isMarket = MARKET_BOARD_SLUGS.includes(boardSlug);
  const departure = pickExtra(post, ["departure_region"]);
  const region = pickExtra(post, ["site_region", "available_region", "market_region"]) ?? post.region_text;
  const trade = pickExtra(post, ["trade", "available_trade"]) ?? post.trade_text;
  const workDate = pickExtra(post, ["work_date", "available_date"]) ?? post.work_date;
  const pay = pickExtra(post, ["daily_pay", "desired_pay", "price"]) ?? post.daily_pay;
  const neededCount = pickExtra(post, ["needed_count"]);
  const meal = pickExtra(post, ["meal_provided"]);
  const lodging = pickExtra(post, ["lodging_provided"]);
  const transportation = pickExtra(post, ["transportation_provided"]);
  const rideShare = pickExtra(post, ["ride_share_available"]);
  const transportMemo = pickExtra(post, ["transport"]);
  const beginner = pickExtra(post, ["beginner_ok"]);
  const recruitingStatus = pickExtra(post, ["recruiting_status"]);
  const canTravel = pickExtra(post, ["can_travel"]);
  const itemName = pickExtra(post, ["tool_name", "material_name"]);
  const transaction = pickExtra(post, ["transaction_type"]);
  const condition = pickExtra(post, ["condition"]);
  const quantity = pickExtra(post, ["quantity"]);
  const directTrade = pickExtra(post, ["direct_trade"]);
  const marketStatus = post.status === "closed" ? "거래완료" : "거래중";
  const availableBadge = isAvailableToday ? availabilityBadgeLabel(workDate) : null;
  const transportText = asText(transportMemo);
  const hasTransportation = isTruthy(transportation) || transportText.includes("교통비");
  const hasRideShare = isTruthy(rideShare) || transportText.includes("동승");
  const ListShell = isMarket ? MarketListItem : isWork ? JobRaidListItem : PostListItem;
  const tradeText = asText(trade);
  const authorRole = post.author?.interested_trade ?? (tradeText !== "-" ? tradeText : null);
  const returnHref = listHrefWithAnchor(fromHref, post.id);

  return (
    <ListShell href={postHref(post.id, returnHref)} anchorId={`post-${post.id}`}>
        {isWork ? (
          isAvailableToday ? (
            <JobConditionRow
              className="mb-2"
              items={[
                { label: "가능지역", value: region, strong: true, icon: "home" },
                { label: "날짜", value: formatDay(asText(workDate)), strong: true, icon: "calendar" },
                { label: "직종", value: trade, tone: "accent", icon: "trade" },
                { value: moneyText(pay), tone: "warning", strong: true, icon: "wage" },
                { value: isTruthy(canTravel) ? "원정O" : null, tone: "success", icon: "compass" },
                { value: statusText(post, recruitingStatus), tone: post.status === "closed" ? "muted" : "success", icon: post.status === "closed" ? "closed" : "check" }
              ]}
            />
          ) : (
            <JobConditionRow
              className="mb-2"
              items={[
                { value: departure ? `${asText(departure)}→${asText(region)}` : region, strong: true, icon: "truck" },
                { value: compactDay(workDate), strong: true, icon: "calendar" },
                { value: trade, tone: "accent", icon: "trade" },
                { value: neededCount ? `${asText(neededCount)}명` : null, strong: true, icon: "people" },
                { value: compactMoneyText(pay), tone: "warning", strong: true, icon: "wage" },
                { value: optionBadge(lodging, "숙소"), tone: "success", icon: "home" },
                { value: optionBadge(meal, "식사"), tone: "success", icon: "check" },
                { value: optionBadge(beginner, "초보"), tone: "success", icon: "flag" },
                { value: statusText(post, recruitingStatus), tone: post.status === "closed" ? "muted" : "success", icon: post.status === "closed" ? "closed" : "check" }
              ]}
            />
          )
        ) : null}

        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {post.board ? <Badge tone="dark" icon="board">{post.board.name}</Badge> : null}
          {!isWork ? <StatusBadge status={post.status} /> : null}
          {isRemoteRaid ? <Badge tone="accent" icon="truck">원정</Badge> : null}
          {isActiveUntil(post.urgent_until) ? (
            <Badge tone="warning" icon="megaphone">급구</Badge>
          ) : null}
          {isActiveUntil(post.pinned_until) ? (
            <Badge tone="warning" icon="pin">상단고정</Badge>
          ) : null}
        </div>

        {isRemoteRaid ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {hasTransportation ? <Badge tone="success" icon="wage">교통비</Badge> : null}
            {hasRideShare ? <Badge tone="success" icon="truck">차량동승</Badge> : null}
          </div>
        ) : null}

        {isAvailableToday ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {availableBadge ? <Badge tone="success" icon="calendar">{availableBadge}</Badge> : null}
            {isTruthy(canTravel) ? <Badge tone="success" icon="compass">원정 가능</Badge> : null}
          </div>
        ) : null}

        {isMarket ? (
          <>
            <MarketConditionRow
              className="mb-2"
              items={[
                { value: transaction ?? (isTruthy(directTrade) ? "직거래" : "-"), tone: transactionTone(transaction), strong: true, icon: "tool" },
                { value: itemName, strong: true, icon: isMarket && boardSlug === "materials" ? "box" : "tool" },
                { label: "수량", value: quantity ? asText(quantity) : null, icon: "box" },
                { value: moneyText(marketPrice(pay)), tone: "warning", strong: true, icon: "wage" },
                { label: "지역", value: region, tone: "default", icon: "home" },
                { value: condition, tone: "default" },
                { value: isTruthy(directTrade) ? "직거래" : null, tone: "default", icon: "home" },
                { value: marketStatus, tone: post.status === "closed" ? "muted" : "success", icon: post.status === "closed" ? "closed" : "check" }
              ]}
            />
          </>
        ) : null}

        {!isWork && !isMarket ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            <RegionBadge value={region} />
            <TradeBadge value={trade} />
          </div>
        ) : null}

        <h2 className="line-clamp-2 text-base font-semibold leading-[1.35] text-ink">{post.title}</h2>
        {!isWork && !isMarket ? <p className="mt-1 line-clamp-1 text-sm font-medium leading-6 text-muted">{post.body}</p> : null}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium leading-5 text-muted">
          <AuthorIdentity nickname={post.author?.nickname ?? "익명"} roleLabel={authorRole} premium={post.author?.is_premium_company} className="max-w-[190px]" />
          <span className="inline-flex items-center gap-1">
            <Icon name="calendar" className="h-3.5 w-3.5" />
            {formatDate(post.created_at)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="eye" className="h-3.5 w-3.5" />
            {post.view_count}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="star" className="h-3.5 w-3.5" />
            {post.up_count}
          </span>
          <span className="inline-flex items-center gap-1 text-accent">
            <Icon name="comment" className="h-3.5 w-3.5" />
            {post.comment_count}
          </span>
        </div>
    </ListShell>
  );
}
