export type ShopCategory =
  | "조공 준비물"
  | "보호용품"
  | "공구소모품"
  | "작업복/양말/깔창"
  | "타일 준비물"
  | "실리콘/보수 세트"
  | "Jobday 굿즈";

export type ShopStatus = "preparing" | "recommended" | "planned" | "inquiry";

export type ShopProduct = {
  id: string;
  name: string;
  category: ShopCategory;
  use: string;
  priceLabel: string;
  status: ShopStatus;
  relatedLessonId?: string;
  relatedLessonTitle?: string;
  summary: string;
  recommendedFor: string[];
  fieldReason: string[];
  items: string[];
  cautions: string[];
  popular?: boolean;
  beginner?: boolean;
};

export type ShopSet = {
  id: string;
  title: string;
  subtitle: string;
  purpose: string;
  recommendedFor: string[];
  items: string[];
  relatedProductIds: string[];
  relatedLessonId?: string;
};

export const shopCategories: ShopCategory[] = [
  "조공 준비물",
  "보호용품",
  "공구소모품",
  "작업복/양말/깔창",
  "타일 준비물",
  "실리콘/보수 세트",
  "Jobday 굿즈"
];

export const shopStatusLabels: Record<ShopStatus, string> = {
  preparing: "준비중",
  recommended: "추천",
  planned: "판매예정",
  inquiry: "문의가능"
};

