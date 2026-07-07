import { SkillActionButton } from "@/components/skill-action-button";
import { Badge, ButtonLink, FieldLabel, IconFrame, Input, NoticeBox, Select, Textarea } from "@/components/design-system";
import { getSkillLesson, skillLessons } from "@/lib/skills";

export default async function SkillApplyPage({
  searchParams
}: {
  searchParams?: Promise<{ skill?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const selectedLesson = resolvedSearchParams?.skill ? getSkillLesson(resolvedSearchParams.skill) : undefined;

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      <section className="border border-line-strong bg-white p-3">
        <div className="flex gap-3">
          <IconFrame icon="star" tone="work" size="lg" />
          <div className="min-w-0 flex-1">
            <Badge tone="warning" icon="notice">대기 신청</Badge>
            <h1 className="mt-2 text-2xl font-bold leading-[1.25] text-ink">수강 대기 신청</h1>
            <p className="mt-2 text-base font-medium leading-7 text-muted">
              관심 있는 현장 기본기 강의를 남기는 화면입니다. 정식 오픈 전에는 운영자가 수동으로 안내합니다.
            </p>
          </div>
        </div>
      </section>

      <form className="space-y-3 border border-line bg-white p-3">
        <div>
          <FieldLabel htmlFor="skill" label="관심 강의" required />
          <Select id="skill" name="skill" defaultValue={selectedLesson?.id ?? ""}>
            <option value="">강의를 선택하세요</option>
            {skillLessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="nickname" label="이름/닉네임" required />
            <Input id="nickname" name="nickname" placeholder="예: 부산초보타일" />
          </div>
          <div>
            <FieldLabel htmlFor="trade" label="관심 직종" required />
            <Select id="trade" name="trade" defaultValue={selectedLesson?.category ?? ""}>
              <option value="">직종을 선택하세요</option>
              <option value="타일">타일</option>
              <option value="목공">목공</option>
              <option value="전기">전기</option>
              <option value="설비">설비</option>
              <option value="도배">도배</option>
              <option value="철거">철거</option>
              <option value="공통입문">공통입문</option>
            </Select>
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="contact" label="연락방법" required />
          <Input id="contact" name="contact" placeholder="예: 이메일, 카카오 오픈채팅 링크, 전화번호 중 선택" />
          <p className="mt-1 text-sm font-medium leading-5 text-muted">연락처 공개 여부는 직접 선택하세요. 주민등록번호, 계좌번호, 신분증 정보는 입력하지 마세요.</p>
        </div>

        <div>
          <FieldLabel htmlFor="need" label="배우고 싶은 내용" required />
          <Textarea id="need" name="need" rows={5} placeholder="예: 타일 보조 처음 갈 때 어떤 공구를 챙겨야 하는지 알고 싶어요." />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <SkillActionButton message="수강 대기 신청은 준비 중입니다. 정식 오픈 전에는 운영자가 수동으로 안내합니다.">
            수강 대기 신청
          </SkillActionButton>
          <ButtonLink href="/skills" size="lg" fullWidth>
            강의 목록으로
          </ButtonLink>
        </div>
      </form>

      <NoticeBox tone="warning" title="안전/책임 안내">
        <p>이 콘텐츠는 현장 입문 참고용입니다. 실제 작업은 현장 상황과 숙련도에 따라 달라질 수 있으며, 안전수칙과 현장 책임자의 지시를 우선해야 합니다.</p>
      </NoticeBox>
    </div>
  );
}
