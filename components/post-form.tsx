"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { BlockedUserNotice, LoginRequiredNotice, PermissionDeniedNotice } from "@/components/account-notices";
import {
  COMMON_FORM_HINT,
  GUARDRAIL_NOTICE,
  MARKET_BOARD_SLUGS,
  MARKET_NOTICE,
  SPECIAL_FIELDS_BY_BOARD,
  WORK_BOARD_SLUGS
} from "@/lib/constants";
import { isAdminProfile } from "@/lib/admin";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { formatDate } from "@/lib/format";
import { LOGIN_REQUIRED_MESSAGE, SAVE_FAILED_MESSAGE, SUPABASE_SETUP_REQUIRED_MESSAGE } from "@/lib/user-messages";
import type { Board, FieldDef, JsonValue, Post, Profile, Region, Trade } from "@/types/domain";
import { Button, ButtonLink, ErrorMessage, FieldLabel, Input, MobileStickyAction, NoticeBox, RequiredBadge, Select, Textarea } from "./design-system";

type Props = {
  boards: Board[];
  regions: Region[];
  trades: Trade[];
  initialBoardSlug?: string;
  initialPost?: Post;
};

function textValue(value: unknown) {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "on" : "";
  return String(value);
}

function numericValue(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? null : parsed;
}

type DraftValue = string | boolean;

type PostDraft = {
  boardSlug: string;
  updatedAt: string;
  values: Record<string, DraftValue>;
};

const DRAFT_STORAGE_PREFIX = "jobday:post-draft:";

function draftStorageKey(boardSlug: string) {
  return `${DRAFT_STORAGE_PREFIX}${boardSlug || "default"}`;
}

