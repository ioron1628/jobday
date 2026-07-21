import { ButtonLink } from "@/components/design-system";
import { OccupationGraphExplorer } from "@/components/occupation-graph-explorer";
import { occupations } from "@/lib/occupations";

export const dynamic = "force-static";

export default function OccupationGraphPage() {
  return (
    <main className="space-y-5">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-8">
        <p className="text-xs font-black uppercase text-[#D4AF37]">Occupation Graph</p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-[#0F172A] sm:text-5xl">직업 사이의 연결을 봅니다.</h1>
        <p className="mt-4 max-w-3xl text-lg font-semibold leading-8 text-slate-600">
          에피소드, 준비물, 질문, 공고가 직업을 중심으로 어떻게 이어지는지 탐색하는 시각화입니다.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/occupations" className="rounded-full" size="lg">직업 허브 목록</ButtonLink>
          <ButtonLink href="/listen" className="rounded-full" size="lg">에피소드 보기</ButtonLink>
        </div>
      </section>
      <OccupationGraphExplorer occupations={occupations} />
    </main>
  );
}
