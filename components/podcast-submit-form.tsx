"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Badge, Button, FieldLabel, Input, NoticeBox, Select, Textarea } from "@/components/design-system";

const draftKey = "jobday-podcast-submission-draft";

type FormState = {
  category: string;
  title: string;
  nickname: string;
  role: string;
  story: string;
  keyPoints: string;
  contact: string;
  audioPlan: string;
  source: string;
  rightsConfirmed: boolean;
  privacyConfirmed: boolean;
  noGuaranteeConfirmed: boolean;
};

const initialForm: FormState = {
  category: "현장 이야기",
  title: "",
  nickname: "",
  role: "",
  story: "",
  keyPoints: "",
  contact: "",
  audioPlan: "대본/사연만 제안",
  source: "",
  rightsConfirmed: false,
  privacyConfirmed: false,
  noGuaranteeConfirmed: false
};

function toSubmissionText(form: FormState) {
  return [
    "[JOBDAY 방송 제안]",
    `분류: ${form.category}`,
    `제목: ${form.title}`,
    `닉네임: ${form.nickname}`,
    `직종/역할: ${form.role || "미입력"}`,
    `참여 방식: ${form.audioPlan}`,
    `연락방법: ${form.contact}`,
    "",
    "사연/대본 초안:",
    form.story,
    "",
    "핵심 포인트:",
    form.keyPoints || "미입력",
    "",
    "참고 출처/링크:",
    form.source || "없음",
    "",
    "확인:",
    "- 개인정보와 실명 저격 내용을 넣지 않았습니다.",
    "- 직접 작성했거나 사용할 권리가 있는 내용만 보냅니다.",
    "- 임금, 취업, 안전, 거래 결과를 보장하는 표현을 넣지 않았습니다."
  ].join("\n");
}

function requiredMissing(form: FormState) {
  const missing: string[] = [];
  if (!form.title.trim()) missing.push("제목");
  if (!form.nickname.trim()) missing.push("닉네임");
  if (!form.story.trim()) missing.push("사연/대본 초안");
  if (!form.contact.trim()) missing.push("연락방법");
  if (!form.rightsConfirmed) missing.push("저작권 확인");
  if (!form.privacyConfirmed) missing.push("개인정보 확인");
  if (!form.noGuaranteeConfirmed) missing.push("보장 표현 확인");
  return missing;
}

