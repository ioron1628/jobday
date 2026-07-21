import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge, ButtonLink, SectionHeader, SidebarCard } from "@/components/design-system";
import { getOccupation, occupations } from "@/lib/occupations";
import { getPodcastEpisode } from "@/lib/podcast";
import { getShopProduct } from "@/lib/shop";

export const dynamic = "force-static";

export function generateStaticParams() {
  return occupations.map((occupation) => ({ slug: occupation.slug }));
}

export default async function OccupationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const occupation = getOccupation(slug);
  if (!occupation) notFound();

  const episodes = occupation.episodeIds.map((id) => getPodcastEpisode(id)).filter(Boolean);
  const products = occupation.shopProductIds.map((id) => getShopProduct(id)).filter(Boolean);

  return (
    <div className="space-y-4 xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start xl:gap-4 xl:space-y-0">
      <main className="space-y-4">
        <section className="border border-line-strong bg-white p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="warning" icon="briefcase">{occupation.industry}</Badge>
            <Badge tone="muted">직업 허브</Badge>
          </div>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.03em] text-ink sm:text-4xl">{occupation.name}</h1>
          <p className="mt-2 text-xl font-black leading-8 text-ink">{occupation.headline}</p>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-muted">{occupation.description}</p>
        </section>

        <section className="border border-line-strong bg-white">
          <SectionHeader title="처음 확인할 질문" count={`${occupation.firstQuestions.length}개`} />
          <div className="grid gap-2 border-t border-line p-3 sm:grid-cols-3">
            {occupation.firstQuestions.map((question) => (
              <div key={question} className="border border-line bg-soft p-3 text-sm font-bold leading-6 text-ink">
                {question}
              </div>
            ))}
          </div>
        </section>

        <section className="border border-line-strong bg-white">
          <SectionHeader title="관련 JOBDAY 에피소드" count={`${episodes.length}편`} actionHref="/listen" actionLabel="듣기 목록" />
          <div className="divide-y divide-line">
            {episodes.map((episode) => episode ? (
              <Link key={episode.id} href={`/episodes/${episode.id}`} className="block p-3 active:bg-amber-50">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="success" icon="play">방송</Badge>
                  <Badge tone="muted">{episode.duration}</Badge>
                </div>
                <p className="mt-2 text-base font-black leading-6 text-ink">{episode.title}</p>
                <p className="mt-1 text-sm font-medium leading-6 text-muted">{episode.summary}</p>
              </Link>
            ) : null)}
          </div>
        </section>

        <section className="border border-line-strong bg-white">
          <SectionHeader title="관련 제품 큐레이션" count={`${products.length}개`} actionHref="/shop" actionLabel="JOBDAYSHOP" />
          <div className="grid gap-2 border-t border-line p-3 sm:grid-cols-3">
            {products.map((product) => product ? (
              <Link key={product.id} href={`/shop/${product.id}`} className="border border-line bg-soft p-3 active:bg-amber-50">
                <Badge tone="market">{product.category}</Badge>
                <p className="mt-2 text-base font-black leading-6 text-ink">{product.name}</p>
                <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-muted">{product.summary}</p>
              </Link>
            ) : null)}
          </div>
        </section>
      </main>

      <aside className="space-y-3 xl:sticky xl:top-20">
        <SidebarCard title="이 허브의 대상">
          <div className="p-3 text-sm font-semibold leading-6 text-muted">{occupation.audience}</div>
        </SidebarCard>
        <SidebarCard title="수익 연결 방식">
          <div className="p-3 text-sm font-medium leading-6 text-muted">{occupation.revenuePath}</div>
        </SidebarCard>
        <ButtonLink href="/occupations/graph" size="lg" fullWidth>직업 그래프 보기</ButtonLink>
        <ButtonLink href="/career-moat" size="lg" fullWidth>커리어 레이더</ButtonLink>
        <ButtonLink href={`/boards/${occupation.boardSlug}`} size="lg" fullWidth>관련 대화 보기</ButtonLink>
        <ButtonLink href={`/boards/${occupation.jobBoardSlug}`} variant="primary" size="lg" fullWidth>관련 구인 보기</ButtonLink>
      </aside>
    </div>
  );
}
