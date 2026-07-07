import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, ButtonLink, Icon, IconFrame, NoticeBox, SectionHeader, SidebarCard } from "@/components/design-system";
import { SkillCard } from "@/components/skill-card";
import { getSkillLesson, skillLessons, skillStatusLabels } from "@/lib/skills";

function relatedLessons(currentId: string, category: string) {
  return skillLessons.filter((lesson) => lesson.id !== currentId && lesson.category === category).slice(0, 3);
}

export default async function SkillDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = getSkillLesson(id);
  if (!lesson) notFound();

  const related = relatedLessons(lesson.id, lesson.category);

  return (
    <div className="space-y-3 xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-4 xl:space-y-0">
      <article className="space-y-3">
        <section className="border border-line-strong bg-white p-3">
          <div className="flex gap-3">
            <IconFrame icon="helmet" tone={lesson.status === "free" ? "success" : "work"} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-1.5">
                <Badge tone={lesson.status === "free" ? "success" : lesson.status === "paid-soon" ? "warning" : "muted"} icon="notice">
                  {skillStatusLabels[lesson.status]}
                </Badge>
                <Badge tone="accent" icon="trade">{lesson.category}</Badge>
                <Badge tone="default" icon="star">{lesson.level}</Badge>
                <Badge tone="market" icon="calendar">예상 {lesson.duration}</Badge>
              </div>
              <h1 className="mt-2 text-2xl font-bold leading-[1.25] text-ink">{lesson.title}</h1>
              <p className="mt-2 text-base font-medium leading-7 text-muted">{lesson.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ButtonLink href={`/skills/apply?skill=${lesson.id}`} variant="primary" size="lg">
                  수강 대기 신청
                </ButtonLink>
                <ButtonLink href="/skills" size="lg">
                  강의 목록
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <section className="border border-line bg-white">
          <SectionHeader title="강의 소개" />
          <div className="space-y-3 p-3 text-base font-medium leading-7 text-ink">
            <p>{lesson.summary}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="border border-line bg-soft p-3">
                <p className="text-sm font-bold text-muted">강사</p>
                <p className="mt-1 text-lg font-bold text-ink">{lesson.instructor}</p>
              </div>
              <div className="border border-line bg-soft p-3">
                <p className="text-sm font-bold text-muted">필요한 공구</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {lesson.tools.map((tool) => (
                    <Badge key={tool} tone="market" icon="tool">{tool}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-2">
          <div className="border border-line bg-white">
            <SectionHeader title="배울 내용" />
            <ul className="divide-y divide-slate-200">
              {lesson.whatYouLearn.map((item) => (
                <li key={item} className="flex gap-2 px-3 py-2 text-base font-semibold leading-6 text-ink">
                  <Icon name="check" className="mt-1 h-4 w-4 text-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-line bg-white">
            <SectionHeader title="이런 사람에게 추천" />
            <ul className="divide-y divide-slate-200">
              {lesson.recommendedFor.map((item) => (
                <li key={item} className="flex gap-2 px-3 py-2 text-base font-semibold leading-6 text-ink">
                  <Icon name="user" className="mt-1 h-4 w-4 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border border-line bg-white">
          <SectionHeader title="강의 목차" count={`${lesson.curriculum.length}개`} />
          <ol className="divide-y divide-slate-200">
            {lesson.curriculum.map((item, index) => (
              <li key={item} className="flex gap-3 px-3 py-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center border border-amber-300 bg-amber-50 text-sm font-bold text-amber-900">
                  {index + 1}
                </span>
                <span className="text-base font-semibold leading-7 text-ink">{item}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="border border-line bg-white">
          <SectionHeader title="강사 소개" />
          <p className="p-3 text-base font-medium leading-7 text-ink">{lesson.instructorBio}</p>
        </section>

        <NoticeBox collapsible tone="warning" title="안전/책임 안내">
          <p>이 콘텐츠는 현장 입문 참고용입니다. 실제 작업은 현장 상황과 숙련도에 따라 달라질 수 있으며, 안전수칙과 현장 책임자의 지시를 우선해야 합니다.</p>
          <p>자격 취득, 일자리 결과, 숙련 결과를 약속하지 않으며 공식 교육이나 현장 지시를 대신하지 않습니다.</p>
        </NoticeBox>

        <section className="border border-line bg-white">
          <SectionHeader title="관련 공구/준비물 링크 자리" />
          <div className="divide-y divide-slate-200">
            {lesson.relatedLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex min-h-11 items-center justify-between px-3 py-2 text-base font-semibold text-ink active:bg-amber-50">
                {link.label}
                <Icon name="reply" className="h-4 w-4 rotate-180 text-accent" />
              </Link>
            ))}
          </div>
        </section>
      </article>

      <aside className="hidden space-y-3 xl:block">
        <SidebarCard title="수강 대기">
          <div className="space-y-3 p-3">
            <p className="text-base font-medium leading-6 text-muted">정식 강의 오픈 전 관심 있는 강의를 남겨두는 화면입니다. 운영자가 수동으로 안내합니다.</p>
            <ButtonLink href={`/skills/apply?skill=${lesson.id}`} variant="primary" fullWidth>
              수강 대기 신청
            </ButtonLink>
          </div>
        </SidebarCard>

        {related.length ? (
          <SidebarCard title="같은 직종 강의">
            <div className="space-y-2 p-2">
              {related.map((item) => (
                <SkillCard key={item.id} lesson={item} compact />
              ))}
            </div>
          </SidebarCard>
        ) : null}

        <SidebarCard title="커뮤니티에서 질문하기" actionHref="/boards/questions" actionLabel="이동">
          <p className="p-3 text-sm font-medium leading-6 text-muted">
            강의 내용만으로 부족한 현장 질문은 게시판에서 다른 작업자와 이야기해보세요.
          </p>
        </SidebarCard>
      </aside>
    </div>
  );
}
