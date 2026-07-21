import { B2BCommandCenterPreview } from "@/components/b2b-command-center-preview";
import { Badge, ButtonLink } from "@/components/design-system";

export const dynamic = "force-static";

export default function BusinessCommandCenterPage() {
  return (
    <main className="space-y-5">
      <section className="rounded-[28px] border border-slate-200 bg-[#0F172A] p-5 text-white shadow-[0_18px_70px_rgba(15,23,42,0.16)] sm:p-8">
        <Badge tone="warning" className="rounded-full">B2B Beta</Badge>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">JOBDAY Command Center</h1>
        <p className="mt-4 max-w-3xl text-lg font-semibold leading-8 text-slate-300">
          기업이 직업 콘텐츠, 공고 품질, 광고 슬롯, 관심 행동을 한 곳에서 보도록 설계한 운영자용 프리뷰입니다.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/business" className="rounded-full border-white bg-white text-[#0F172A]" size="lg">비즈니스 구조</ButtonLink>
          <ButtonLink href="/occupations" className="rounded-full border-white/20 bg-white/5 text-white" size="lg">직업 허브</ButtonLink>
        </div>
      </section>

      <B2BCommandCenterPreview />

      <section className="rounded-[28px] border border-[#D4AF37]/40 bg-[#FFF8DF] p-5 sm:p-7">
        <h2 className="text-2xl font-black leading-tight text-[#0F172A]">위험한 보장 대신 운영 리포트</h2>
        <p className="mt-3 text-base font-semibold leading-7 text-slate-700">
          JOBDAY는 후보자 합격, 채용 성사, 임금, 근로조건을 보장하지 않습니다. 대신 30일 단위로 공고 문구, 직업 콘텐츠, 유입 지표를 보고 개선하는 구조를 제공합니다.
        </p>
      </section>
    </main>
  );
}
