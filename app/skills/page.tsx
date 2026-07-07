import Link from "next/link";
import { SkillCard } from "@/components/skill-card";
import { Badge, ButtonLink, Icon, IconFrame, NoticeBox, SectionHeader, SidebarCard } from "@/components/design-system";
import { getPopularSkillLessons, getSkillLessonsByStatus, skillCategories, skillLessons } from "@/lib/skills";

export default function SkillsPage() {
  const freeLessons = getSkillLessonsByStatus("free");
  const popularLessons = getPopularSkillLessons();
  const waitingLessons = skillLessons.filter((lesson) => lesson.status !== "free");

  return (
    <div className="space-y-3 xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-4 xl:space-y-0">
      <div className="space-y-3">
        <section className="border border-line-strong bg-white p-3">
          <div className="flex items-start gap-3">
            <IconFrame icon="helmet" tone="work" size="lg" />
            <div className="min-w-0 flex-1">
              <Badge tone="warning" icon="star">커뮤니티 보조 메뉴</Badge>
              <h1 className="mt-2 text-2xl font-bold leading-[1.25] text-ink">JOBDAY 강의</h1>
              <p className="mt-1 text-lg font-bold leading-7 text-ink">기공에게 배우는 현장 기본기</p>
              <p className="mt-2 text-base font-medium leading-7 text-muted">
                작업레이드와 초보입문 게시판을 보조하는 현장 입문 강의 영역입니다.
              </p>
            </div>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <ButtonLink href="/skills/apply" variant="primary" size="lg" fullWidth>
              수강 대기 신청
            </ButtonLink>
            <ButtonLink href="/skills/instructor" size="lg" fullWidth>
              강사 지원 안내
            </ButtonLink>
          </div>
        </section>

        <section className="border border-line bg-white p-3">
          <div className="flex items-center gap-2">
            <Icon name="filter" className="h-4 w-4 text-accent" />
            <h2 className="text-lg font-bold text-ink">카테고리</h2>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {skillCategories.map((category) => (
              <span
                key={category}
                className="inline-flex min-h-10 shrink-0 items-center border border-line bg-soft px-3 text-sm font-bold text-ink"
              >
                {category}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <SectionHeader title="무료 맛보기 강의" count={`${freeLessons.length}개`} />
          <div className="grid gap-2 lg:grid-cols-2">
            {freeLessons.map((lesson) => (
              <SkillCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <SectionHeader title="인기 입문 강의" count={`${popularLessons.length}개`} />
          <div className="grid gap-2 lg:grid-cols-3">
            {popularLessons.map((lesson) => (
              <SkillCard key={lesson.id} lesson={lesson} compact />
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <SectionHeader title="준비중 강의" count={`${waitingLessons.length}개`} />
          <div className="grid gap-2 lg:grid-cols-2">
            {waitingLessons.map((lesson) => (
              <SkillCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </section>

        <NoticeBox collapsible tone="warning" title="안전/책임 안내">
          <p>이 콘텐츠는 현장 입문 참고용입니다. 실제 작업은 현장 상황과 숙련도에 따라 달라질 수 있으며, 안전수칙과 현장 책임자의 지시를 우선해야 합니다.</p>
          <p>JOBDAY 강의는 자격 취득, 일자리 결과, 숙련 결과를 약속하지 않으며 공식 교육이나 현장 지시를 대신하지 않습니다.</p>
        </NoticeBox>
      </div>

      <aside className="hidden space-y-3 xl:block">
        <SidebarCard title="강사 지원 안내" actionHref="/skills/instructor" actionLabel="지원하기">
          <div className="space-y-2 p-3 text-sm font-medium leading-6 text-muted">
            <p className="text-base font-bold text-ink">기공·반장님의 현장 노하우를 초보 입문자에게 소개합니다.</p>
            <p>강의는 커뮤니티를 보조하는 영역이며, 초기에는 운영자가 수동으로 검토합니다.</p>
            <ButtonLink href="/skills/instructor" fullWidth>강사 지원 보기</ButtonLink>
          </div>
        </SidebarCard>

        <SidebarCard title="직종별 보기">
          <div className="divide-y divide-slate-200">
            {skillCategories.map((category) => (
              <Link key={category} href={`/skills?category=${encodeURIComponent(category)}`} className="block px-3 py-2 text-base font-semibold text-ink active:bg-amber-50">
                {category}
              </Link>
            ))}
          </div>
        </SidebarCard>

        <SidebarCard title="커뮤니티로 이어보기">
          <div className="divide-y divide-slate-200">
            <Link href="/boards/beginner" className="block px-3 py-2 text-sm font-semibold leading-6 text-ink active:bg-amber-50">초보입문 게시판</Link>
            <Link href="/boards/questions" className="block px-3 py-2 text-sm font-semibold leading-6 text-ink active:bg-amber-50">현장질문 게시판</Link>
            <Link href="/boards/tool-market" className="block px-3 py-2 text-sm font-semibold leading-6 text-ink active:bg-amber-50">공구장터</Link>
          </div>
        </SidebarCard>
      </aside>
    </div>
  );
}
