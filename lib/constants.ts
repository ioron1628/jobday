import type { FieldDef } from "@/types/domain";

export const SITE_NAME = "JOBDAY";

export const CORE_BOARD_SLUGS = [
  "free",
  "work-raid",
  "remote-raid",
  "dimodo",
  "available-today",
  "tool-market",
  "materials",
  "beginner",
  "questions",
  "company-jobs",
  "notices"
] as const;

export const WORK_BOARD_SLUGS = [
  "work-raid",
  "remote-raid",
  "dimodo",
  "available-today",
  "company-jobs"
];

export const MARKET_BOARD_SLUGS = ["tool-market", "materials"];

export const GUARDRAIL_NOTICE =
  "JOBDAY는 현장직 정보 공유 커뮤니티이며, 구인자와 구직자 간 계약의 당사자가 아닙니다. 임금, 근로조건, 안전사항, 출근 여부는 이용자 간 직접 확인해야 합니다. JOBDAY는 임금 지급, 출근 관리, 작업 지시를 대행하지 않습니다.";

export const MARKET_NOTICE =
  "JOBDAY는 공구 및 자재 거래의 당사자가 아니며, 거래는 이용자 간 직접 진행됩니다. 거래 전 상태, 수량, 가격, 지역, 연락방법을 직접 확인해야 합니다.";

export const SHORT_WORK_NOTICE =
  "JOBDAY는 정보 공유 커뮤니티입니다. 임금, 작업조건, 안전사항, 숙소, 교통비, 필요공구는 이용자끼리 직접 확인해야 합니다.";

export const SHORT_MARKET_NOTICE =
  "JOBDAY는 공구/자재 거래 당사자가 아닙니다. 거래 조건과 상태는 이용자끼리 직접 확인해야 합니다.";

export const AD_NOTICE =
  "광고 영역입니다. 광고 내용은 광고주가 제공한 정보이며 JOBDAY는 상품 또는 서비스 결과를 보장하지 않습니다.";

export const POST_STATUS_LABELS = {
  recruiting: "모집중/공개",
  closed: "마감",
  hidden: "숨김",
  deleted: "삭제됨"
};

export const REPORT_REASONS = [
  { key: "fake_job", value: "scam", label: "허위 구인글" },
  { key: "unclear_pay", value: "other", label: "임금/조건 불명확" },
  { key: "abuse", value: "abuse", label: "욕설/비방" },
  { key: "personal_info", value: "personal_info", label: "개인정보 노출" },
  { key: "scam", value: "scam", label: "사기 의심" },
  { key: "spam", value: "spam", label: "광고/도배" },
  { key: "trade_issue", value: "other", label: "거래 문제" },
  { key: "other", value: "other", label: "기타" }
] as const;

export const REPORT_REASON_LABELS: Record<string, string> = {
  spam: "광고/도배",
  scam: "사기 의심",
  abuse: "욕설/비방",
  personal_info: "개인정보 노출",
  illegal: "불법/위험 내용",
  other: "기타"
};

const raidFields: FieldDef[] = [
  { name: "departure_region", label: "출발지역", type: "text", placeholder: "예: 부산 사상, 울산 남구" },
  { name: "site_region", label: "현장지역", type: "text", placeholder: "예: 경기 평택" },
  { name: "work_date", label: "작업날짜", type: "date" },
  { name: "work_period", label: "작업기간", type: "text", placeholder: "예: 1일, 3일, 2주" },
  { name: "trade", label: "직종", type: "text", placeholder: "예: 타일, 전기 보조" },
  { name: "needed_count", label: "필요인원", type: "number", placeholder: "예: 2" },
  { name: "daily_pay", label: "일당", type: "number", placeholder: "예: 180000" },
  { name: "pay_method", label: "지급방식", type: "select", options: ["당일지급", "익일지급", "주급", "월말정산", "작성자와 확인"] },
  { name: "work_hours", label: "작업시간", type: "text", placeholder: "예: 08:00-17:00" },
  { name: "meal_provided", label: "식사제공 여부", type: "checkbox" },
  { name: "lodging_provided", label: "숙소제공 여부", type: "checkbox" },
  { name: "transportation_provided", label: "교통비 제공 여부", type: "checkbox" },
  { name: "ride_share_available", label: "차량동승 여부", type: "checkbox" },
  { name: "transport", label: "교통/차량 메모", type: "text", placeholder: "예: 교통비 별도, 울산 출발 동승 가능" },
  { name: "beginner_ok", label: "초보가능 여부", type: "checkbox" },
  { name: "required_tools", label: "필요공구", type: "text", placeholder: "예: 안전화, 개인공구" },
  { name: "contact_method", label: "연락방법", type: "text", placeholder: "예: 카카오 오픈채팅 링크 또는 전화번호" },
  { name: "recruiting_status", label: "모집상태", type: "select", options: ["모집중", "마감", "확인 필요"] }
];

