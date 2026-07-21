"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSenseNativeSlotProps = {
  enabled: boolean;
  label?: string;
  clientId?: string;
  slotId?: string;
};

export function AdSenseNativeSlot({
  enabled,
  label = "Industry Insights",
  clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
  slotId = process.env.NEXT_PUBLIC_ADSENSE_NATIVE_SLOT_ID
}: AdSenseNativeSlotProps) {
  const canRenderAd = Boolean(enabled && clientId && slotId);

  useEffect(() => {
    if (!canRenderAd) return;
    try {
      window.adsbygoogle = window.adsbygoogle ?? [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense가 차단되어도 본문 경험을 방해하지 않는다.
    }
  }, [canRenderAd]);

  if (!enabled) {
    return (
      <aside className="rounded-[24px] border border-dashed border-slate-300 bg-white p-5">
        <p className="text-xs font-black uppercase text-slate-400">Recommended Content Slot</p>
        <h3 className="mt-3 text-xl font-black leading-tight text-[#0F172A]">추천 인사이트 슬롯</h3>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">광고 라벨과 운영 기준이 준비되면 이 자리에 네이티브 광고를 넣을 수 있습니다.</p>
      </aside>
    );
  }

  if (!canRenderAd) {
    return (
      <aside className="rounded-[24px] border border-[#D4AF37]/40 bg-[#FFF8DF] p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[#D4AF37]/50 bg-white px-2.5 py-1 text-xs font-black text-[#8A6A16]">광고</span>
          <p className="text-xs font-black uppercase text-[#8A6A16]">{label}</p>
        </div>
        <h3 className="mt-3 text-xl font-black leading-tight text-[#0F172A]">AdSense 설정 대기 중</h3>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">client ID와 slot ID가 들어오면 실제 광고 영역으로 전환됩니다.</p>
      </aside>
    );
  }

  return (
    <aside className="rounded-[24px] border border-[#D4AF37]/40 bg-[#FFF8DF] p-5">
      <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`} strategy="afterInteractive" crossOrigin="anonymous" />
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full border border-[#D4AF37]/50 bg-white px-2.5 py-1 text-xs font-black text-[#8A6A16]">광고</span>
        <p className="text-xs font-black uppercase text-[#8A6A16]">{label}</p>
      </div>
      <ins
        className="adsbygoogle block min-h-28"
        data-ad-client={clientId}
        data-ad-format="fluid"
        data-ad-layout-key="-fb+5w+4e-db+86"
        data-ad-slot={slotId}
      />
    </aside>
  );
}
