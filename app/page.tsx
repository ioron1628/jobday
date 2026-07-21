import Link from "next/link";
import { Badge, ButtonLink, Icon } from "@/components/design-system";
import { AdSenseNativeSlot } from "@/components/adsense-native-slot";
import { CareerMoatRadar } from "@/components/career-moat-radar";
import { OccupationGraphExplorer } from "@/components/occupation-graph-explorer";
import { TransformationGapCalculator } from "@/components/transformation-gap-calculator";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { occupations } from "@/lib/occupations";
import { getPublishedPodcastEpisodes } from "@/lib/podcast";

export const dynamic = "force-dynamic";

const codexSystems = [
  { label: "Occupation Graph", body: "직업, 에피소드, 질문, 공고, 상품을 하나의 직업 데이터로 연결합니다.", icon: "grid" },
  { label: "RLS Security", body: "민감정보는 서버 권한과 Supabase RLS 양쪽에서 보호합니다.", icon: "warning" },
  { label: "Guest Protection", body: "출연자 동의, 익명 공개, 철회 흐름을 운영 기준으로 관리합니다.", icon: "user" },
  { label: "AI Safety Shield", body: "AI는 초안과 위험 후보만 돕고 공개 판단은 운영자가 합니다.", icon: "notice" },
  { label: "B2B Vetting Gate", body: "기업 공고와 브랜딩은 검수 기준을 통과한 뒤 노출합니다.", icon: "building" },
  { label: "Ops Engine", body: "신고, 검수, 공개, 숨김, 광고표시를 감사 로그로 남깁니다.", icon: "board" },
  { label: "Growth Analytics", body: "재생, 저장, 공유, 직업 클릭, 출연 신청을 제품 지표로 봅니다.", icon: "eye" },
  { label: "Scalability Flags", body: "커뮤니티, 구인, 샵, 광고, 멤버십은 기능 플래그로 단계 공개합니다.", icon: "flag" }
] as const;

const valueStack = [
  "직업인의 실제 하루를 담은 Season 0 에피소드",
  "직업별 허브와 입문 체크포인트",
  "출연 신청과 운영자 검수 workflow",
  "추천 인사이트형 광고 슬롯 설계",
  "검증 기업 공고 베타로 이어지는 구조",
  "광고 없는 경험을 포함한 멤버십 후보"
];