function readDraft(boardSlug: string): PostDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(draftStorageKey(boardSlug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PostDraft;
    if (!parsed?.values || parsed.boardSlug !== boardSlug) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeDraft(boardSlug: string, values: Record<string, DraftValue>) {
  if (typeof window === "undefined" || !boardSlug) return "";
  const updatedAt = new Date().toISOString();
  window.localStorage.setItem(draftStorageKey(boardSlug), JSON.stringify({ boardSlug, updatedAt, values }));
  return updatedAt;
}

function removeDraft(boardSlug: string) {
  if (typeof window === "undefined" || !boardSlug) return;
  window.localStorage.removeItem(draftStorageKey(boardSlug));
}

function collectDraftValues(form: HTMLFormElement) {
  const values: Record<string, DraftValue> = {};

  Array.from(form.elements).forEach((element) => {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) return;
    if (!element.name || element.type === "file" || element.type === "submit" || element.type === "button") return;
    values[element.name] = element instanceof HTMLInputElement && element.type === "checkbox" ? element.checked : element.value;
  });

  return values;
}

const REQUIRED_FIELDS_BY_BOARD: Record<string, string[]> = {
  "work-raid": ["site_region", "work_date", "trade", "needed_count", "daily_pay", "contact_method"],
  "remote-raid": ["site_region", "work_date", "trade", "needed_count", "daily_pay", "contact_method"],
  dimodo: ["site_region", "work_date", "trade", "needed_count", "daily_pay", "contact_method"],
  "available-today": ["available_region", "available_date", "available_trade", "desired_pay", "contact_method"],
  "tool-market": ["tool_name", "transaction_type", "price", "market_region", "contact_method"],
  materials: ["material_name", "quantity", "price", "market_region", "contact_method"]
};

const SUBMIT_LABEL_BY_BOARD: Record<string, string> = {
  "work-raid": "작업 구인글 올리기",
  "remote-raid": "원정 구인글 올리기",
  dimodo: "보조 구인글 올리기",
  "available-today": "일당 가능글 올리기",
  "tool-market": "공구글 올리기",
  materials: "자재글 올리기"
};

const FIELD_ORDER_BY_BOARD: Record<string, string[]> = {
  "work-raid": [
    "site_region",
    "work_date",
    "trade",
    "needed_count",
    "daily_pay",
    "contact_method",
    "departure_region",
    "work_period",
    "meal_provided",
    "lodging_provided",
    "transportation_provided",
    "ride_share_available",
    "transport",
    "beginner_ok",
    "required_tools",
    "pay_method",
    "work_hours",
    "recruiting_status"
  ],
  "remote-raid": [
    "site_region",
    "work_date",
    "trade",
    "needed_count",
    "daily_pay",
    "contact_method",
    "departure_region",
    "work_period",
    "meal_provided",
    "lodging_provided",
    "transportation_provided",
    "ride_share_available",
    "transport",
    "beginner_ok",
    "required_tools",
    "pay_method",
    "work_hours",
    "recruiting_status"
  ],
  dimodo: ["site_region", "work_date", "trade", "needed_count", "daily_pay", "contact_method", "work_hours", "beginner_ok"],
  "available-today": ["available_region", "available_date", "available_trade", "desired_pay", "contact_method", "experience", "owned_tools", "has_vehicle", "can_travel"],
  "tool-market": ["transaction_type", "tool_name", "price", "market_region", "condition", "contact_method"],
  materials: ["material_name", "quantity", "price", "market_region", "direct_trade", "contact_method"]
};

const TITLE_PLACEHOLDER_BY_BOARD: Record<string, string> = {
  "work-raid": "예: 평택 타일 현장 보조 2명 구함",
  "remote-raid": "예: 부산 출발 경기 타일 원정 2명 구함",
  dimodo: "예: 인천 송도 현장 보조 2명 구함",
  "available-today": "예: 오늘 경기 남부 전기 조공 가능합니다",
  "tool-market": "예: 밀워키 임팩 판매합니다",
  materials: "예: 석고보드 12장 무료나눔",
  free: "예: 오늘 현장 어땠나요?"
};

const BODY_PLACEHOLDER_BY_BOARD: Record<string, string> = {
  "work-raid": "작업 내용, 모이는 장소, 준비물, 확인해야 할 조건을 짧게 적어주세요.",
  "remote-raid": "숙소, 교통비, 차량동승, 작업기간처럼 원정에 필요한 정보를 적어주세요.",
  dimodo: "어떤 일을 보조하면 되는지, 작업시간과 준비물을 적어주세요.",
  "available-today": "가능 시간, 경력, 보유 공구, 연락 가능한 시간을 적어주세요.",
  "tool-market": "사용 기간, 상태, 구성품, 거래 가능한 시간을 적어주세요.",
  materials: "자재 상태, 보관 위치, 상차 가능 여부, 거래 가능한 시간을 적어주세요."
};

function isRequiredExtraField(boardSlug: string, fieldName: string) {
  return REQUIRED_FIELDS_BY_BOARD[boardSlug]?.includes(fieldName) ?? false;
}

function fieldOrder(boardSlug: string, fieldName: string, fallbackIndex: number) {
  const order = FIELD_ORDER_BY_BOARD[boardSlug] ?? [];
  const index = order.indexOf(fieldName);
  return index === -1 ? order.length + fallbackIndex : index;
}

function fieldMessage(label: string) {
  return `${label}을(를) 입력해주세요.`;
}

function fieldIdFromKey(key: string) {
  if (key.startsWith("extra:")) return `extra-${key.replace("extra:", "")}`;
  return key;
}

function FieldHelp({ children }: { children: string }) {
  return <p className="mt-1 text-[13px] font-medium leading-5 text-muted">{children}</p>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 border-l-4 border-red-500 bg-red-50 px-2 py-1 text-sm font-semibold leading-5 text-red-700">{message}</p>;
}

function SuccessActions({ postId, boardSlug }: { postId: string; boardSlug: string }) {
  return (
    <section className="border border-green-300 bg-green-50 p-3">
      <h2 className="text-base font-bold text-green-900">저장됐습니다. 다음으로 할 일을 선택하세요.</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <ButtonLink href={`/posts/${postId}`} variant="primary" size="lg" fullWidth>
          작성한 글 보기
        </ButtonLink>
        <ButtonLink href={`/boards/${boardSlug}`} size="lg" fullWidth>
          게시판으로 이동
        </ButtonLink>
        <ButtonLink href={`/boards/${boardSlug}/new`} size="lg" fullWidth>
          새 글 더 쓰기
        </ButtonLink>
      </div>
    </section>
  );
}

function renderField(field: FieldDef, initial: JsonValue | undefined, required: boolean, error?: string) {
  const id = `extra-${field.name}`;
  if (field.type === "textarea") {
    return (
      <>
        <Textarea
          className="min-h-24"
          id={id}
          name={`extra:${field.name}`}
          placeholder={field.placeholder}
          required={required}
          aria-required={required}
          aria-invalid={Boolean(error)}
          defaultValue={textValue(initial)}
        />
        <FieldError message={error} />
      </>
    );
  }

  if (field.type === "select") {
    return (
      <>
        <Select id={id} name={`extra:${field.name}`} required={required} aria-required={required} aria-invalid={Boolean(error)} defaultValue={textValue(initial)}>
          <option value="">선택</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <FieldError message={error} />
      </>
    );
  }

  if (field.type === "checkbox") {
    return (
      <>
        <label className="flex min-h-14 items-center gap-3 rounded-sm border border-line-strong bg-white px-3 text-base font-semibold text-ink">
          <input className="h-5 w-5 accent-amber-700" id={id} name={`extra:${field.name}`} type="checkbox" aria-invalid={Boolean(error)} defaultChecked={Boolean(initial)} />
          <span className="flex-1">{field.label}</span>
          {required ? <RequiredBadge required /> : null}
        </label>
        <FieldError message={error} />
      </>
    );
  }

  return (
    <>
      <Input
        id={id}
        name={`extra:${field.name}`}
        type={field.type}
        min={field.type === "number" ? 0 : undefined}
        inputMode={field.type === "number" ? "numeric" : undefined}
        placeholder={field.placeholder}
        required={required}
        aria-required={required}
        aria-invalid={Boolean(error)}
        defaultValue={textValue(initial)}
      />
      <FieldError message={error} />
    </>
  );
}

function formSectionTitle(boardSlug: string) {
  if (MARKET_BOARD_SLUGS.includes(boardSlug)) return "거래 정보";
  if (WORK_BOARD_SLUGS.includes(boardSlug)) return "작업 정보";
  return "게시글 정보";
}

function submitLabel(boardSlug: string, isEdit: boolean, loading: boolean, savingStage = "") {
  if (loading) return savingStage || (isEdit ? "수정 중..." : "올리는 중...");
  if (isEdit) return "수정 저장";
  return SUBMIT_LABEL_BY_BOARD[boardSlug] ?? "글 올리기";
}

function boardGuide(boardSlug: string) {
  if (boardSlug === "tool-market") return "거래유형, 공구명, 가격, 지역, 연락방법만 먼저 채우면 빠르게 올릴 수 있습니다.";
  if (boardSlug === "materials") return "자재명, 수량, 가격, 지역, 연락방법을 먼저 적어주세요. 무료나눔은 가격에 0을 입력합니다.";
  if (boardSlug === "available-today") return "가능지역, 가능날짜, 가능직종, 희망일당, 연락방법을 먼저 적어주세요.";
  if (WORK_BOARD_SLUGS.includes(boardSlug)) return "현장지역, 날짜, 직종, 인원, 일당, 연락방법을 먼저 적으면 목록에서 바로 읽힙니다.";
  return "지역, 직종, 연락방법을 적으면 글을 찾기 쉬워집니다.";
}

function bodyLabel(boardSlug: string) {
  if (WORK_BOARD_SLUGS.includes(boardSlug)) return "상세설명";
  return MARKET_BOARD_SLUGS.includes(boardSlug) ? "설명" : "본문";
}

function bodyPlaceholder(boardSlug: string) {
  return BODY_PLACEHOLDER_BY_BOARD[boardSlug] ?? "상황, 조건, 궁금한 점을 구체적으로 적어주세요.";
}

function titlePlaceholder(boardSlug: string) {
  return TITLE_PLACEHOLDER_BY_BOARD[boardSlug] ?? "예: 지역과 직종이 보이게 제목을 적어주세요.";
}

function FormNotice({ boardSlug }: { boardSlug: string }) {
  const isWork = WORK_BOARD_SLUGS.includes(boardSlug);
  const isMarket = MARKET_BOARD_SLUGS.includes(boardSlug);

  return (
    <NoticeBox collapsible tone="warning" title="조건 확인 안내">
      <p>{COMMON_FORM_HINT}</p>
      {isWork ? <p>{GUARDRAIL_NOTICE}</p> : null}
      {isMarket ? <p>{MARKET_NOTICE}</p> : null}
    </NoticeBox>
  );
}

function ChecklistItems({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-medium leading-6">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function WritingGuides({ boardSlug }: { boardSlug: string }) {
  const isRemote = boardSlug === "remote-raid";
  const isWork = WORK_BOARD_SLUGS.includes(boardSlug);
  const isBeginner = boardSlug === "beginner";
  const isToolMarket = boardSlug === "tool-market";
  const isMaterials = boardSlug === "materials";

  return (
    <section className="space-y-2">
      {isWork && !isRemote ? (
        <NoticeBox collapsible tone="muted" title="작업 구인글 체크리스트">
          <ChecklistItems
            items={[
              "현장지역, 작업날짜, 직종, 필요인원, 일당을 빠짐없이 적었는지 확인하세요.",
              "작업시간, 식사, 숙소, 교통비, 초보가능 여부를 알 수 있으면 같이 적어주세요.",
              "필요공구와 집합 장소는 본문에 짧게라도 적어두면 연락이 빨라집니다."
            ]}
          />
        </NoticeBox>
      ) : null}

      {isRemote ? (
        <NoticeBox collapsible tone="muted" title="원정작업 체크리스트">
          <ChecklistItems
            items={[
              "출발지역과 현장지역을 둘 다 적어주세요.",
              "숙소제공, 교통비, 차량동승, 작업기간은 원정 판단에 가장 중요합니다.",
              "식사와 귀가 일정은 작성자가 아는 범위에서만 적고, 최종 조건은 서로 직접 확인하게 안내하세요."
            ]}
          />
        </NoticeBox>
      ) : null}

      {isBeginner ? (
        <NoticeBox collapsible tone="muted" title="초보 현장 준비물 안내">
          <ChecklistItems
            items={[
              "안전화, 장갑, 작업복, 물, 보조배터리는 기본 준비물로 자주 언급됩니다.",
              "현장마다 필요한 공구가 다르니 글에는 작업 종류와 준비물을 구체적으로 물어보세요.",
              "신분증, 계좌번호, 주민번호가 보이는 사진은 올리지 마세요."
            ]}
          />
        </NoticeBox>
      ) : null}

      {isToolMarket ? (
        <NoticeBox collapsible tone="muted" title="공구거래 주의사항">
          <ChecklistItems
            items={[
              "공구명, 구성품, 사용감, 고장 여부, 거래지역을 구체적으로 적어주세요.",
              "가격이 0원이면 무료나눔으로 보일 수 있습니다.",
              "JOBDAY는 결제를 대신하지 않으니 거래 전 상태와 연락방법을 직접 확인해야 합니다."
            ]}
          />
        </NoticeBox>
      ) : null}

      {isMaterials ? (
        <NoticeBox collapsible tone="muted" title="자재거래 주의사항">
          <ChecklistItems
            items={[
              "자재명, 수량, 보관지역, 상차 가능 여부, 직거래 여부를 적어주세요.",
              "남은 자재는 상태와 규격이 중요하니 사진이나 설명을 함께 남기면 좋습니다.",
              "JOBDAY는 거래 당사자가 아니며, 수량과 가격은 이용자끼리 직접 확인해야 합니다."
            ]}
          />
        </NoticeBox>
      ) : null}

      <NoticeBox collapsible tone="warning" title="연락방법 공개 주의">
        <ChecklistItems
          items={[
            "전화번호를 공개할지, 댓글 후 연락할지, 오픈채팅을 쓸지는 작성자가 직접 선택하세요.",
            "주민번호, 계좌번호, 신분증 사진 같은 민감정보는 글과 이미지에 올리지 마세요.",
            "연락 전 임금, 작업조건, 안전사항, 거래조건은 당사자끼리 직접 확인해야 합니다."
          ]}
        />
      </NoticeBox>
    </section>
  );
}

export function PostForm({ boards, regions, trades, initialBoardSlug, initialPost }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const defaultBoardSlug = initialPost?.board?.slug ?? initialBoardSlug ?? boards[0]?.slug ?? "";
  const [boardSlug, setBoardSlug] = useState(defaultBoardSlug);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"danger" | "success" | "warning" | "muted">("danger");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [savingStage, setSavingStage] = useState("");
  const [savedPostId, setSavedPostId] = useState("");
  const [savedBoardSlug, setSavedBoardSlug] = useState("");
  const [draftAvailable, setDraftAvailable] = useState(false);
  const [draftUpdatedAt, setDraftUpdatedAt] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [accessState, setAccessState] = useState<"checking" | "ready" | "login-required" | "forbidden" | "blocked">("checking");
  const fields = useMemo(() => {
    const boardFields = SPECIAL_FIELDS_BY_BOARD[boardSlug] ?? [];
    return [...boardFields].sort((left, right) => fieldOrder(boardSlug, left.name, boardFields.indexOf(left)) - fieldOrder(boardSlug, right.name, boardFields.indexOf(right)));
  }, [boardSlug]);
  const isEdit = Boolean(initialPost);
  const hasSpecialFields = fields.length > 0;
  const sectionTitle = formSectionTitle(boardSlug);
  const commonFieldsRequired = !hasSpecialFields;
  const currentBodyLabel = bodyLabel(boardSlug);
  const isMarketForm = MARKET_BOARD_SLUGS.includes(boardSlug);
  const showDraftStatus = !isEdit && (draftAvailable || Boolean(draftMessage) || Boolean(draftUpdatedAt));

  useEffect(() => {
    async function checkAccess() {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setAccessState("ready");
        return;
      }

      setAccessState("checking");
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setAccessState(initialPost ? "login-required" : "ready");
        return;
      }

      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      const profile = data as Profile | null;

      if (profile?.status === "suspended" || profile?.status === "deleted") {
        setAccessState("blocked");
        return;
      }

      if (initialPost && user.id !== initialPost.author_id && !isAdminProfile(profile)) {
        setAccessState("forbidden");
        return;
      }

      setAccessState("ready");
    }

    void checkAccess();
  }, [initialPost]);

  useEffect(() => {
    if (isEdit) return;
    const draft = readDraft(boardSlug);
    setDraftAvailable(Boolean(draft));
    setDraftUpdatedAt(draft?.updatedAt ?? "");
    setDraftMessage("");
  }, [boardSlug, isEdit]);

  function clearFieldError(key: string) {
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function onFormChange(event: ChangeEvent<HTMLFormElement>) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
    if (target.name) clearFieldError(target.name);
    saveDraftFromForm(event.currentTarget);
  }

  function saveDraftFromForm(form: HTMLFormElement) {
    if (isEdit) return;
    const values = collectDraftValues(form);
    const selectedBoardSlug = String(values.board_slug || boardSlug);
    const updatedAt = writeDraft(selectedBoardSlug, values);
    if (!updatedAt || selectedBoardSlug !== boardSlug) return;
    setDraftAvailable(false);
    setDraftUpdatedAt(updatedAt);
    setDraftMessage("임시저장됨");
  }

  function applyDraft() {
    const draft = readDraft(boardSlug);
    const form = formRef.current;
    if (!draft || !form) return;

    Object.entries(draft.values).forEach(([name, value]) => {
      const element = form.elements.namedItem(name);
      if (!element) return;
      if (element instanceof HTMLInputElement && element.type === "checkbox") {
        element.checked = value === true || value === "true" || value === "on";
        return;
      }
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
        element.value = typeof value === "boolean" ? (value ? "on" : "") : value;
      }
    });

    setDraftAvailable(false);
    setDraftUpdatedAt(draft.updatedAt);
    setDraftMessage("임시저장한 글을 불러왔습니다.");
  }

  function discardDraft() {
    removeDraft(boardSlug);
    setDraftAvailable(false);
    setDraftUpdatedAt("");
    setDraftMessage("임시저장한 글을 버렸습니다.");
  }

  function focusFirstError(errors: Record<string, string>) {
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;
    window.requestAnimationFrame(() => {
      document.getElementById(fieldIdFromKey(firstKey))?.focus();
    });
  }

  function validateForm(form: FormData, selectedBoard: Board | undefined) {
    const errors: Record<string, string> = {};

    if (!selectedBoard) errors.board_slug = "게시판을 선택해주세요.";
    if (!String(form.get("title") ?? "").trim()) errors.title = "제목을 입력해주세요.";

    fields.forEach((field) => {
      if (!isRequiredExtraField(boardSlug, field.name)) return;
      const key = `extra:${field.name}`;
      const value = form.get(key);
      const empty = field.type === "checkbox" ? value !== "on" : !String(value ?? "").trim();
      if (empty) errors[key] = fieldMessage(field.label);
    });

    if (!String(form.get("body") ?? "").trim()) errors.body = `${currentBodyLabel}을(를) 입력해주세요.`;

    if (!hasSpecialFields) {
      if (!String(form.get("region_text") ?? "").trim()) errors.region_text = "지역 태그를 입력해주세요.";
      if (!String(form.get("trade_text") ?? "").trim()) errors.trade_text = "직종 태그를 입력해주세요.";
      if (!String(form.get("contact_method") ?? "").trim()) errors.contact_method = "연락방법을 입력해주세요.";
    }

    return errors;
  }

  async function uploadImages(postId: string, files: File[]) {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return SUPABASE_SETUP_REQUIRED_MESSAGE;

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return LOGIN_REQUIRED_MESSAGE;

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      if (!file.size) continue;

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${user.id}/${postId}/${Date.now()}-${index}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("post-images").upload(path, file);
      if (uploadError) return "이미지 업로드에 실패했습니다.";

      const { error: imageError } = await supabase.from("post_images").insert({
        post_id: postId,
        storage_path: path,
        alt_text: file.name,
        sort_order: index
      });
      if (imageError) return "이미지 업로드에 실패했습니다.";
    }

    return "";
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    setLoading(true);
    setMessage("");
    setSavedPostId("");
    setSavedBoardSlug("");
    setFieldErrors({});
    setMessageTone("danger");
    setSavingStage(isEdit ? "글을 수정하는 중..." : "글을 저장하는 중...");

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setMessage(SUPABASE_SETUP_REQUIRED_MESSAGE);
      setLoading(false);
      setSavingStage("");
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage(LOGIN_REQUIRED_MESSAGE);
      setLoading(false);
      setSavingStage("");
      return;
    }

    const selectedBoard = boards.find((board) => board.slug === String(form.get("board_slug")));
    const validationErrors = validateForm(form, selectedBoard);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setMessage("필수 입력값을 확인해주세요. 빨간 안내가 있는 칸을 채우면 됩니다.");
      setLoading(false);
      setSavingStage("");
      focusFirstError(validationErrors);
      return;
    }

    if (!selectedBoard) {
      setMessage("게시판을 선택해 주세요.");
      setLoading(false);
      setSavingStage("");
      return;
    }

    const extra: Record<string, JsonValue> = {};
    fields.forEach((field) => {
      const key = `extra:${field.name}`;
      if (field.type === "checkbox") {
        extra[field.name] = form.get(key) === "on";
        return;
      }
      const raw = String(form.get(key) ?? "").trim();
      if (field.type === "number") {
        extra[field.name] = raw ? Number(raw) : null;
      } else {
        extra[field.name] = raw || null;
      }
    });

    const regionText =
      String(form.get("region_text") ?? "").trim() ||
      textValue(extra.site_region) ||
      textValue(extra.available_region) ||
      textValue(extra.market_region) ||
      null;
    const tradeText =
      String(form.get("trade_text") ?? "").trim() || textValue(extra.trade) || textValue(extra.available_trade) || null;
    const workDate = String(form.get("work_date") ?? "").trim() || textValue(extra.work_date) || textValue(extra.available_date) || null;
    const dailyPay =
      numericValue(form.get("daily_pay")) ??
      (typeof extra.daily_pay === "number" ? extra.daily_pay : null) ??
      (typeof extra.desired_pay === "number" ? extra.desired_pay : null) ??
      (typeof extra.price === "number" ? extra.price : null);
    const contactMethod =
      String(form.get("contact_method") ?? "").trim() || textValue(extra.contact_method) || null;

    const payload = {
      board_id: selectedBoard.id,
      author_id: user.id,
      title: String(form.get("title") ?? "").trim(),
      body: String(form.get("body") ?? "").trim(),
      status: String(form.get("status") ?? "recruiting"),
      region_text: regionText,
      trade_text: tradeText,
      work_date: workDate,
      daily_pay: dailyPay,
      contact_method: contactMethod,
      extra
    };

    if (!payload.title || !payload.body || (!hasSpecialFields && (!payload.region_text || !payload.trade_text || !payload.contact_method))) {
      setMessage("필수 입력값을 확인해주세요. 빨간 안내가 있는 칸을 채우면 됩니다.");
      setLoading(false);
      setSavingStage("");
      return;
    }

    const result = isEdit
      ? await supabase.from("posts").update(payload).eq("id", initialPost?.id).select("id").single()
      : await supabase.from("posts").insert(payload).select("id").single();

    if (result.error || !result.data) {
      setMessage(SAVE_FAILED_MESSAGE);
      setLoading(false);
      setSavingStage("");
      return;
    }

    const postId = result.data.id as string;
    removeDraft(selectedBoard.slug);
    setDraftAvailable(false);
    setDraftUpdatedAt("");
    setDraftMessage("");
    await supabase.from("post_region_tags").delete().eq("post_id", postId);
    await supabase.from("post_trade_tags").delete().eq("post_id", postId);

    const region = regions.find((item) => item.name === regionText || item.slug === regionText);
    if (region) {
      await supabase.from("post_region_tags").insert({ post_id: postId, region_id: region.id });
    }

    const trade = trades.find((item) => item.name === tradeText || item.slug === tradeText);
    if (trade) {
      await supabase.from("post_trade_tags").insert({ post_id: postId, trade_id: trade.id });
    }

    const files = form.getAll("images").filter((file): file is File => file instanceof File && file.size > 0);
    if (files.length) setSavingStage("이미지를 올리는 중...");
    const imageError = await uploadImages(postId, files);
    if (imageError) {
      setMessageTone("warning");
      setMessage(`글은 저장됐지만 ${imageError} 이미지는 나중에 다시 올려주세요.`);
      setSavedPostId(postId);
      setSavedBoardSlug(selectedBoard.slug);
      setLoading(false);
      setSavingStage("");
      return;
    }

    setMessageTone("success");
    setMessage("저장됐습니다.");
    setSavedPostId(postId);
    setSavedBoardSlug(selectedBoard.slug);
    setLoading(false);
    setSavingStage("");
    router.refresh();
  }

  if (accessState === "checking") {
    return <NoticeBox tone="muted">권한을 확인하는 중입니다.</NoticeBox>;
  }

  if (accessState === "blocked") {
    return (
      <BlockedUserNotice message="현재 계정은 이용이 제한되어 글쓰기와 수정이 막혀 있습니다." />
    );
  }

  if (accessState === "login-required") {
    return (
      <LoginRequiredNotice message="작성자 본인만 이 글을 수정할 수 있습니다. 로그인한 뒤 다시 열어주세요." />
    );
  }

  if (accessState === "forbidden") {
    return (
      <PermissionDeniedNotice title="수정 권한이 없습니다" message="작성자 본인 또는 관리자만 이 글을 수정할 수 있습니다." />
    );
  }

  const titleField = (
    <div>
      <FieldLabel htmlFor="title" label="제목" required />
      <Input
        id="title"
        name="title"
        required
        aria-invalid={Boolean(fieldErrors.title)}
        maxLength={120}
        placeholder={titlePlaceholder(boardSlug)}
        defaultValue={initialPost?.title ?? ""}
      />
      <FieldHelp>지역, 직종, 날짜, 인원처럼 목록에서 바로 보일 말을 넣으면 더 빨리 읽힙니다.</FieldHelp>
      <FieldError message={fieldErrors.title} />
    </div>
  );

  const specialFieldsSection = fields.length ? (
    <section className="border border-line-strong bg-white p-3">
      <h2 className="mb-1 text-lg font-bold leading-[1.35] text-ink">{sectionTitle}</h2>
      <p className="mb-3 border-b border-line pb-2 text-sm font-medium leading-6 text-muted">
        필수 항목만 먼저 채우면 목록에서 핵심 조건이 바로 보입니다.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => {
          const required = isRequiredExtraField(boardSlug, field.name);
          return (
            <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
              {field.type === "checkbox" ? null : <FieldLabel htmlFor={`extra-${field.name}`} label={field.label} required={required} />}
              {renderField(field, initialPost?.extra?.[field.name], required, fieldErrors[`extra:${field.name}`])}
            </div>
          );
        })}
      </div>
    </section>
  ) : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} onChange={onFormChange} noValidate aria-busy={loading} className="space-y-4 pb-56 sm:pb-0">
      <section className="space-y-4 border border-line-strong bg-white p-3">
        <NoticeBox tone="muted">
          <p>{boardGuide(boardSlug)}</p>
        </NoticeBox>

        <div hidden={!showDraftStatus} aria-live="polite">
          {!isEdit && draftAvailable ? (
            <NoticeBox tone="warning" title="임시저장된 글이 있습니다">
              <p>이 기기에만 저장된 작성 중 글입니다. 주민번호, 계좌번호, 신분증 사진 같은 민감정보는 적지 마세요.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" type="button" onClick={applyDraft}>
                  임시저장 불러오기
                </Button>
                <Button size="sm" variant="quiet" type="button" onClick={discardDraft}>
                  버리기
                </Button>
              </div>
            </NoticeBox>
          ) : !isEdit && (draftMessage || draftUpdatedAt) ? (
            <p className="border border-line bg-soft px-3 py-2 text-sm font-semibold leading-5 text-muted">
              {draftMessage || "임시저장됨"}
              {draftUpdatedAt ? ` · ${formatDate(draftUpdatedAt)}` : ""} · 이 기기에만 저장됩니다.
            </p>
          ) : null}
        </div>

        <div>
          <FieldLabel htmlFor="board_slug" label="게시판" required />
          <Select
            id="board_slug"
            name="board_slug"
            required
            aria-required
            aria-invalid={Boolean(fieldErrors.board_slug)}
            value={boardSlug}
            onChange={(event) => {
              setBoardSlug(event.target.value);
              setFieldErrors({});
              setMessage("");
              setSavedPostId("");
              setSavedBoardSlug("");
            }}
          >
            {boards.map((board) => (
              <option key={board.id} value={board.slug}>
                {board.name}
              </option>
            ))}
          </Select>
          <FieldError message={fieldErrors.board_slug} />
        </div>

        {!isMarketForm ? titleField : null}
      </section>

      {specialFieldsSection}

      {isMarketForm ? <section className="border border-line-strong bg-white p-3">{titleField}</section> : null}

      <WritingGuides boardSlug={boardSlug} />

      <section className="border border-line-strong bg-white p-3">
        {hasSpecialFields ? (
          <details>
            <summary className="cursor-pointer text-lg font-bold text-ink">글 목록에 보여줄 핵심 정보</summary>
            <p className="mt-2 text-sm font-medium leading-6 text-muted">비워두면 위 {sectionTitle}가 글 목록에 자동으로 사용됩니다.</p>
            <div className="mt-3 space-y-4">
              <CommonFields initialPost={initialPost} required={false} errors={fieldErrors} />
            </div>
          </details>
        ) : (
          <div className="space-y-4">
            <h2 className="border-b border-line pb-2 text-lg font-bold text-ink">게시글 정보</h2>
            <CommonFields initialPost={initialPost} required={commonFieldsRequired} errors={fieldErrors} />
          </div>
        )}
      </section>

      <section className="space-y-4 border border-line-strong bg-white p-3">
        <div>
          <FieldLabel htmlFor="body" label={currentBodyLabel} required />
          <Textarea
            className="min-h-44"
            id="body"
            name="body"
            required
            aria-invalid={Boolean(fieldErrors.body)}
            placeholder={bodyPlaceholder(boardSlug)}
            defaultValue={initialPost?.body ?? ""}
          />
          <FieldHelp>연락 전 확인해야 할 조건, 준비물, 거래 상태를 짧게라도 적어주세요.</FieldHelp>
          <FieldError message={fieldErrors.body} />
        </div>
        <div>
          <FieldLabel htmlFor="images" label="이미지 업로드" required={false} />
          <Input id="images" name="images" type="file" accept="image/*" multiple />
          <p className="mt-2 text-sm font-medium leading-6 text-muted">
            현장 위치가 드러나는 사진, 공구/자재 상태 사진을 올릴 수 있습니다. 개인정보나 신분증, 계좌번호가 보이는 사진은 올리지 마세요.
          </p>
        </div>
      </section>

      <FormNotice boardSlug={boardSlug} />

      {loading ? (
        <NoticeBox tone="muted">
          <p className="font-bold">{savingStage || "저장하는 중..."}</p>
          <p className="mt-1">화면을 닫지 말고 잠시만 기다려주세요.</p>
        </NoticeBox>
      ) : null}

      {message ? <ErrorMessage tone={messageTone}>{message}</ErrorMessage> : null}
      {savedPostId ? <SuccessActions postId={savedPostId} boardSlug={savedBoardSlug || boardSlug} /> : null}

      <MobileStickyAction>
        <Button className="mx-auto flex w-full max-w-6xl" variant="primary" size="lg" type="submit" disabled={loading}>
          {submitLabel(boardSlug, isEdit, loading, savingStage)}
        </Button>
      </MobileStickyAction>

      <datalist id="region-list">
        {regions.map((region) => (
          <option key={region.id} value={region.name} />
        ))}
      </datalist>
      <datalist id="trade-list">
        {trades.map((trade) => (
          <option key={trade.id} value={trade.name} />
        ))}
      </datalist>
    </form>
  );
}

