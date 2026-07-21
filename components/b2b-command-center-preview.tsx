"use client";

import { useMemo, useState } from "react";

const channels = [
  { key: "media", label: "직업 콘텐츠", base: 72 },
  { key: "jobs", label: "공고 품질", base: 64 },
  { key: "brand", label: "기업 브랜딩", base: 58 },
  { key: "insight", label: "인사이트 광고", base: 46 }
] as const;

export function B2BCommandCenterPreview() {
  const [budget, setBudget] = useState(180);
  const [weeks, setWeeks] = useState(4);

  const projection = useMemo(() => {
    const normalizedBudget = Math.max(budget, 0);
    const normalizedWeeks = Math.max(weeks, 1);
    const reach = Math.round(normalizedBudget * normalizedWeeks * 42);
    const actions = Math.round(reach * 0.032);
    const qualified = Math.round(actions * 0.42);
    return { reach, actions, qualified };
  }, [budget, weeks]);

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_70px_rgba(15,23,42,0.06)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="p-5 sm:p-7">
          <p className="text-xs font-black uppercase text-[#D4AF37]">B2B Command Center</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-[#0F172A]">기업 공고를 광고가 아니라 직업 브랜드로 관리합니다.</h2>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-600">
            공고 노출, 직업 콘텐츠, 광고 슬롯, 지원 전환을 한 화면에서 보는 운영자용 대시보드 프리뷰입니다. 채용 성사나 후보자 보장을 약속하지 않습니다.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="block text-sm font-black text-[#0F172A]">월 운영 예산 가설</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">단위: 만 원</span>
              <input
                className="mt-3 w-full accent-[#D4AF37]"
                max={1000}
                min={0}
                step={10}
                type="range"
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value))}
              />
              <p className="mt-2 text-xl font-black text-[#D4AF37]">{budget}만 원</p>
            </label>
            <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="block text-sm font-black text-[#0F172A]">운영 기간</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">단위: 주</span>
              <input
                className="mt-3 w-full accent-[#D4AF37]"
                max={12}
                min={1}
                type="range"
                value={weeks}
                onChange={(event) => setWeeks(Number(event.target.value))}
              />
              <p className="mt-2 text-xl font-black text-[#D4AF37]">{weeks}주</p>
            </label>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["예상 도달", projection.reach.toLocaleString("ko-KR")],
              ["관심 행동", projection.actions.toLocaleString("ko-KR")],
              ["검토 후보", projection.qualified.toLocaleString("ko-KR")]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-black text-[#0F172A]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 bg-[#0F172A] p-5 text-white sm:p-7 lg:border-l lg:border-t-0">
          <p className="text-xs font-black uppercase text-[#D4AF37]">Signal Quality</p>
          <div className="mt-5 space-y-4">
            {channels.map((channel) => {
              const value = Math.min(channel.base + Math.round(budget / 50) + weeks, 100);
              return (
                <div key={channel.key}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-200">{channel.label}</p>
                    <p className="text-sm font-black text-[#D4AF37]">{value}</p>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#D4AF37]" style={{ width: `${value}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-black text-white">30일 리포트 루프</p>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
              노출, 클릭, 저장, 문의, 이탈 지점을 보고 다음 공고 문구와 직업 콘텐츠를 개선합니다. 보장이 아니라 운영 리포트입니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
