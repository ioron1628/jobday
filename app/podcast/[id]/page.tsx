import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge, ButtonLink, Icon, NoticeBox, SectionHeader } from "@/components/design-system";
import { PodcastListenButton } from "@/components/podcast-listen-button";
import { getPodcastEpisode, podcastEpisodes } from "@/lib/podcast";

export const dynamic = "force-static";

export function generateStaticParams() {
  return podcastEpisodes.map((episode) => ({ id: episode.id }));
}

export default async function PodcastDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const episode = getPodcastEpisode(id);
  if (!episode) notFound();

  const listenText = [episode.title, episode.summary, ...episode.transcript].join(". ");

  return (
    <article className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted">
        <Link href="/listen" className="text-accent hover:underline">듣기</Link>
        <span aria-hidden="true">/</span>
        <span>{episode.category}</span>
      </div>

      <header className="border border-line-strong bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={episode.status === "published" ? "success" : "warning"} icon={episode.status === "published" ? "check" : "clock"}>
            {episode.status === "published" ? "무료 공개" : "준비중"}
          </Badge>
          <Badge tone="muted">{episode.season}</Badge>
          {episode.episodeNo ? <Badge tone="muted">EP.{String(episode.episodeNo).padStart(2, "0")}</Badge> : null}
          <Badge tone="muted">{episode.category}</Badge>
          <Badge tone="muted">{episode.format}</Badge>
          <span className="text-sm font-semibold text-muted">{episode.duration}</span>
        </div>
        <h1 className="mt-4 text-3xl font-black leading-[1.25] tracking-[-0.02em] text-ink sm:text-4xl">{episode.title}</h1>
        <p className="mt-3 text-lg font-medium leading-8 text-muted">{episode.summary}</p>
        <div className="mt-4 border-l-4 border-accent bg-amber-50 px-4 py-3">
          <p className="text-xs font-black tracking-[0.16em] text-accent">이번 편의 질문</p>
          <p className="mt-1 text-base font-black leading-7 text-ink">{episode.themeQuestion}</p>
        </div>
        {episode.status === "published" ? (
          <div className="mt-5 border-t border-line pt-4">
            <PodcastListenButton text={listenText} />
          </div>
        ) : (
          <NoticeBox className="mt-5" tone="warning">
            <p>운영자가 내용을 확인한 뒤 공개할 예정입니다.</p>
          </NoticeBox>
        )}
      </header>

      {episode.takeaways.length ? (
        <section className="border border-line-strong bg-white p-4 sm:p-6">
          <SectionHeader title="이번 방송의 핵심" />
          <ul className="mt-3 space-y-2 border-t border-line pt-3">
            {episode.takeaways.map((takeaway) => (
              <li key={takeaway} className="flex items-start gap-2 text-base font-semibold leading-7 text-ink">
                <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-accent" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {episode.editorialNotes.length ? (
        <section className="border border-line-strong bg-white p-4 sm:p-6">
          <SectionHeader title="제작 노트" />
          <div className="mt-3 grid gap-2 border-t border-line pt-3 sm:grid-cols-3">
            {episode.editorialNotes.map((note) => (
              <div key={note} className="border border-line bg-soft p-3 text-sm font-bold leading-6 text-ink">
                {note}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {episode.transcript.length ? (
        <section className="border border-line-strong bg-white p-4 sm:p-6">
          <SectionHeader title="방송 대본" />
          <div className="mt-3 space-y-4 border-t border-line pt-4">
            {episode.transcript.map((paragraph) => <p key={paragraph} className="text-base font-medium leading-8 text-ink">{paragraph}</p>)}
          </div>
        </section>
      ) : null}

      <NoticeBox collapsible tone="muted" title="정보와 책임 안내">
        <p>{episode.sourceNote}</p>
        <p>{episode.nextPrompt}</p>
        <p>JOBDAY 방송은 현장 입문과 정보 탐색을 돕기 위한 콘텐츠입니다. 구인·구직 계약, 임금, 거래, 안전을 대신하거나 보장하지 않습니다.</p>
      </NoticeBox>

      <div className="grid gap-2 sm:grid-cols-2">
        <ButtonLink href="/listen" size="lg">듣기 목록으로</ButtonLink>
        <ButtonLink href={`/podcast/submit?topic=${episode.id}`} variant="primary" size="lg">
          이 주제로 제보하기
        </ButtonLink>
        <ButtonLink href="/boards" size="lg">게시판 둘러보기</ButtonLink>
        <ButtonLink href="/podcast/creators" size="lg">참여 안내 보기</ButtonLink>
      </div>
    </article>
  );
}
