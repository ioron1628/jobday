import { SkillActionButton } from "@/components/skill-action-button";
import { Badge, ButtonLink, FieldLabel, IconFrame, Input, NoticeBox, Select, Textarea } from "@/components/design-system";

export default function SkillInstructorPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      <section className="border border-line-strong bg-white p-3">
        <div className="flex gap-3">
          <IconFrame icon="helmet" tone="dark" size="lg" />
          <div className="min-w-0 flex-1">
            <Badge tone="warning" icon="star">강사 지원 안내</Badge>
            <h1 className="mt-2 text-2xl font-bold leading-[1.25] text-ink">현장 노하우를 알려줄 기공을 찾습니다</h1>
            <p className="mt-2 text-base font-medium leading-7 text-muted">
              JOBDAY 강의는 초보 입문자가 현장 기본기를 이해하도록 돕는 보조 메뉴입니다. 강의 주제는 운영자가 수동으로 검토합니다.
            </p>
          </div>
        </div>
      </section>

      <form className="space-y-3 border border-line bg-white p-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="name" label="이름/닉네임" required />
            <Input id="name" name="name" placeholder="예: 울산목수준" />
          </div>
          <div>
            <FieldLabel htmlFor="trade" label="직종" required />
            <Select id="trade" name="trade">
              <option value="">직종을 선택하세요</option>
              <option value="타일">타일</option>
              <option value="목공">목공</option>
              <option value="전기">전기</option>
              <option value="설비">설비</option>
              <option value="도배">도배</option>
              <option value="철거">철거</option>
              <option value="기타">기타</option>
            </Select>
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="career" label="경력" required />
          <Input id="career" name="career" placeholder="예: 타일 현장 8년, 아파트 욕실/상가 바닥 위주" />
        </div>

        <div>
          <FieldLabel htmlFor="topics" label="가능한 강의 주제" required />
          <Textarea id="topics" name="topics" rows={4} placeholder="예: 타일 보조 첫날 흐름, 줄눈 전 준비, 공구 정리 방법" />
        </div>

        <div>
          <FieldLabel htmlFor="contact" label="연락방법" required />
          <Input id="contact" name="contact" placeholder="예: 이메일, 카카오 오픈채팅 링크, 전화번호 중 선택" />
          <p className="mt-1 text-sm font-medium leading-5 text-muted">연락처 공개 여부는 직접 선택하세요. 주민등록번호, 신분증, 계좌번호는 입력하지 마세요.</p>
        </div>

        <div>
          <FieldLabel htmlFor="portfolio" label="포트폴리오/작업 사진 URL" />
          <Input id="portfolio" name="portfolio" placeholder="예: 작업 사진을 올린 링크" />
        </div>

        <div>
          <FieldLabel htmlFor="proposal" label="제안 내용" required />
          <Textarea id="proposal" name="proposal" rows={6} placeholder="어떤 초보자에게 어떤 내용을 알려줄 수 있는지 적어주세요." />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <SkillActionButton message="강사 제안 접수 기능은 준비 중입니다. 정식 오픈 전에는 운영자가 수동으로 확인합니다.">
            강사 제안 보내기
          </SkillActionButton>
          <ButtonLink href="/skills" size="lg" fullWidth>
            강의 목록으로
          </ButtonLink>
        </div>
      </form>

      <NoticeBox tone="warning" title="표현 기준">
        <p>자격 취득, 일자리 결과, 숙련 결과를 약속하는 표현은 사용하지 않습니다.</p>
        <p>강의는 현장 입문 참고용이며 실제 작업은 안전수칙과 현장 책임자의 지시를 우선해야 합니다.</p>
      </NoticeBox>
    </div>
  );
}