export const shopProducts: ShopProduct[] = [
  {
    id: "beginner-common-kit",
    name: "초보 공통 준비 체크 세트",
    category: "조공 준비물",
    use: "현장 첫날 기본 준비물 확인",
    priceLabel: "문의",
    status: "recommended",
    relatedLessonId: "site-first-day-kit",
    relatedLessonTitle: "현장 첫날 준비물과 기본 예절",
    summary: "처음 현장에 갈 때 빠뜨리기 쉬운 기본 준비물을 한 번에 확인하는 구성입니다.",
    recommendedFor: ["현장 첫날을 앞둔 초보", "작업레이드 연락 전 준비물을 확인하려는 사람", "직종을 아직 정하지 않은 입문자"],
    fieldReason: ["공통 준비물을 먼저 챙기면 현장에서 당황할 일이 줄어듭니다.", "직종이 달라도 장갑, 줄자, 마커 같은 기본품은 자주 쓰입니다."],
    items: ["작업장갑", "줄자", "마커", "수건", "보조 파우치", "준비물 체크리스트"],
    cautions: ["보호구는 현장 기준과 인증 여부를 직접 확인하세요.", "현장마다 필요한 준비물이 다르므로 작업자 또는 현장 책임자에게 다시 확인하세요."],
    popular: true,
    beginner: true
  },
  {
    id: "protective-gear-check",
    name: "보호용품 확인 리스트",
    category: "보호용품",
    use: "안전화·보안경·마스크 등 보호구 확인",
    priceLabel: "문의",
    status: "inquiry",
    relatedLessonId: "demolition-basic-safety",
    relatedLessonTitle: "철거 현장 입문자가 먼저 알아야 할 것",
    summary: "현장별로 달라지는 보호구 기준을 확인하기 위한 체크형 큐레이션입니다.",
    recommendedFor: ["철거, 설비, 전기 현장 입문자", "보호구를 처음 준비하는 사람", "현장별 기준을 다시 확인해야 하는 사람"],
    fieldReason: ["보호구는 현장마다 요구 기준이 다를 수 있습니다.", "작업 전 보호구 상태를 확인하는 습관이 중요합니다."],
    items: ["안전화 확인", "보안경 확인", "마스크 확인", "장갑 확인", "현장별 보호구 질문 리스트"],
    cautions: ["안전화, 안전모, 마스크 등 보호구는 인증 제품 여부와 현장 기준을 직접 확인해야 합니다.", "Jobday는 보호구의 성능, 인증, 현장 적합성을 대신 판단하지 않습니다."],
    popular: true,
    beginner: true
  },
  {
    id: "tile-helper-consumables",
    name: "타일 조공 소모품 묶음",
    category: "타일 준비물",
    use: "타일 보조 첫 현장 준비",
    priceLabel: "문의",
    status: "recommended",
    relatedLessonId: "tile-helper-basic",
    relatedLessonTitle: "타일 보조가 처음 알아야 할 일 순서",
    summary: "타일 보조가 자주 쓰는 기본 소모품과 정리 도구를 확인하는 구성입니다.",
    recommendedFor: ["타일 보조를 처음 가는 사람", "스펀지와 헤라 같은 기본품을 확인하려는 사람", "타일 강의를 본 뒤 준비물을 맞추려는 사람"],
    fieldReason: ["타일 현장은 물, 자재, 뒷정리 흐름이 많아 소모품 준비가 중요합니다.", "기공 공구와 개인 소모품을 구분하면 현장에서 헷갈림이 줄어듭니다."],
    items: ["스펀지", "헤라", "작업장갑", "양동이 확인", "줄자", "마커"],
    cautions: ["현장마다 제공되는 공구가 다를 수 있으니 연락 전 필요한 공구를 직접 확인하세요.", "무거운 자재 운반은 본인 체력과 현장 지시를 우선해 판단하세요."],
    popular: true,
    beginner: true
  },
  {
    id: "bath-silicone-repair-kit",
    name: "욕실 실리콘 보수 준비세트",
    category: "실리콘/보수 세트",
    use: "욕실 실리콘 보수 전 기본 준비",
    priceLabel: "가격 미정",
    status: "planned",
    relatedLessonId: "plumbing-helper-flow",
    relatedLessonTitle: "설비 보조가 알아야 할 배관 자재 흐름",
    summary: "욕실 실리콘 보수 작업 전 필요한 기본 소모품과 정리도구 구성입니다.",
    recommendedFor: ["셀프 보수 흐름을 배우려는 초보", "실리콘 작업 준비물을 확인하려는 사람", "욕실 보수 입문 강의를 기다리는 사람"],
    fieldReason: ["실리콘 작업은 제거, 청소, 마스킹, 마감 순서가 중요합니다.", "작업 전 준비물이 갖춰져 있으면 마감 실수를 줄일 수 있습니다."],
    items: ["실리콘 헤라", "마스킹 테이프", "커터칼", "청소포", "장갑", "보수 전 체크리스트"],
    cautions: ["제품별 사용법과 환기 조건을 직접 확인하세요.", "누수나 구조 문제는 현장 전문가 확인이 필요할 수 있습니다."],
    popular: true
  },
  {
    id: "site-covering-kit",
    name: "현장 보양 기본 세트",
    category: "공구소모품",
    use: "작업 전 바닥·벽면 보호 준비",
    priceLabel: "문의",
    status: "inquiry",
    relatedLessonId: "wallpaper-floor-start",
    relatedLessonTitle: "도배·장판 보조 입문 흐름",
    summary: "도배, 장판, 보수 작업 전 주변을 보호하기 위한 기본 보양 구성입니다.",
    recommendedFor: ["실내 마감 현장 보조", "도배·장판 입문자", "작업 전 정리와 보양을 배우려는 사람"],
    fieldReason: ["보양은 작업 품질뿐 아니라 현장 민원 예방에도 중요합니다.", "초보는 작업보다 준비와 정리에서 먼저 실력을 쌓는 경우가 많습니다."],
    items: ["보양테이프", "커버링", "마스킹 테이프", "칼", "청소포"],
    cautions: ["현장 바닥재와 벽면 상태에 따라 테이프 선택이 달라질 수 있습니다.", "접착력이 강한 제품은 마감재 손상을 일으킬 수 있어 확인이 필요합니다."],
    beginner: true
  },
  {
    id: "work-socks-insole",
    name: "작업 양말·깔창 체크",
    category: "작업복/양말/깔창",
    use: "장시간 서서 일하는 현장 기본 착용품",
    priceLabel: "문의",
    status: "recommended",
    relatedLessonId: "site-first-day-kit",
    relatedLessonTitle: "현장 첫날 준비물과 기본 예절",
    summary: "오래 서서 일하는 현장 초보가 챙기기 쉬운 착용품을 정리한 큐레이션입니다.",
    recommendedFor: ["처음 장시간 현장 근무를 하는 사람", "안전화가 불편한 초보", "원정작업 준비물을 챙기는 사람"],
    fieldReason: ["발 피로는 현장 집중도에 영향을 줄 수 있습니다.", "작업복보다 양말과 깔창을 놓치는 초보가 많습니다."],
    items: ["두꺼운 작업 양말", "여분 양말", "깔창 확인", "발목 보호 체크"],
    cautions: ["안전화 안쪽 공간과 본인 발 상태에 맞는지 직접 확인하세요.", "의학적 효과를 기대하기보다 착용감을 확인하는 용도로 보세요."],
    beginner: true
  },
  {
    id: "jobday-sticker-pack",
    name: "Jobday 스티커팩",
    category: "Jobday 굿즈",
    use: "공구함·노트북·차량용 가벼운 굿즈",
    priceLabel: "가격 미정",
    status: "preparing",
    summary: "커뮤니티 소속감을 가볍게 보여주는 Jobday 굿즈 후보입니다.",
    recommendedFor: ["Jobday 베타 이용자", "공구함을 구분하고 싶은 사람", "커뮤니티 굿즈에 관심 있는 사람"],
    fieldReason: ["굿즈는 JOBDAYSHOP의 메인이 아니라 커뮤니티 보조 요소입니다.", "현장 준비물과 공구 큐레이션이 우선입니다."],
    items: ["스티커 3종 후보", "공구함 라벨 후보"],
    cautions: ["굿즈는 현장 필수품이 아닙니다.", "초기 JOBDAYSHOP에서는 준비물과 공구 소모품을 우선합니다."]
  }
];

