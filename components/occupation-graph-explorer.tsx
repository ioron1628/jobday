"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Occupation } from "@/lib/occupations";

const nodePositions = [
  { x: 50, y: 18 },
  { x: 78, y: 34 },
  { x: 72, y: 68 },
  { x: 50, y: 82 },
  { x: 25, y: 66 },
  { x: 22, y: 32 }
];

function shortLabel(name: string) {
  return name.replace("의 하루", "");
}

export function OccupationGraphExplorer({ occupations }: { occupations: Occupation[] }) {
  const [selectedSlug, setSelectedSlug] = useState(occupations[0]?.slug ?? "");
  const selected = occupations.find((occupation) => occupation.slug === selectedSlug) ?? occupations[0];

  const related = useMemo(() => {
    if (!selected) return [];
    return occupations
      .filter((occupation) => occupation.slug !== selected.slug)
      .filter((occupation) => occupation.industry === selected.industry || occupation.episodeIds.some((id) => selected.episodeIds.includes(id)))
      .slice(0, 3);
  }, [occupations, selected]);

  if (!selected) return null;

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_70px_rgba(15,23,42,0.06)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="relative min-h-[420px] bg-[#0F172A] p-5 sm:p-8">
          <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:28px_28px]" />
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
            {nodePositions.map((position, index) => {
              if (index === 0) return null;
              return (
                <line
                  key={`${position.x}-${position.y}`}
                  x1="50%"
                  x2={`${position.x}%`}
                  y1="50%"
                  y2={`${position.y}%`}
                  stroke="rgba(212,175,55,0.28)"
                  strokeWidth="1.2"
                />
              );
            })}
          </svg>

          <button
            className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#D4AF37] bg-[#D4AF37] text-center text-sm font-black leading-5 text-[#0F172A] shadow-[0_24px_70px_rgba(212,175,55,0.28)]"
            onClick={() => setSelectedSlug(selected.slug)}
            type="button"
          >
            Occupation
            <br />
            Graph
          </button>

          {occupations.slice(0, 6).map((occupation, index) => {
            const position = nodePositions[index] ?? nodePositions[0];
            const active = occupation.slug === selected.slug;
            return (
              <button
                key={occupation.slug}
                className={[
                  "absolute z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-center text-xs font-black leading-4 backdrop-blur transition",
                  active
                    ? "border-[#D4AF37] bg-white text-[#0F172A] shadow-[0_18px_60px_rgba(212,175,55,0.24)]"
                    : "border-white/20 bg-white/10 text-white hover:border-[#D4AF37]/70 hover:bg-white/15"
                ].join(" ")}
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
                onClick={() => setSelectedSlug(occupation.slug)}
                type="button"
              >
                {shortLabel(occupation.name)}
              </button>
            );
          })}
        </div>

        <div className="p-5 sm:p-7">
          <p className="text-xs font-black uppercase text-[#D4AF37]">Interactive Occupation Graph</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-[#0F172A]">{selected.name}</h2>
          <p className="mt-2 text-sm font-bold text-slate-500">{selected.industry}</p>
          <p className="mt-4 text-base font-semibold leading-7 text-slate-600">{selected.description}</p>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-black text-[#0F172A]">이 직업에서 먼저 물어볼 질문</p>
            <ul className="mt-3 space-y-2">
              {selected.firstQuestions.map((question) => (
                <li key={question} className="text-sm font-semibold leading-6 text-slate-600">
                  {question}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <p className="text-sm font-black text-[#0F172A]">같이 볼 직업</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(related.length ? related : occupations.filter((occupation) => occupation.slug !== selected.slug).slice(0, 3)).map((occupation) => (
                <button
                  key={occupation.slug}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-[#D4AF37] hover:text-[#0F172A]"
                  onClick={() => setSelectedSlug(occupation.slug)}
                  type="button"
                >
                  {occupation.name}
                </button>
              ))}
            </div>
          </div>

          <Link
            href={`/occupations/${selected.slug}`}
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-[#0F172A] bg-[#0F172A] px-5 text-base font-black text-white active:bg-slate-950"
          >
            직업 허브 열기
          </Link>
        </div>
      </div>
    </section>
  );
}