export function PodcastSubmitForm({ initialTopic }: { initialTopic?: string }) {
  const [form, setForm] = useState<FormState>({ ...initialForm, title: initialTopic ? `${initialTopic} 관련 제안` : "" });
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(draftKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Partial<FormState>;
      setForm((current) => ({ ...current, ...parsed, title: current.title || parsed.title || "" }));
      setMessage("이전에 작성하던 제안서를 불러왔습니다.");
    } catch {
      window.localStorage.removeItem(draftKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(draftKey, JSON.stringify(form));
  }, [form]);

  const submissionText = useMemo(() => toSubmissionText(form), [form]);
  const missing = requiredMissing(form);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setCopied(false);
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function copySubmission() {
    if (missing.length) {
      setMessage(`먼저 ${missing.join(", ")} 항목을 확인해주세요.`);
      return;
    }
    try {
      await navigator.clipboard.writeText(submissionText);
      setCopied(true);
      setMessage("검토 요청 문구를 복사했습니다. 운영자에게 그대로 보내면 됩니다.");
    } catch {
      setMessage("복사에 실패했습니다. 아래 미리보기 내용을 직접 선택해서 복사해주세요.");
    }
  }

  async function shareSubmission() {
    if (missing.length) {
      setMessage(`먼저 ${missing.join(", ")} 항목을 확인해주세요.`);
      return;
    }
    if (!navigator.share) {
      setMessage("이 기기에서는 공유 기능을 지원하지 않습니다. 복사 버튼을 사용해주세요.");
      return;
    }
    try {
      await navigator.share({ title: "JOBDAY 방송 제안", text: submissionText });
      setMessage("공유 창을 열었습니다. 운영자에게 보내기 전 내용이 맞는지 확인해주세요.");
    } catch {
      setMessage("공유를 취소했거나 열 수 없습니다.");
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void copySubmission();
  }

  function clearDraft() {
    window.localStorage.removeItem(draftKey);
    setForm({ ...initialForm, title: initialTopic ? `${initialTopic} 관련 제안` : "" });
    setCopied(false);
    setMessage("작성 내용을 비웠습니다.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <NoticeBox tone="muted" title="공개 전 운영자 검토">
        <p>이 페이지는 방송 제안을 쉽게 정리하는 도구입니다. 지금 단계에서는 바로 공개되지 않고, 운영자가 내용을 확인한 뒤 방송으로 만들지 결정합니다.</p>
        <p>전화번호, 계좌번호, 정확한 주소, 실명 저격, 저작권이 불확실한 음악이나 글은 넣지 마세요.</p>
      </NoticeBox>

      <section className="border border-line-strong bg-white p-4">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone="warning">검토 요청</Badge>
          <Badge tone="muted">자동 공개 아님</Badge>
          <Badge tone="muted">무료 참여</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="podcast-category" label="방송 분류" required />
            <Select id="podcast-category" value={form.category} onChange={(event) => update("category", event.target.value)}>
              <option>현장 이야기</option>
              <option>구인 체크</option>
              <option>원정 체크</option>
              <option>초보입문</option>
              <option>공구/자재</option>
              <option>일하는 사람의 하루</option>
            </Select>
          </div>
          <div>
            <FieldLabel htmlFor="podcast-audio-plan" label="참여 방식" required />
            <Select id="podcast-audio-plan" value={form.audioPlan} onChange={(event) => update("audioPlan", event.target.value)}>
              <option>대본/사연만 제안</option>
              <option>직접 녹음 가능</option>
              <option>운영자 편집 방송 희망</option>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="podcast-title" label="제목" required />
            <Input id="podcast-title" value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="예: 첫 원정작업 가기 전 확인할 것" />
          </div>
          <div>
            <FieldLabel htmlFor="podcast-nickname" label="공개 닉네임" required />
            <Input id="podcast-nickname" value={form.nickname} onChange={(event) => update("nickname", event.target.value)} placeholder="예: 부산목공초보" />
          </div>
          <div>
            <FieldLabel htmlFor="podcast-role" label="직종/역할" />
            <Input id="podcast-role" value={form.role} onChange={(event) => update("role", event.target.value)} placeholder="예: 타일 보조, 물류, 외근직, 반장" />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="podcast-story" label="사연/대본 초안" required />
            <Textarea
              id="podcast-story"
              rows={8}
              value={form.story}
              onChange={(event) => update("story", event.target.value)}
              placeholder="어떤 상황이었는지, 사람들이 무엇을 알면 좋을지 편하게 적어주세요."
            />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="podcast-points" label="꼭 들어갔으면 하는 포인트" />
            <Textarea id="podcast-points" rows={4} value={form.keyPoints} onChange={(event) => update("keyPoints", event.target.value)} placeholder="예: 숙소, 교통비, 준비물, 연락할 때 물어볼 말" />
          </div>
          <div>
            <FieldLabel htmlFor="podcast-contact" label="연락방법" required />
            <Input id="podcast-contact" value={form.contact} onChange={(event) => update("contact", event.target.value)} placeholder="예: 이메일 또는 카카오 오픈채팅 링크" />
          </div>
          <div>
            <FieldLabel htmlFor="podcast-source" label="참고 출처/링크" />
            <Input id="podcast-source" value={form.source} onChange={(event) => update("source", event.target.value)} placeholder="있으면 링크나 출처를 적어주세요." />
          </div>
        </div>
      </section>

      <section className="space-y-2 border border-line-strong bg-white p-4">
        <h2 className="text-lg font-black text-ink">공개 전 확인</h2>
        {[
          ["rightsConfirmed", "직접 작성했거나 사용할 권리가 있는 내용만 보냅니다."],
          ["privacyConfirmed", "전화번호, 계좌번호, 정확한 주소, 실명 저격을 넣지 않았습니다."],
          ["noGuaranteeConfirmed", "취업, 임금, 안전, 거래 결과를 보장하는 표현을 넣지 않았습니다."]
        ].map(([key, label]) => (
          <label key={key} className="flex items-start gap-2 border border-line bg-soft p-3 text-sm font-bold leading-6 text-ink">
            <input
              type="checkbox"
              checked={form[key as keyof FormState] as boolean}
              onChange={(event) => update(key as keyof FormState, event.target.checked as never)}
              className="mt-1 h-4 w-4"
            />
            <span>{label}</span>
          </label>
        ))}
      </section>

      {message ? (
        <NoticeBox tone={copied ? "success" : "warning"}>
          <p>{message}</p>
        </NoticeBox>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <Button type="submit" variant="primary" size="lg">검토 요청 문구 복사</Button>
        <Button type="button" size="lg" onClick={shareSubmission}>공유하기</Button>
        <Button type="button" variant="quiet" size="lg" onClick={clearDraft}>비우기</Button>
      </div>

      <section className="border border-line bg-soft p-4">
        <h2 className="text-base font-black text-ink">미리보기</h2>
        <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap border border-line bg-white p-3 text-sm font-medium leading-6 text-ink">{submissionText}</pre>
      </section>
    </form>
  );
}