export const shopSets: ShopSet[] = [
  {
    id: "tile-helper-set",
    title: "타일 조공 준비세트",
    subtitle: "타일 보조 첫 현장용 기본 구성",
    purpose: "타일 보조가 처음 현장에 갈 때 필요한 개인 소모품과 확인 항목을 묶은 세트입니다.",
    recommendedFor: ["타일 작업레이드에 처음 연락하려는 사람", "타일 보조 준비물을 한 번에 확인하려는 사람"],
    items: ["스펀지", "헤라", "장갑", "줄자", "마커", "양동이 확인"],
    relatedProductIds: ["tile-helper-consumables", "beginner-common-kit"],
    relatedLessonId: "tile-helper-basic"
  },
  {
    id: "bath-silicone-set",
    title: "욕실 실리콘 보수세트",
    subtitle: "실리콘 보수 전 준비물 체크",
    purpose: "욕실 실리콘 보수 흐름을 배우기 전 준비물과 주의사항을 확인하는 세트입니다.",
    recommendedFor: ["욕실 보수 입문자", "실리콘 작업 준비물을 확인하려는 사람"],
    items: ["실리콘 헤라", "마스킹 테이프", "커터칼", "청소포", "장갑"],
    relatedProductIds: ["bath-silicone-repair-kit"],
    relatedLessonId: "plumbing-helper-flow"
  },
  {
    id: "site-covering-set",
    title: "현장 보양세트",
    subtitle: "실내 작업 전 바닥·벽면 보호",
    purpose: "도배, 장판, 보수 작업 전 주변을 보호하는 기본 보양 소모품 구성입니다.",
    recommendedFor: ["실내 마감 보조", "작업 전 정리와 보양이 필요한 초보"],
    items: ["보양테이프", "커버링", "마스킹 테이프", "칼", "청소포"],
    relatedProductIds: ["site-covering-kit"],
    relatedLessonId: "wallpaper-floor-start"
  },
  {
    id: "beginner-common-set",
    title: "초보 공통 준비세트",
    subtitle: "직종 정하기 전 먼저 챙길 기본품",
    purpose: "직종이 아직 정해지지 않은 입문자가 현장 첫날 전에 확인할 기본 준비물 세트입니다.",
    recommendedFor: ["현장 입문 전 준비물을 모르는 사람", "작업레이드 연락 전 체크리스트가 필요한 사람"],
    items: ["작업장갑", "줄자", "마커", "수건", "양말·깔창 확인", "보호구 확인 리스트"],
    relatedProductIds: ["beginner-common-kit", "work-socks-insole", "protective-gear-check"],
    relatedLessonId: "site-first-day-kit"
  }
];

export function getShopProduct(id: string) {
  return shopProducts.find((product) => product.id === id);
}

export function getShopSet(id: string) {
  return shopSets.find((set) => set.id === id);
}

export function getPopularShopProducts() {
  return shopProducts.filter((product) => product.popular);
}

export function getBeginnerShopProducts() {
  return shopProducts.filter((product) => product.beginner);
}

export function getLessonLinkedProducts() {
  return shopProducts.filter((product) => product.relatedLessonId);
}
