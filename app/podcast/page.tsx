import Link from "next/link";
import { AdSenseNativeSlot } from "@/components/adsense-native-slot";
import { Badge, ButtonLink, Icon, NoticeBox, SectionHeader, SidebarCard } from "@/components/design-system";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getPublishedPodcastEpisodes, podcastEpisodes } from "@/lib/podcast";

export const dynamic = "force-static";

export default function PodcastPage() {
  const publishedEpisodes = getPublishedPodcastEpisodes();
  const featured = publishedEpisodes[0];
  const preparingEpisodes = podcastEpisodes.filter((episode) => episode.status === "preparing");
  const seasonEpisodes = podcastEpisodes.filter((episode) => episode.season === "시즌 1: 오늘의 현장 기본기");
  const showAdSlots = isFeatureEnabled("adsense_slots");

  return (
    <div className="space-y-4 xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start xl:gap-4 xl:space-y-0">
      <main className="space-y-4">
        <section className="border border-line-strong bg-white p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center border border-amber-300 bg-amber-50 text-accent">
              <Icon name="megaphone" className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black tracking-[0.18em] text-accent">JOBDAY BROADCAST</p>
              <h1 className="mt-2 text-3xl font-black leading-tight tracking-[-0.03em] text-ink">JOBDAY 방송</h1>
              <p className="mt-2 text-base font-semibold leading-6 text-muted">현장 정보와 커뮤니티 이야기를 짧게 듣습니다.</p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-ink">
            초보 입문, 구인글 읽는 법, 원정작업, 공구거래처럼 현장에서 자주 필요한 내용을 운영자가 골라 정리합니다. 초기에는 무료 오디오 에세이로 운영합니다.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <ButtonLink href="/podcast/submit" variant="primary" size="lg">
              <Icon name="pencil" className="mr-1.5 h-4 w-4" />
              방송 제안하기
            </ButtonLink>
            <ButtonLink href="/podcast/creators" size="lg">
              <Icon name="people" className="mr-1.5 h-4 w-4" />
              참여 안내
            </ButtonLink>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {["사람의 관점", "시즌형 연재", "무료 공개"].map((label) => (
              <div key={label} className="border border-line bg-soft px-3 py-2 text-sm font-black text-ink">{label}</div>
            ))}
          </div>
        </section>

        {featured ? (
          <section className="border border-accent bg-white">
            <SectionHeader title="이번 주 방송" count={featured.duration} />
            <Link href={`/episodes/${featured.id}`} className="block border-t border-line p-4 active:bg-amber-50 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="warning" icon="megaphone">무료 공개</Badge>
                <Badge tone="muted">{featured.season}</Badge>
                <Badge tone="muted">{featured.category}</Badge>
              </div>
              <h2 className="mt-3 text-2xl font-black leading-[1.3] text-ink">{featured.title}</h2>
              <p className="mt-2 text-base font-medium leading-7 text-muted">{featured.summary}</p>
              <p className="mt-3 border-l-4 border-accent bg-amber-50 px-3 py-2 text-sm font-bold leading-6 text-ink">{featured.themeQuestion}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-accent">방송 듣고 내용 보기 <span aria-hidden="true">→</span></span>
            </Link>
          </section>
        ) : null}

        <section className="border border-line-strong bg-white">
          <SectionHeader title="시즌 1" count="오늘의 현장 기본기" />
          <div className="divide-y divide-line">
            {seasonEpisodes.map((episode) => (
              <Link key={episode.id} href={`/episodes/${episode.id}`} className="grid gap-2 p-3 active:bg-amber-50 sm:grid-cols-[76px_minmax(0,1fr)_92px] sm:items-center">
                <span className="text-xs font-black tracking-[0.16em] text-accent">
                  {episode.episodeNo ? `EP.${String(episode.episodeNo).padStart(2, "0")}` : "NEXT"}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone={episode.status === "published" ? "success" : "warning"} icon={episode.status === "published" ? "check" : "clock"}>
                      {episode.status === "published" ? "공개" : "준비중"}
                    </Badge>
                    <Badge tone="muted">{episode.format}</Badge>
                  </div>
                  <p className="mt-2 text-base font-bold leading-6 text-ink">{episode.title}</p>
                </div>
                <span className="text-sm font-semibold text-muted sm:text-right">{episode.duration}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <SectionHeader title="공개된 방송" count={`${publishedEpisodes.length}편`} />
          <div className="grid gap-2 lg:grid-cols-2">
            {publishedEpisodes.map((episode) => (
              <div key={episode.id} className="contents">
                <Link href={`/episodes/${episode.id}`} className="border border-line-strong bg-white p-4 active:bg-amber-50">
                  <div className="flex items-center justify-between gap-3">
                    <Badge tone="muted">{episode.category}</Badge>
                    <span className="text-sm font-semibold text-muted">{episode.duration}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-bold leading-6 text-ink">{episode.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-muted">{episode.summary}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-accent">내용 보기 <span aria-hidden="true">→</span></span>
                </Link>
                {episode.id === "job-post-checklist" ? <AdSenseNativeSlot enabled={showAdSlots} /> : null}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <SectionHeader title="준비중" count={`${preparingEpisodes.length}편`} />
          <div className="grid gap-2 lg:grid-cols-2">
            {preparingEpisodes.map((episode) => (
              <Link key={episode.id} href={`/episodes/${episode.id}`} className="border border-line bg-soft p-4 active:bg-amber-50">
                <Badge tone="warning" icon="clock">준비중</Badge>
                <h2 className="mt-3 text-lg font-bold leading-6 text-ink">{episode.title}</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-muted">{episode.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <NoticeBox collapsible tone="muted" title="방송 운영 안내">
          <p>방송은 운영자가 검토한 공개 콘텐츠만 다룹니다. 이용자가 올린 글을 자동으로 음성화하거나 개인정보를 읽어주지 않습니다.</p>
          <p>AI는 초안 정리와 문장 다듬기에만 보조로 사용하고, 공개 여부와 최종 문맥은 운영자가 책임집니다.</p>
          <p>방송 내용은 현장 입문 참고용이며, 실제 작업조건·임금·안전사항은 당사자가 직접 확인해야 합니다.</p>
        </NoticeBox>
      </main>

      <aside className="space-y-3 xl:sticky xl:top-20">
        <SidebarCard title="같이 만드는 방송">
          <div className="space-y-3 p-3 text-sm font-medium leading-6 text-muted">
            <p>현장 사연, 초보 질문, 구인글 확인법을 보내면 운영자가 검토한 뒤 방송으로 다듬습니다.</p>
            <ButtonLink href="/podcast/submit" variant="primary" fullWidth>방송 제안하기</ButtonLink>
            <ButtonLink href="/podcast/creators" fullWidth>참여 안내 보기</ButtonLink>
          </div>
        </SidebarCard>
        <SidebarCard title="제작 원칙">
          <div className="space-y-3 p-3 text-sm font-medium leading-6 text-muted">
            <p><strong className="text-ink">한 장면</strong>에서 시작해 하나의 질문을 잡습니다.</p>
            <p><strong className="text-ink">조건과 반론</strong>을 함께 확인합니다.</p>
            <p><strong className="text-ink">게시판 행동</strong>으로 이어지게 짧게 끝냅니다.</p>
          </div>
        </SidebarCard>
        <SidebarCard title="방송 이용 방법">
          <div className="space-y-3 p-3 text-sm font-medium leading-6 text-muted">
            <p><strong className="text-ink">1.</strong> 관심 있는 주제를 고릅니다.</p>
            <p><strong className="text-ink">2.</strong> 대본을 읽거나 기기 듣기를 누릅니다.</p>
            <p><strong className="text-ink">3.</strong> 자세한 조건은 관련 게시판에서 직접 확인합니다.</p>
            <ButtonLink href="/boards/beginner" fullWidth>초보입문 게시판 보기</ButtonLink>
          </div>
        </SidebarCard>
        <SidebarCard title="관련 게시판">
          <div className="divide-y divide-line">
            <Link href="/boards/work-raid" className="block px-3 py-2.5 text-sm font-semibold text-ink active:bg-amber-50">작업 구인</Link>
            <Link href="/boards/remote-raid" className="block px-3 py-2.5 text-sm font-semibold text-ink active:bg-amber-50">원정 구인</Link>
            <Link href="/boards/tool-market" className="block px-3 py-2.5 text-sm font-semibold text-ink active:bg-amber-50">공구장터</Link>
            <Link href="/boards/questions" className="block px-3 py-2.5 text-sm font-semibold text-ink active:bg-amber-50">현장질문</Link>
          </div>
        </SidebarCard>
        <SidebarCard title="멤버십은 아직 준비중">
          <div className="space-y-3 p-3 text-sm font-medium leading-6 text-muted">
            <p>지금은 결제 없이 무료 공개로 반응을 봅니다.</p>
            <p>반복 청취와 재방문이 확인된 뒤에만 광고 없는 경험을 포함한 멤버십을 검토합니다.</p>
          </div>
        </SidebarCard>
      </aside>
    </div>
  );
}
