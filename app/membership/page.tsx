import { Badge, ButtonLink } from "@/components/design-system";

export const dynamic = "force-static";

const tiers = [
  {
    name: "Free",
    price: "0원",
    features: ["Season 0 무료 청취", "직업 허브 탐색", "출연 신청", "추천 인사이트 일부 노출"]
  },
  {
    name: "JOBDAY Plus",
    price: "Post-beta",
    features: ["Ad-Free Experience", "저장한 에피소드", "직업 팔로우 알림", "프리미엄 직업 리포트 후보"]
  }
];

export default function MembershipPage() {
  return (
    <main className="space-y-5">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-8">
        <Badge tone="warning" className="rounded-full">Post-beta</Badge>
        <h1 className="mt-4 text-4xl font-black leading-tight text-[#0F172A] sm:text-5xl">광고 없는 직업 미디어 경험.</h1>
        <p className="mt-4 max-w-3xl text-lg font-semibold leading-8 text-slate-600">
          멤버십은 아직 결제 기능이 아닙니다. 반복 청취와 저장/팔로우 수요가 확인된 뒤, 광고 없는 경험을 핵심 가치로 검토합니다.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {tiers.map((tier) => (
          <article key={tier.name} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-7">
            <p className="text-xs font-black uppercase text-[#D4AF37]">{tier.name}</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#0F172A]">{tier.price}</h2>
            <ul className="mt-5 space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold leading-6 text-slate-700">
                  {feature}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-[28px] border border-[#D4AF37]/40 bg-[#FFF8DF] p-5 sm:p-7">
        <h2 className="text-2xl font-black leading-tight text-[#0F172A]">운영 원칙</h2>
        <p className="mt-3 text-base font-semibold leading-7 text-slate-700">
          결제, 환불, 개인정보 처리, 콘텐츠 제공 범위가 문서와 테스트로 준비되기 전에는 유료 결제를 열지 않습니다.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/listen" className="rounded-full" size="lg">듣기</ButtonLink>
          <ButtonLink href="/occupations" className="rounded-full" size="lg">직업 허브 보기</ButtonLink>
        </div>
      </section>
    </main>
  );
}
