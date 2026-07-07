import { AuthorIdentity, Badge, Icon, NoticeBox } from "@/components/design-system";
import { asText, formatDate } from "@/lib/format";
import type { Post } from "@/types/domain";

type Props = {
  author: Post["author"];
  fallbackNickname: string;
  roleLabel?: string | null;
  activityCount: number;
  recentActivity?: string | null;
};

function profileTrade(author: Post["author"], fallback?: string | null) {
  const available = author?.available_trades?.filter(Boolean).join(", ");
  return available || author?.interested_trade || fallback || null;
}

function MiniInfo({ label, value, icon }: { label: string; value: unknown; icon: "home" | "trade" | "truck" | "board" | "calendar" }) {
  return (
    <div className="border border-line bg-white p-2">
      <dt className="flex items-center gap-1 text-[12px] font-semibold leading-5 text-muted">
        <Icon name={icon} className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-bold leading-5 text-ink">{asText(value)}</dd>
    </div>
  );
}

export function AuthorProfileMiniCard({ author, fallbackNickname, roleLabel, activityCount, recentActivity }: Props) {
  const nickname = author?.nickname ?? fallbackNickname;
  const trade = profileTrade(author, roleLabel);

  return (
    <section className="border border-line-strong bg-white p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <AuthorIdentity nickname={nickname} roleLabel={trade} premium={author?.is_premium_company} />
        {author?.can_travel ? (
          <Badge tone="accent" icon="truck">
            원정 가능
          </Badge>
        ) : null}
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <MiniInfo label="지역" value={author?.region} icon="home" />
        <MiniInfo label="직종" value={trade} icon="trade" />
        <MiniInfo label="원정" value={author?.can_travel ? "가능" : "미입력"} icon="truck" />
        <MiniInfo label="활동 수" value={`${activityCount}개`} icon="board" />
        <MiniInfo label="최근 활동" value={recentActivity ? formatDate(recentActivity) : "-"} icon="calendar" />
      </dl>
      <NoticeBox className="mt-3" tone="muted">
        <p>작성자가 입력한 공개 프로필입니다. 조건과 신원, 작업 결과는 이용자끼리 직접 확인해야 합니다.</p>
      </NoticeBox>
    </section>
  );
}