export default function HomePage() {
  const episodes = getPublishedPodcastEpisodes();
  const showApply = isFeatureEnabled("internal_apply");
  const showAdSlots = isFeatureEnabled("adsense_slots");

  return (
    <main className="space-y-5 sm:space-y-8">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.08)]">
        <div className="grid min-h-[680px] lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <div className="flex flex-col justify-between bg-[#0F172A] p-5 text-white sm:p-10 lg:p-12">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-1 text-xs font-black uppercase text-[#D4AF37]">
                  JOBDAY
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
                  Media · Occupation · Growth
                </span>
              </div>

              <h1 className="mt-8 max-w-3xl text-5xl font-black leading-[1.04] sm:text-7xl lg:text-8xl">
                Work stories.
                <br />
                Career signals.
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-300 sm:text-xl">
                JOBDAY는 실제 직업인의 이야기를 직업 데이터, 커뮤니티, 구인 정보, 추천 인사이트로 연결하는 한국어 직업 미디어 플랫폼입니다.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/listen" size="lg" className="rounded-full border-white bg-white px-6 text-[#0F172A] active:bg-slate-100">
                  방송 듣기
                </ButtonLink>
                <ButtonLink href="/episodes/job-post-checklist" size="lg" className="rounded-full border-white/20 bg-white/5 px-6 text-white active:bg-white/10">
                  일자리 찾기
                </ButtonLink>
                <ButtonLink href="/occupations" size="lg" className="rounded-full border-white/20 bg-white/5 px-6 text-white active:bg-white/10">
                  직업 찾기
                </ButtonLink>
                {showApply ? (
                  <ButtonLink href="/podcast/submit" size="lg" className="rounded-full border-[#D4AF37] bg-[#D4AF37] px-6 text-[#0F172A] active:bg-[#C19B2B]">
                    출연 신청
                  </ButtonLink>
                ) : null}
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ["6", "Season 0 episodes"],
                ["8", "Codex systems"],
                ["15", "Feature flags"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-3xl font-black text-[#D4AF37]">{value}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-300">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative bg-[#F8FAFC] p-5 sm:p-8 lg:p-10">
            <div className="absolute right-8 top-8 hidden h-28 w-28 rounded-full bg-[#D4AF37]/20 blur-3xl sm:block" />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,23,42,0.08)]">
                <p className="text-xs font-black uppercase text-[#D4AF37]">Featured Occupation</p>
                <h2 className="mt-4 text-4xl font-black leading-[1.08] text-[#0F172A]">일을 이해하는 가장 빠른 방법.</h2>
                <p className="mt-3 text-base font-semibold leading-7 text-slate-600">
                  직업인의 말, 하루의 리듬, 필요한 준비물, 다음 행동을 한 페이지에서 연결합니다.
                </p>
                <div className="mt-6 grid gap-2">
                  {occupations.slice(0, 4).map((occupation) => (
                    <Link
                      key={occupation.slug}
                      href={`/occupations/${occupation.slug}`}
                      className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-[#D4AF37] hover:bg-white"
                    >
                      <span>
                        <span className="block text-sm font-black text-[#0F172A]">{occupation.name}</span>
                        <span className="block text-xs font-semibold text-slate-500">{occupation.industry}</span>
                      </span>
                      <Icon name="briefcase" className="h-5 w-5 text-slate-400 group-hover:text-[#D4AF37]" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-[#D4AF37]/40 bg-[#0F172A] p-5 text-white shadow-[0_18px_70px_rgba(15,23,42,0.18)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase text-[#D4AF37]">B2B Beta Offer</p>
                    <h2 className="mt-2 text-2xl font-black leading-tight">공고보다 먼저, 직업 브랜드를 만듭니다.</h2>
                  </div>
                  <Icon name="building" className="h-8 w-8 text-[#D4AF37]" />
                </div>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-300">
                  후보자 보장 문구 대신, 30일 운영 리포트와 공고 품질 개선안을 제공하는 안전한 베타 제안으로 설계합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-[#D4AF37]">AdSense-ready Media Grid</p>
              <h2 className="mt-2 text-3xl font-black leading-tight text-[#0F172A]">듣고, 이해하고, 다음 행동으로.</h2>
            </div>
            <ButtonLink href="/listen" className="rounded-full" size="sm">
              전체 에피소드
            </ButtonLink>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {episodes.slice(0, 6).map((episode, index) => (
              <div key={episode.id} className="contents">
                <Link
                  href={`/episodes/${episode.id}`}
                  className="group rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-5 transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:bg-white hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="dark" className="rounded-full">{episode.season}</Badge>
                    <Badge tone="muted" className="rounded-full">{episode.duration}</Badge>
                    <Badge tone="accent" className="rounded-full">{episode.category}</Badge>
                  </div>
                  <h3 className="mt-4 text-2xl font-black leading-tight text-[#0F172A] group-hover:underline">{episode.title}</h3>
                  <p className="mt-3 line-clamp-3 text-base font-medium leading-7 text-slate-600">{episode.summary}</p>
                  <p className="mt-5 text-sm font-black text-[#D4AF37]">Listen now</p>
                </Link>

                {index === 1 ? <AdSenseNativeSlot enabled={showAdSlots} /> : null}
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-black uppercase text-[#D4AF37]">Grand Slam Structure</p>
            <h2 className="mt-3 text-2xl font-black leading-tight text-[#0F172A]">좋은 콘텐츠가 아니라, 다음 행동을 만드는 구조.</h2>
            <div className="mt-5 space-y-2">
              {valueStack.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-xs font-black text-[#D4AF37]">
                    {index + 1}
                  </span>
                  <p className="text-sm font-bold leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-[#0F172A] p-5 text-white shadow-[0_18px_70px_rgba(15,23,42,0.14)]">
            <p className="text-xs font-black uppercase text-[#D4AF37]">Post-beta Membership</p>
            <h2 className="mt-3 text-2xl font-black leading-tight">Ad-Free Experience</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-300">
              멤버십은 아직 결제 기능이 아닙니다. 콘텐츠 반복 소비가 확인되면 광고 없는 청취 경험과 저장 기능을 핵심 가치로 검토합니다.
            </p>
          </section>
        </aside>
      </section>

      <TransformationGapCalculator />

      <CareerMoatRadar />

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-[#D4AF37]">The 8 Codex Systems</p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-[#0F172A]">운영 가능한 플랫폼으로 만드는 8개 시스템.</h2>
          </div>
          <Badge tone="muted" className="rounded-full">placeholder · feature-flag ready</Badge>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {codexSystems.map((system) => (
            <article key={system.label} className="rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F172A] text-[#D4AF37]">
                <Icon name={system.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-black leading-tight text-[#0F172A]">{system.label}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{system.body}</p>
            </article>
          ))}
        </div>
      </section>

      <OccupationGraphExplorer occupations={occupations} />
    </main>
  );
}
