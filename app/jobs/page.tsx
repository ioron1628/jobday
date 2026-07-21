import Link from "next/link";
import { Badge, ButtonLink, Icon, NoticeBox, SectionHeader, SidebarCard } from "@/components/design-system";

export const dynamic = "force-static";

const jobBoards = [
  { href: "/boards/work-raid", title: "작업 구인", body: "지역, 날짜, 직종, 일당, 인원 조건을 먼저 확인합니다." },
  { href: "/boards/remote-raid", title: "원정 구인", body: "숙소, 이동, 교통비, 차량동승 조건을 함께 봅니다." },
  { href: "/boards/dimodo", title: "보조 구인", body: "보조·조공성 글을 초보가 이해하기 쉽게 모읍니다." },
  { href: "/boards/available-today", title: "오늘 일당 가능", body: "오늘 가능한 사람의 지역, 직종, 희망일당을 확인합니다." },
  { href: "/boards/company-jobs", title: "시공사 구인", body: "회사·팀 단위 구인 정보를 운영자 검토 기준으로 정리합니다." }
];

const requiredFields = ["직업/직종", "회사 또는 팀", "지역", "모집기간", "인원", "임금/지급주기", "시간", "업무", "식사·교통·숙소", "지원방법"];

export default function JobsPage() {
  return (
    <div className="space-y-4 xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start xl:gap-4 xl:space-y-0">
      <main className="space-y-4">
        <section className="border border-line-strong bg-white p-4 sm:p-6">
          <Badge tone="warning" icon="briefcase">JOBDAY JOBS</Badge>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.03em] text-ink sm:text-4xl">공고보다 먼저 일의 맥락을 봅니다</h1>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-muted">
            초기 JOBDAY JOBS는 알선이나 자동 매칭이 아니라 직업정보 제공형 구인 정보입니다. 사용자는 조건을 확인하고 직접 연락 여부를 판단합니다.
          </p>
        </section>

        <section className="border border-line-strong bg-white">
          <SectionHeader title="구인 정보 보기" count={`${jobBoards.length}개`} />
          <div className="grid gap-2 border-t border-line p-3 md:grid-cols-2">
            {jobBoards.map((board) => (
              <Link key={board.href} href={board.href} className="border border-line bg-soft p-4 active:bg-amber-50">
                <Badge tone="accent" icon="briefcase">{board.title}</Badge>
                <p className="mt-3 text-sm font-semibold leading-6 text-muted">{board.body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-accent">글 보기 <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border border-line-strong bg-white">
          <SectionHeader title="좋은 공고에 필요한 조건" count={`${requiredFields.length}개`} />
          <div className="grid grid-cols-2 gap-2 border-t border-line p-3 sm:grid-cols-5">
            {requiredFields.map((field) => (
              <div key={field} className="border border-line bg-white px-3 py-2 text-center text-sm font-black text-ink">{field}</div>
            ))}
          </div>
        </section>

        <NoticeBox tone="warning" title="직업정보 제공 원칙">
          <p>JOBDAY는 구인자와 구직자 사이의 계약 당사자가 아닙니다. 지원, 연락, 임금, 근로조건, 안전사항은 당사자가 직접 확인해야 합니다.</p>
        </NoticeBox>
      </main>

      <aside className="space-y-3 xl:sticky xl:top-20">
        <SidebarCard title="앞으로 추가할 것">
          <div className="space-y-3 p-3 text-sm font-medium leading-6 text-muted">
            <p>기업 검증, 공고 필수값 검사, 저장/알림, 만료, 신고 대응은 별도 DB/RLS 설계 후 단계적으로 붙입니다.</p>
            <p>채용 성공 수수료나 운영자 개별 알선은 관련 등록과 법적 검토 전에는 만들지 않습니다.</p>
          </div>
        </SidebarCard>
        <ButtonLink href="/occupations" variant="primary" size="lg" fullWidth>
          <Icon name="briefcase" className="mr-1.5 h-4 w-4" />
          직업 허브 보기
        </ButtonLink>
        <ButtonLink href="/write" size="lg" fullWidth>구인글 작성</ButtonLink>
      </aside>
    </div>
  );
}
