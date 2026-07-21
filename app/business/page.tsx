import { B2BCommandCenterPreview } from "@/components/b2b-command-center-preview";
import { Badge, ButtonLink, Icon, NoticeBox, SectionHeader, SidebarCard } from "@/components/design-system";

export const dynamic = "force-static";

const revenueModels = [
  {
    title: "추천 공고/상단 노출",
    phase: "Jobs 단계",
    price: "7일 39,000원 / 30일 79,000원 가설",
    condition: "노출보다 조회·문의·지원 데이터를 먼저 확인"
  },
  {
    title: "기업 직무 소개 콘텐츠",
    phase: "Business 단계",
    price: "건당 150만 원부터 테스트",
    condition: "광고 표시와 편집권 분리를 수용하는 기업만"
  },
  {
    title: "직업 카테고리 스폰서",
    phase: "Media/Community 단계",
    price: "도달량에 따라 별도 견적",
    condition: "직업·지역·콘텐츠 맥락과 맞을 때만"
  },
  {
    title: "JOBDAYSHOP 큐레이션",
    phase: "Shop 단계",
    price: "제휴·위탁·소량 사입",
    condition: "직업 맥락, 추천 근거, 반품률 기준 통과"
  },
  {
    title: "멤버십",
    phase: "Post-Beta",
    price: "월 4,900~9,900원 가설",
    condition: "반복 청취와 저장/팔로우가 확인된 뒤"
  }
];

const gates = [
  "시즌0 방송 6편과 예비 3편 확보",
  "반복 청취와 자발적 출연/주제 요청 확인",
  "커뮤니티 사용자 글과 댓글이 운영자 글을 넘어 증가",
  "유료 추천공고 10개 또는 기업 브랜딩 첫 결제",
  "샵은 제휴/위탁 중심으로 30일 회전과 반품률 확인"
];

export default function BusinessPage() {
  return (
    <div className="space-y-4 xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start xl:gap-4 xl:space-y-0">
      <main className="space-y-4">
        <section className="border border-line-strong bg-white p-4 sm:p-6">
          <Badge tone="warning" icon="building">JOBDAY BUSINESS</Badge>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.03em] text-ink sm:text-4xl">직업 맥락 안에서 광고와 채용을 연결합니다</h1>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-muted">
            JOBDAY는 배너를 많이 파는 사이트가 아니라, 직업인의 이야기와 직업 허브 안에서 기업 공고, 브랜드 콘텐츠, 제품 큐레이션을 자연스럽게 연결하는 구조를 지향합니다.
          </p>
        </section>

        <section className="border border-line-strong bg-white">
          <SectionHeader title="수익 구조" count={`${revenueModels.length}개`} />
          <div className="divide-y divide-line">
            {revenueModels.map((model) => (
              <div key={model.title} className="grid gap-2 p-3 sm:grid-cols-[180px_minmax(0,1fr)_220px] sm:items-center">
                <div>
                  <Badge tone="muted">{model.phase}</Badge>
                  <p className="mt-2 text-base font-black leading-6 text-ink">{model.title}</p>
                </div>
                <p className="text-sm font-semibold leading-6 text-muted">{model.condition}</p>
                <p className="text-sm font-black leading-6 text-accent sm:text-right">{model.price}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-line-strong bg-white">
          <SectionHeader title="다음 단계로 가는 검증 게이트" count={`${gates.length}개`} />
          <div className="grid gap-2 border-t border-line p-3">
            {gates.map((gate, index) => (
              <div key={gate} className="flex items-start gap-3 border border-line bg-soft p-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center border border-amber-300 bg-amber-50 text-xs font-black text-accent">{index + 1}</span>
                <p className="text-sm font-bold leading-6 text-ink">{gate}</p>
              </div>
            ))}
          </div>
        </section>

        <B2BCommandCenterPreview />

        <section className="rounded-[28px] border border-[#D4AF37]/40 bg-[#0F172A] p-5 text-white shadow-[0_18px_70px_rgba(15,23,42,0.14)] sm:p-7">
          <Badge tone="warning" className="rounded-full">Grand Slam Structure</Badge>
          <h2 className="mt-4 text-3xl font-black leading-tight">채용 보장이 아니라, 30일 개선 루프를 제안합니다.</h2>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-300">
            JOBDAY는 후보자 합격이나 채용 성사를 보장하지 않습니다. 대신 공고 조건, 직업 콘텐츠, 유입 데이터, 관심 행동을 30일 단위로 보고 다음 실험을 제안합니다.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["직업 콘텐츠 1편", "공고 품질 점검", "30일 운영 리포트"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-black text-white">
                {item}
              </div>
            ))}
          </div>
        </section>

        <NoticeBox tone="warning" title="광고/협찬 표시 원칙">
          <p>모든 유료 노출은 광고 또는 협찬을 명확히 표시합니다. 일반 출연, 편집 콘텐츠, 광고주의 검토 가능 범위는 분리합니다.</p>
          <p>JOBDAY는 구직 성사, 임금, 안전, 거래 결과를 보장하지 않습니다.</p>
        </NoticeBox>
      </main>

      <aside className="space-y-3 xl:sticky xl:top-20">
        <SidebarCard title="초기 영업 대상">
          <div className="space-y-3 p-3 text-sm font-medium leading-6 text-muted">
            <p>물류센터, 현장 팀장, 교육기관, 작업복·보호용품·공구 브랜드, 지역 중소기업.</p>
            <p>단순 배너보다 직무 소개, 구인 조건 명확화, 직업 허브 스폰서가 우선입니다.</p>
          </div>
        </SidebarCard>
        <ButtonLink href="/listen" variant="primary" size="lg" fullWidth>
          <Icon name="play" className="mr-1.5 h-4 w-4" />
          미디어 보기
        </ButtonLink>
        <ButtonLink href="/business/command-center" size="lg" fullWidth>Command Center</ButtonLink>
        <ButtonLink href="/occupations" size="lg" fullWidth>직업 허브 보기</ButtonLink>
      </aside>
    </div>
  );
}
