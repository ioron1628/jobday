import { ButtonLink } from "@/components/design-system";
import { CareerMoatRadar } from "@/components/career-moat-radar";

export const dynamic = "force-static";

export default function CareerMoatPage() {
  return (
    <main className="space-y-5">
      <section className="rounded-[28px] border border-slate-200 bg-[#0F172A] p-5 text-white shadow-[0_18px_70px_rgba(15,23,42,0.16)] sm:p-8">
        <p className="text-xs font-black uppercase text-[#D4AF37]">Career Moat Radar</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">내 일의 방어력을 점검합니다.</h1>
        <p className="mt-4 max-w-3xl text-lg font-semibold leading-8 text-slate-300">
          기술 깊이, 결과 증거, 관계 자산, 도구 활용, 시장 수요를 조정하면서 다음 성장 방향을 확인하세요. 데이터는 저장되지 않습니다.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/occupations" className="rounded-full border-white bg-white text-[#0F172A]" size="lg">직업 허브 보기</ButtonLink>
          <ButtonLink href="/listen" className="rounded-full border-white/20 bg-white/5 text-white" size="lg">관련 에피소드 듣기</ButtonLink>
        </div>
      </section>
      <CareerMoatRadar />
    </main>
  );
}