export const SPECIAL_FIELDS_BY_BOARD: Record<string, FieldDef[]> = {
  "work-raid": raidFields,
  "remote-raid": raidFields,
  dimodo: [
    { name: "site_region", label: "현장지역", type: "text", placeholder: "예: 인천 송도" },
    { name: "work_date", label: "작업날짜", type: "date" },
    { name: "trade", label: "직종", type: "text", placeholder: "예: 보조, 조공" },
    { name: "needed_count", label: "필요인원", type: "number", placeholder: "예: 2" },
    { name: "daily_pay", label: "일당", type: "number", placeholder: "예: 150000" },
    { name: "beginner_ok", label: "초보가능 여부", type: "checkbox" },
    { name: "work_hours", label: "작업시간", type: "text", placeholder: "예: 08:00-17:00" },
    { name: "contact_method", label: "연락방법", type: "text", placeholder: "예: 카카오 오픈채팅 링크 또는 전화번호" }
  ],
  "available-today": [
    { name: "available_region", label: "가능지역", type: "text", placeholder: "예: 서울 남부, 경기 서부" },
    { name: "available_date", label: "가능날짜", type: "date" },
    { name: "available_trade", label: "가능직종", type: "text", placeholder: "예: 전기 조공, 철거" },
    { name: "experience", label: "경력", type: "text", placeholder: "예: 1년, 초보" },
    { name: "desired_pay", label: "희망일당", type: "number", placeholder: "예: 170000" },
    { name: "owned_tools", label: "보유공구", type: "text", placeholder: "예: 임팩, 공구벨트" },
    { name: "has_vehicle", label: "차량 여부", type: "checkbox" },
    { name: "can_travel", label: "원정가능 여부", type: "checkbox" },
    { name: "contact_method", label: "연락방법", type: "text", placeholder: "예: 댓글 확인, 오픈채팅 링크" }
  ],
  "tool-market": [
    { name: "tool_name", label: "공구명", type: "text", placeholder: "예: 밀워키 임팩" },
    { name: "transaction_type", label: "거래유형", type: "select", options: ["판매", "대여", "교환"] },
    { name: "price", label: "가격", type: "number", placeholder: "무료나눔은 0 입력" },
    { name: "condition", label: "상태", type: "text", placeholder: "예: 사용감 있음, 미개봉" },
    { name: "market_region", label: "지역", type: "text", placeholder: "예: 경기 수원" },
    { name: "contact_method", label: "연락방법", type: "text", placeholder: "예: 댓글 후 연락, 오픈채팅 링크" }
  ],
  materials: [
    { name: "material_name", label: "자재명", type: "text", placeholder: "예: 석고보드" },
    { name: "quantity", label: "수량", type: "text", placeholder: "예: 12장" },
    { name: "price", label: "가격", type: "number", placeholder: "무료나눔은 0 입력" },
    { name: "market_region", label: "지역", type: "text", placeholder: "예: 부산 사상" },
    { name: "direct_trade", label: "직거래 여부", type: "checkbox" },
    { name: "contact_method", label: "연락방법", type: "text", placeholder: "예: 댓글 확인, 오픈채팅 링크" }
  ]
};

export const COMMON_FORM_HINT =
  "조건, 임금, 일정, 안전사항은 이용자끼리 직접 확인하는 정보 공유 글입니다.";
