export type FeatureFlagKey =
  | "media"
  | "occupation_follow"
  | "community"
  | "controlled_beta_community"
  | "jobs"
  | "controlled_beta_jobs"
  | "shop"
  | "controlled_beta_commerce"
  | "business_ads"
  | "adsense_slots"
  | "design_concepts"
  | "b2b_command_center"
  | "membership"
  | "internal_apply"
  | "multilingual"
  | "native_payments";

export type FeatureFlagDefinition = {
  key: FeatureFlagKey;
  label: string;
  description: string;
  phase: "phase_0" | "post_phase_0" | "post_beta";
  defaultEnabled: boolean;
};

export const featureFlagDefinitions: FeatureFlagDefinition[] = [
  {
    key: "media",
    label: "JOBDAY Media",
    description: "직업인의 이야기, 오디오/영상 에피소드, 미디어 목록",
    phase: "phase_0",
    defaultEnabled: true
  },
  {
    key: "internal_apply",
    label: "출연 신청",
    description: "직업 경험자 출연 신청과 운영자 검토 흐름",
    phase: "phase_0",
    defaultEnabled: true
  },
  {
    key: "occupation_follow",
    label: "직업 팔로우",
    description: "사용자가 관심 직업을 저장하고 이후 콘텐츠/공고로 이어지는 흐름",
    phase: "phase_0",
    defaultEnabled: false
  },
  {
    key: "community",
    label: "Community",
    description: "게시판, 댓글, 신고, 커뮤니티 운영",
    phase: "post_phase_0",
    defaultEnabled: false
  },
  {
    key: "controlled_beta_community",
    label: "Community Controlled Beta",
    description: "검증된 소수 사용자에게만 여는 직업별 Q&A와 커뮤니티 베타",
    phase: "post_phase_0",
    defaultEnabled: false
  },
  {
    key: "jobs",
    label: "Jobs",
    description: "검증 기업과 구조화된 일자리 정보",
    phase: "post_phase_0",
    defaultEnabled: false
  },
  {
    key: "controlled_beta_jobs",
    label: "Jobs Controlled Beta",
    description: "검증 기업 3곳 이하의 직접 지원형 공고 베타",
    phase: "post_phase_0",
    defaultEnabled: false
  },
  {
    key: "shop",
    label: "Shop",
    description: "직업 맥락 상품 큐레이션과 외부 구매 연결",
    phase: "post_beta",
    defaultEnabled: false
  },
  {
    key: "controlled_beta_commerce",
    label: "Commerce Controlled Beta",
    description: "직업/에피소드 맥락 안에서만 노출하는 외부 커머스 큐레이션 베타",
    phase: "post_beta",
    defaultEnabled: false
  },
  {
    key: "business_ads",
    label: "Business Ads",
    description: "스폰서, 채용 브랜딩, 광고 캠페인",
    phase: "post_beta",
    defaultEnabled: false
  },
  {
    key: "adsense_slots",
    label: "AdSense Slots",
    description: "콘텐츠 흐름을 해치지 않는 추천 콘텐츠형 광고 슬롯 실험",
    phase: "post_beta",
    defaultEnabled: false
  },
  {
    key: "design_concepts",
    label: "Design Concepts",
    description: "Editorial Documentary, Entertainment, Night Audio Journal 디자인 후보 검수",
    phase: "phase_0",
    defaultEnabled: false
  },
  {
    key: "b2b_command_center",
    label: "B2B Command Center",
    description: "기업 브랜딩과 공고 성과 리포트의 내부 운영용 실험",
    phase: "post_beta",
    defaultEnabled: false
  },
  {
    key: "membership",
    label: "Membership",
    description: "반복 청취와 커뮤니티가 검증된 뒤의 멤버십",
    phase: "post_beta",
    defaultEnabled: false
  },
  {
    key: "multilingual",
    label: "Multilingual",
    description: "한국어 외 다국어 경험",
    phase: "post_beta",
    defaultEnabled: false
  },
  {
    key: "native_payments",
    label: "Native Payments",
    description: "JOBDAY 내부 직접 결제",
    phase: "post_beta",
    defaultEnabled: false
  }
];

const definitionByKey = new Map(featureFlagDefinitions.map((flag) => [flag.key, flag]));

function parseBoolean(value: string | undefined) {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on", "enabled"].includes(normalized)) return true;
  if (["0", "false", "no", "off", "disabled"].includes(normalized)) return false;
  return null;
}

export function envNameForFeatureFlag(key: FeatureFlagKey) {
  return `JOBDAY_FEATURE_${key.toUpperCase()}`;
}

export function isFeatureEnabled(key: FeatureFlagKey) {
  const definition = definitionByKey.get(key);
  const envValue = parseBoolean(process.env[envNameForFeatureFlag(key)]);

  if (envValue !== null) return envValue;
  return definition?.defaultEnabled ?? false;
}

export function getPublicFeatureFlags() {
  return Object.fromEntries(featureFlagDefinitions.map((flag) => [flag.key, isFeatureEnabled(flag.key)])) as Record<
    FeatureFlagKey,
    boolean
  >;
}
