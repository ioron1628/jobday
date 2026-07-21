import Link from "next/link";
import { Badge, ButtonLink, Icon, NoticeBox, SectionHeader, SidebarCard } from "@/components/design-system";

export const dynamic = "force-static";

const allowedTopics = [
  { title: "현장 첫날 이야기", body: "초보가 처음 현장에 갔을 때 헷갈린 점과 준비물" },
  { title: "구인글 확인법", body: "지역, 날짜, 일당, 인원, 연락방법을 보는 기준" },
  { title: "원정작업 체크", body: "숙소, 이동, 교통비, 차량동승 확인 경험" },
  { title: "공구/자재 거래", body: "상태, 가격, 직거래, 무료나눔에서 주의할 점" },
  { title: "일하는 사람의 하루", body: "현장, 매장, 물류, 외근, 프리랜서의 루틴과 회복" },
  { title: "초보 질문 답변", body: "반복해서 나오는 질문을 짧고 쉽게 정리" }
];

const blockedTopics = [
  "개인이나 업체 실명을 겨냥한 저격",
  "전화번호, 계좌번호, 정확한 주소 같은 개인정보",
  "저작권이 불확실한 음악, 글, 영상",
  "취업, 임금, 안전, 거래 결과를 보장하는 표현",
  "사실 확인이 어려운 소문이나 분쟁 내용"
];

export default function PodcastCreatorsPage() {
  return (
    <div className="space-y-4 xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start xl:gap-4 xl:space-y-0">
      <main className="space-y-4">
        <section className="border border-line-strong bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="warning" icon="people">함께 만드는 방송</Badge>
            <Badge tone="muted">제보·사연·대본</Badge>
          </div>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.03em] text-ink">JOBDAY 방송 참여 안내</h1>
          <p className="mt-2 max-w-2xl text-base font-semibold leading-7 text-muted">
            JOBDAY 방송은 현장 사람들이 보내는 질문과 경험을 운영자가 편집해 만드는 커뮤니티형 오디오 콘텐츠입니다.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {["제안", "검토", "공개"].map((item, index) => (
              <div key={item} className="border border-line bg-soft p-3">
                <p className="text-xs font-black tracking-[0.16em] text-accent">STEP {index + 1}</p>
                <p className="mt-1 text-lg font-black text-ink">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-line-strong bg-white">
          <SectionHeader title="받고 싶은 주제" count={`${allowedTopics.length}개`} />
          <div className="grid gap-2 border-t border-line p-3 sm:grid-cols-2">
            {allowedTopics.map((topic) => (
              <div key={topic.title} className="border border-line bg-soft p-3">
                <h2 className="text-base font-black text-ink">{topic.title}</h2>
                <p className="mt-1 text-sm font-medium leading-6 text-muted">{topic.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-line-strong bg-white">
          <SectionHeader title="참여 방식" />
          <div className="divide-y divide-line">
            {[
              ["사연 제보", "경험한 상황과 배운 점을 글로 보냅니다."],
              ["대본 초안", "방송에서 다뤘으면 하는 내용을 짧은 글로 정리합니다."],
              ["직접 녹음", "나중 단계에서 운영자 검토 후 짧은 음성 파일을 받을 수 있습니다."],
              ["질문 제안", "초보가 궁금해할 질문이나 게시판에서 자주 보이는 주제를 보냅니다."]
            ].map(([title, body]) => (
              <div key={title} className="grid gap-1 px-3 py-3 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-3">
                <p className="text-base font-black text-ink">{title}</p>
                <p className="text-sm font-medium leading-6 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <NoticeBox tone="warning" title="공개되지 않는 내용">
          <ul className="list-disc space-y-1 pl-5">
            {blockedTopics.map((topic) => <li key={topic}>{topic}</li>)}
          </ul>
        </NoticeBox>
      </main>

      <aside className="space-y-3 xl:sticky xl:top-20">
        <SidebarCard title="바로 참여하기">
          <div className="space-y-3 p-3">
            <p className="text-sm font-medium leading-6 text-muted">사연이나 대본 초안을 정리해서 운영자 검토 요청 문구로 만들 수 있습니다.</p>
            <ButtonLink href="/podcast/submit" variant="primary" size="lg" fullWidth>
              <Icon name="pencil" className="mr-1.5 h-4 w-4" />
              방송 제안하기
            </ButtonLink>
          </div>
        </SidebarCard>

        <SidebarCard title="나중에 확장할 것">
          <div className="space-y-3 p-3 text-sm font-medium leading-6 text-muted">
            <p>방송이 쌓이면 저장형 제출함, 짧은 음성 업로드, RSS, Apple Podcasts·팟빵 배포를 검토합니다.</p>
            <p>결제나 멤버십은 반복 청취와 재방문이 확인된 뒤에만 검토합니다.</p>
          </div>
        </SidebarCard>

        <Link href="/listen" className="block border border-line bg-white px-3 py-3 text-sm font-bold text-ink active:bg-amber-50">
          JOBDAY 방송 목록으로
        </Link>
      </aside>
    </div>
  );
}
