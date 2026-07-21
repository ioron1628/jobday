"use client";

import { useMemo, useState } from "react";

const factors = [
  {
    key: "skillDepth",
    label: "기술 깊이",
    helper: "혼자 처리할 수 있는 업무 범위",
    weight: 0.25
  },
  {
    key: "proof",
    label: "결과 증거",
    helper: "포트폴리오, 후기, 작업 기록",
    weight: 0.2
  },
  {
    key: "network",
    label: "관계 자산",
    helper: "다시 연락 오는 팀, 고객, 동료",
    weight: 0.18
  },
  {
    key: "tooling",
    label: "도구 활용",
    helper: "장비, AI, 자동화, 업무 정리",
    weight: 0.17
  },
  {
    key: "market",
    label: "시장 수요",
    helper: "해당 직업의 구인·프로젝트 수요",
    weight: 0.2
  }
] as const;

type FactorKey = (typeof factors)[number]["key"];

const initialValues: Record<FactorKey, number> = {
  skillDepth: 55,
  proof: 40,
  network: 45,
  tooling: 35,
  market: 60
};

function levelLabel(score: number) {
  if (score >= 78) return "강한 커리어 방어력";
  if (score >= 58) return "성장 구간";
  return "기초를 쌓을 구간";
}

export function CareerMoatRadar() {
  const [values, setValues] = useState<Record<FactorKey, number>>(initialValues);

  const score = useMemo(() => {
    return Math.round(factors.reduce((total, factor) => total + values[factor.key] * factor.weight, 0));
  }, [values]);

  const points = useMemo(() => {
    const center = 100;
    const maxRadius = 82;
    return factors
      .map((factor, index) => {
        const angle = -Math.PI / 2 + (Math.PI * 2 * index) / factors.length;
        const radius = (values[factor.key] / 100) * maxRadius;
        return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
      })
      .join(" ");
  }, [values]);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-7">
      <div className="grid gap-7 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase text-[#D4AF37]">Career Moat Radar</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-[#0F172A]">내 일의 방어력을 숫자로 점검합니다.</h2>
          <p className="mt-3 text-base font-semibold leading-7 text-slate-600">
            개인을 평가하거나 보장하는 점수가 아닙니다. 어떤 능력을 더 쌓으면 좋을지 보는 자기 점검 도구입니다.
          </p>

          <div className="mt-6 rounded-[24px] border border-[#D4AF37]/40 bg-[#FFF8DF] p-5">
            <p className="text-sm font-black text-[#8A6A16]">현재 지표</p>
            <p className="mt-1 text-5xl font-black leading-none text-[#0F172A]">{score}</p>
            <p className="mt-2 text-base font-black text-slate-700">{levelLabel(score)}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[260px_minmax(0,1fr)] md:items-center">
          <div className="relative mx-auto h-[260px] w-[260px]">
            <svg className="h-full w-full" viewBox="0 0 200 200" role="img" aria-label={`커리어 방어력 ${score}점`}>
              {[30, 55, 82].map((radius) => (
                <circle key={radius} cx="100" cy="100" fill="none" r={radius} stroke="#E2E8F0" strokeWidth="1" />
              ))}
              {factors.map((factor, index) => {
                const angle = -Math.PI / 2 + (Math.PI * 2 * index) / factors.length;
                return (
                  <line
                    key={factor.key}
                    x1="100"
                    x2={100 + Math.cos(angle) * 86}
                    y1="100"
                    y2={100 + Math.sin(angle) * 86}
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                );
              })}
              <polygon fill="rgba(212,175,55,0.28)" points={points} stroke="#D4AF37" strokeWidth="3" />
              <circle cx="100" cy="100" fill="#0F172A" r="4" />
            </svg>
          </div>

          <div className="space-y-4">
            {factors.map((factor) => (
              <label key={factor.key} className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-sm font-black text-[#0F172A]">{factor.label}</span>
                    <span className="block text-xs font-semibold text-slate-500">{factor.helper}</span>
                  </span>
                  <span className="text-sm font-black text-[#D4AF37]">{values[factor.key]}</span>
                </div>
                <input
                  className="mt-3 w-full accent-[#D4AF37]"
                  max={100}
                  min={0}
                  type="range"
                  value={values[factor.key]}
                  onChange={(event) => setValues((current) => ({ ...current, [factor.key]: Number(event.target.value) }))}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
