"use client";

import { useMemo, useState } from "react";

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function formatWon(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "KRW"
  }).format(value);
}

export function TransformationGapCalculator() {
  const [monthlyVisitors, setMonthlyVisitors] = useState(12000);
  const [conversionRate, setConversionRate] = useState(1.2);
  const [leadValue, setLeadValue] = useState(45000);
  const [improvementRate, setImprovementRate] = useState(0.8);

  const result = useMemo(() => {
    const visitors = clampNumber(monthlyVisitors, 0, 1_000_000);
    const currentRate = clampNumber(conversionRate, 0, 100) / 100;
    const improvement = clampNumber(improvementRate, 0, 30) / 100;
    const value = clampNumber(leadValue, 0, 5_000_000);
    const currentMonthlyValue = visitors * currentRate * value;
    const improvedMonthlyValue = visitors * (currentRate + improvement) * value;
    const monthlyGap = Math.max(improvedMonthlyValue - currentMonthlyValue, 0);

    return {
      currentMonthlyValue,
      improvedMonthlyValue,
      monthlyGap,
      yearlyGap: monthlyGap * 12
    };
  }, [conversionRate, improvementRate, leadValue, monthlyVisitors]);

  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-800 bg-[#0F172A] text-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="p-5 sm:p-8">
          <p className="text-xs font-bold uppercase text-[#D4AF37]">Transformation Gap Calculator</p>
          <h2 className="mt-3 text-3xl font-black leading-[1.14] sm:text-4xl">전환 손실을 숫자로 먼저 봅니다.</h2>
          <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-slate-300">
            콘텐츠, 직업 허브, 추천 인사이트가 사용자의 다음 행동을 얼마나 더 만들 수 있는지 간단히 추정합니다.
            실제 매출 보장이 아니라 전략 검토용 계산기입니다.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <label className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="block text-sm font-bold text-slate-200">월 방문자</span>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-white px-3 py-3 text-base font-bold text-slate-950 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
                inputMode="numeric"
                min={0}
                type="number"
                value={monthlyVisitors}
                onChange={(event) => setMonthlyVisitors(Number(event.target.value))}
              />
            </label>
            <label className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="block text-sm font-bold text-slate-200">현재 전환율(%)</span>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-white px-3 py-3 text-base font-bold text-slate-950 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
                inputMode="decimal"
                min={0}
                step={0.1}
                type="number"
                value={conversionRate}
                onChange={(event) => setConversionRate(Number(event.target.value))}
              />
            </label>
            <label className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="block text-sm font-bold text-slate-200">전환 1건 가치</span>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-white px-3 py-3 text-base font-bold text-slate-950 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
                inputMode="numeric"
                min={0}
                step={1000}
                type="number"
                value={leadValue}
                onChange={(event) => setLeadValue(Number(event.target.value))}
              />
            </label>
            <label className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="block text-sm font-bold text-slate-200">개선 목표(%p)</span>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-white px-3 py-3 text-base font-bold text-slate-950 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
                inputMode="decimal"
                min={0}
                step={0.1}
                type="number"
                value={improvementRate}
                onChange={(event) => setImprovementRate(Number(event.target.value))}
              />
            </label>
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/[0.06] p-5 sm:p-8 lg:border-l lg:border-t-0">
          <p className="text-sm font-bold text-slate-300">월간 추가 가능성</p>
          <p className="mt-2 text-4xl font-black leading-tight text-[#D4AF37]">{formatWon(result.monthlyGap)}</p>
          <p className="mt-1 text-sm font-semibold text-slate-300">연간 추정 {formatWon(result.yearlyGap)}</p>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Current</p>
              <p className="mt-1 text-xl font-black">{formatWon(result.currentMonthlyValue)}</p>
            </div>
            <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-4">
              <p className="text-xs font-bold uppercase text-[#D4AF37]">With JOBDAY Loop</p>
              <p className="mt-1 text-xl font-black">{formatWon(result.improvedMonthlyValue)}</p>
            </div>
          </div>

          <p className="mt-5 text-xs font-medium leading-5 text-slate-400">
            이 계산기는 광고·채용·커머스 전략 검토용 예시입니다. 실제 성과는 콘텐츠 품질, 트래픽, 업종, 운영 방식에 따라 달라집니다.
          </p>
        </div>
      </div>
    </section>
  );
}
