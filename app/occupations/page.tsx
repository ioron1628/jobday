import Link from "next/link";
import { Badge, ButtonLink, Icon, SectionHeader, SidebarCard } from "@/components/design-system";
import { occupations } from "@/lib/occupations";

export const dynamic = "force-static";

export default function OccupationsPage() {
  return (
    <div className="space-y-4 xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start xl:gap-4 xl:space-y-0">
      <main className="space-y-4">
        <section className="border border-line-strong bg-white p-4 sm:p-6">
          <Badge tone="warning" icon="briefcase">OCCUPATION GRAPH</Badge>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.03em] text-ink sm:text-4xl">직업 허브</h1>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-muted">
            JOBDAY의 중심은 직업입니다. 방송, 커뮤니티, 구인정보, 제품, 스폰서는 각각 흩어진 메뉴가 아니라 하나의 직업 페이지에서 연결됩니다.
          </p>
        </section>

        <section className="border border-line-strong bg-white">
          <SectionHeader title="먼저 열어볼 직업" count={`${occupations.length}개`} />
          <div className="grid gap-2 border-t border-line p-3 md:grid-cols-2">
            {occupations.map((occupation) => (
              <Link key={occupation.slug} href={`/occupations/${occupation.slug}`} className="group border border-line bg-soft p-4 active:bg-amber-50">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="muted">{occupation.industry}</Badge>
                  <Badge tone="accent">{occupation.name}</Badge>
                </div>
                <h2 className="mt-3 text-xl font-black leading-7 text-ink group-hover:underline">{occupation.headline}</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-muted">{occupation.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-accent">허브 보기 <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <aside className="space-y-3 xl:sticky xl:top-20">
        <SidebarCard title="직업 허브가 하는 일">
          <div className="space-y-3 p-3 text-sm font-medium leading-6 text-muted">
            <p><strong className="text-ink">이야기:</strong> 실제 직업인의 방송과 인터뷰를 모읍니다.</p>
            <p><strong className="text-ink">대화:</strong> 같은 일을 하는 사람들의 질문과 경험을 연결합니다.</p>
            <p><strong className="text-ink">정보:</strong> 공고와 준비물은 직업 맥락 안에서 보여줍니다.</p>
          </div>
        </SidebarCard>

        <ButtonLink href="/listen" variant="primary" size="lg" fullWidth>
          <Icon name="play" className="mr-1.5 h-4 w-4" />
          방송 먼저 듣기
        </ButtonLink>
        <ButtonLink href="/occupations/graph" size="lg" fullWidth>직업 그래프 보기</ButtonLink>
        <ButtonLink href="/career-moat" size="lg" fullWidth>커리어 레이더</ButtonLink>
        <ButtonLink href="/boards" size="lg" fullWidth>게시판 보기</ButtonLink>
      </aside>
    </div>
  );
}
