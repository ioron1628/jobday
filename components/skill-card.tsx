import Link from "next/link";
import { Badge, ButtonLink, Icon, IconFrame } from "@/components/design-system";
import { skillStatusLabels, type SkillCategory, type SkillLesson, type SkillStatus } from "@/lib/skills";

function categoryIcon(category: SkillCategory) {
  if (category === "공통입문") return "helmet";
  if (category === "전기") return "warning";
  if (category === "설비") return "tool";
  if (category === "철거") return "briefcase";
  return "trade";
}

function statusTone(status: SkillStatus) {
  if (status === "free") return "success";
  if (status === "paid-soon") return "warning";
  return "muted";
}

export function SkillCard({ lesson, compact = false }: { lesson: SkillLesson; compact?: boolean }) {
  return (
    <article className="border border-line bg-white shadow-[inset_0_-2px_0_rgba(17,24,39,0.04)]">
      <Link href={`/skills/${lesson.id}`} className="block p-3 active:bg-amber-50">
        <div className="flex gap-3">
          <IconFrame icon={categoryIcon(lesson.category)} tone={lesson.status === "free" ? "success" : "work"} size={compact ? "md" : "lg"} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1.5">
              <Badge tone={statusTone(lesson.status)} icon={lesson.status === "free" ? "check" : "notice"}>
                {skillStatusLabels[lesson.status]}
              </Badge>
              <Badge tone="accent" icon="trade">{lesson.category}</Badge>
              <Badge tone="default" icon="star">{lesson.level}</Badge>
            </div>
            <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-[1.3] text-ink">{lesson.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-muted">{lesson.summary}</p>
          </div>
        </div>

        <div className="mt-3 grid gap-1.5 text-sm font-semibold leading-5 text-ink sm:grid-cols-2">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="calendar" className="h-4 w-4 text-accent" />
            예상 {lesson.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="user" className="h-4 w-4 text-accent" />
            {lesson.instructor}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {lesson.tools.slice(0, compact ? 3 : 5).map((tool) => (
            <Badge key={tool} tone="market" icon="tool">{tool}</Badge>
          ))}
        </div>
      </Link>

      <div className="border-t border-line bg-soft p-2">
        <ButtonLink href={`/skills/apply?skill=${lesson.id}`} size="sm" variant={lesson.status === "coming-soon" ? "secondary" : "primary"} fullWidth>
          {lesson.status === "coming-soon" ? "알림 받기" : "수강 대기"}
        </ButtonLink>
      </div>
    </article>
  );
}
