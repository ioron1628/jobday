import Link from "next/link";
import { Badge, ButtonLink, Icon, NoticeBox, SidebarCard } from "@/components/design-system";
import { PodcastSubmitForm } from "@/components/podcast-submit-form";
import { getPodcastEpisode } from "@/lib/podcast";

export const dynamic = "force-dynamic";

export default async function PodcastSubmitPage({
  searchParams
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const episode = topic ? getPodcastEpisode(topic) : null;

  return (
    <div className="space-y-4 xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start xl:gap-4 xl:space-y-0">
      <main className="space-y-4">
        <section className="border border-line-strong bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="warning" icon="megaphone">참여형 방송</Badge>
            <Badge tone="muted">운영자 검토 후 공개</Badge>
          </div>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.03em] text-ink">방송 제안하기</h1>
          <p className="mt-2 max-w-2xl text-base font-semibold leading-7 text-muted">
            현장 이야기, 구인글을 볼 때 확인할 것, 초보가 헷갈리는 점을 보내주세요. 운영자가 확인하고 JOBDAY 방송으로 다듬어 공개합니다.
          </p>
          {episode ? (
            <div className="mt-4 border border-amber-300 bg-amber-50 p-3">
              <p className="text-xs font-black tracking-[0.16em] text-accent">관련 방송</p>
              <Link href={`/episodes/${episode.id}`} className="mt-1 block text-base font-black leading-6 text-ink underline-offset-4 hover:underline">
                {episode.title}
              </Link>
            </div>
          ) : null}
        </section>

        <PodcastSubmitForm initialTopic={episode?.title} />
      </main>

      <aside className="space-y-3 xl:sticky xl:top-20">
        <SidebarCard title="올리기 전 기준">
          <div className="space-y-3 p-3 text-sm font-medium leading-6 text-muted">
            <p><strong className="text-ink">가능:</strong> 현장 경험, 질문, 준비물, 조건 확인 팁, 공구/자재 거래 주의사항</p>
            <p><strong className="text-ink">불가:</strong> 실명 저격, 개인정보, 저작권 불명확한 음원, 임금·취업·안전 보장 문구</p>
            <p><strong className="text-ink">공개:</strong> 운영자가 확인한 뒤 필요한 경우 익명 편집해서 공개합니다.</p>
          </div>
        </SidebarCard>

        <SidebarCard title="참여 흐름">
          <div className="divide-y divide-line text-sm font-semibold text-ink">
            {["제안서 작성", "운영자에게 전달", "개인정보/저작권 확인", "대본 편집", "방송 공개"].map((step, index) => (
              <div key={step} className="flex items-center gap-2 px-3 py-2.5">
                <span className="inline-flex h-6 w-6 items-center justify-center border border-line bg-soft text-xs font-black text-accent">{index + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </SidebarCard>

        <NoticeBox tone="muted" title="저장형 제출함 안내">
          <p>지금은 DB를 바꾸지 않는 안전한 버전입니다. 실제 웹 제출함은 `podcast_submissions` 테이블과 관리자 검토 화면을 만든 뒤 연결합니다.</p>
        </NoticeBox>

        <ButtonLink href="/podcast/creators" size="lg" fullWidth>
          <Icon name="people" className="mr-1.5 h-4 w-4" />
          참여 안내 보기
        </ButtonLink>
      </aside>
    </div>
  );
}
