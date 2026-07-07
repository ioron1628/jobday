import { AD_NOTICE } from "@/lib/constants";
import { getAdSlot } from "@/lib/data";
import type { AdSlot as AdSlotType } from "@/types/domain";
import { Badge, Icon } from "./design-system";

function isBannerVisible(slot: AdSlotType | null) {
  if (!slot?.is_active) return false;
  const now = Date.now();
  const startsAt = slot.starts_at ? new Date(slot.starts_at).getTime() : 0;
  const endsAt = slot.ends_at ? new Date(slot.ends_at).getTime() : Number.POSITIVE_INFINITY;
  return startsAt <= now && now < endsAt;
}

export async function AdSlot({ placement = "home_top", label = "광고 위치" }: { placement?: string; label?: string }) {
  const slot = await getAdSlot(placement);
  const banner = isBannerVisible(slot) ? slot : null;
  const title = banner?.label ?? label;
  const advertiserName = banner?.advertiser_name?.trim();
  const targetLabel = [banner?.target_region, banner?.target_trade].filter(Boolean).join(" · ");
  const imageUrl = banner?.image_path?.trim();
  const linkUrl = banner?.link_url?.trim();
  const isSponsor = Boolean(banner?.sponsor_type && banner.sponsor_type !== "general");
  const media = imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageUrl} alt={title} className="mt-3 max-h-44 w-full border border-slate-200 object-cover" />
  ) : null;

  if (!banner) {
    return (
      <aside className="border border-dashed border-line bg-soft px-3 py-2">
        <div className="flex items-center justify-between gap-3">
          <Badge tone="muted" icon="megaphone">광고</Badge>
          <span className="text-[12px] font-medium text-muted">{label}</span>
        </div>
        <p className="mt-1 flex items-start gap-1.5 text-[12px] font-medium leading-5 text-muted">
          <Icon name="notice" className="mt-0.5 h-3.5 w-3.5" />
          <span>운영자가 수동으로 등록하는 자리입니다.</span>
        </p>
      </aside>
    );
  }

  return (
    <aside className="border border-dashed border-line bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <Badge tone={isSponsor ? "warning" : "muted"} icon="megaphone">{isSponsor ? "스폰서" : "광고"}</Badge>
        <span className="text-sm font-medium text-muted">{targetLabel || title}</span>
      </div>
      <p className="mt-2 text-base font-semibold leading-6 text-ink">{advertiserName ? `${advertiserName} · ${title}` : title}</p>
      {linkUrl ? (
        <a href={linkUrl} target="_blank" rel="noreferrer" className="block">
          {media}
        </a>
      ) : (
        media
      )}
      <p className="mt-2 text-[12px] leading-5 text-muted">{AD_NOTICE}</p>
    </aside>
  );
}