function CommonFields({ initialPost, required, errors }: { initialPost?: Post; required: boolean; errors: Record<string, string> }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="region_text" label="지역 태그" required={required} />
          <Input
            id="region_text"
            name="region_text"
            list="region-list"
            required={required}
            aria-invalid={Boolean(errors.region_text)}
            placeholder="예: 경기 화성, 부산 사상"
            defaultValue={initialPost?.region_text ?? ""}
          />
          <FieldError message={errors.region_text} />
        </div>
        <div>
          <FieldLabel htmlFor="trade_text" label="직종 태그" required={required} />
          <Input
            id="trade_text"
            name="trade_text"
            list="trade-list"
            required={required}
            aria-invalid={Boolean(errors.trade_text)}
            placeholder="예: 타일, 전기, 철거"
            defaultValue={initialPost?.trade_text ?? ""}
          />
          <FieldError message={errors.trade_text} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <FieldLabel htmlFor="work_date" label="날짜" required={false} />
          <Input id="work_date" name="work_date" type="date" defaultValue={initialPost?.work_date ?? ""} />
        </div>
        <div>
          <FieldLabel htmlFor="daily_pay" label="일당/가격" required={false} />
          <Input id="daily_pay" name="daily_pay" type="number" defaultValue={initialPost?.daily_pay ?? ""} />
        </div>
        <div>
          <FieldLabel htmlFor="status" label="상태" required={false} />
          <Select id="status" name="status" defaultValue={initialPost?.status ?? "recruiting"}>
            <option value="recruiting">모집중/공개</option>
            <option value="closed">마감</option>
          </Select>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="contact_method" label="연락방법" required={required} />
        <Input
          className="border-accent bg-accent-soft text-base font-semibold"
          id="contact_method"
          name="contact_method"
          required={required}
          aria-invalid={Boolean(errors.contact_method)}
          placeholder="예: 댓글 후 문자, 전화번호, 오픈채팅"
          defaultValue={initialPost?.contact_method ?? ""}
        />
        <FieldHelp>전화번호를 공개할지, 댓글 후 연락할지 직접 선택해서 적어주세요.</FieldHelp>
        <FieldError message={errors.contact_method} />
      </div>
    </>
  );
}
