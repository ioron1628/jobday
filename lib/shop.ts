export type ShopCategory =
  | "출근·이동"
  | "업무 정리"
  | "몸을 편하게"
  | "현장 준비"
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
  "출근·이동",
  "업무 정리",
  "몸을 편하게",
  "현장 준비",
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
    id: "utility-work-pouch",
    name: "데일리 유틸리티 파우치",
    category: "업무 정리",
    use: "충전기·펜·작은 소지품 정리",
    priceLabel: "문의",
    status: "recommended",
    summary: "직장인, 프리랜서, 현장 작업자가 자주 꺼내는 작은 물건을 한곳에 정리하는 단품 파우치입니다.",
    recommendedFor: ["가방 안을 깔끔하게 정리하고 싶은 사람", "업무 장소를 자주 옮기는 사람", "충전기와 문구를 따로 보관하고 싶은 사람"],
    fieldReason: ["필요한 물건을 한 번에 찾기 쉬운 기본 수납 도구입니다.", "업무 공간이 바뀌어도 개인 소지품을 정리해 둘 수 있습니다."],
    items: ["파우치 1개", "지퍼 수납", "내부 정리 공간"],
    cautions: ["수납 크기와 실제 필요한 물건이 맞는지 확인하세요."],
    popular: true,
    beginner: true
  },
  {
    id: "store-logistics-kit",
    name: "데일리 워크 글러브",
    category: "현장 준비",
    use: "운반·정리·업무 중 손 보호",
    priceLabel: "문의",
    status: "recommended",
    summary: "매장, 물류, 현장, 배송처럼 손을 자주 쓰는 업무를 위한 단품 작업장갑입니다.",
    recommendedFor: ["박스와 물건을 자주 옮기는 사람", "매장·물류 업무를 하는 사람", "가벼운 작업용 장갑을 찾는 사람"],
    fieldReason: ["손을 쓰는 업무에서 필요한 기본 보호용품입니다.", "업무 강도와 현장 기준에 맞는 장갑을 고르는 출발점이 됩니다."],
    items: ["장갑 한 켤레", "손바닥 보강", "손목 밴딩"],
    cautions: ["절단·화학·고열 작업은 필요한 인증과 보호 수준을 별도로 확인하세요."],
    popular: true
  },
  {
    id: "workday-backpack",
    name: "데일리 워크 백팩",
    category: "출근·이동",
    use: "노트북·서류·개인 물건 이동",
    priceLabel: "판매예정",
    status: "planned",
    summary: "직장인, 프리랜서, 외근이 잦은 사람이 매일 쓰기 좋은 단품 데일리 백팩 후보입니다.",
    recommendedFor: ["출퇴근과 외근을 오가는 사람", "업무용 기기와 개인 물건을 함께 챙기는 사람", "가방 하나로 하루를 준비하고 싶은 사람"],
    fieldReason: ["업무 장소가 바뀌어도 필요한 물건을 한 번에 챙길 수 있습니다.", "노트북·서류·개인 물건을 나누어 담는 일상적인 사용을 고려했습니다."],
    items: ["백팩 1개", "노트북 수납", "앞면 포켓", "물병 포켓"],
    cautions: ["기기 크기와 실제 수납 용량은 출시 사양을 확인하세요."],
    popular: true
  },
  {
    id: "all-day-carry-set",
    name: "데일리 보온 텀블러",
    category: "몸을 편하게",
    use: "출근·이동·업무 중 음료 보관",
    priceLabel: "문의",
    status: "recommended",
    summary: "출근, 외근, 매장, 물류, 현장에서 매일 챙기기 좋은 단품 보온 텀블러입니다.",
    recommendedFor: ["음료를 직접 챙겨 다니는 사람", "이동과 대기 시간이 많은 사람", "책상과 현장을 오가며 쓰는 물건을 찾는 사람"],
    fieldReason: ["업무 중 마실 음료를 가까이 두는 일상적인 준비물입니다.", "직종과 상관없이 반복해서 사용할 수 있는 개인 물건입니다."],
    items: ["텀블러 1개", "휴대용 뚜껑", "보온 수납"],
    cautions: ["보온 시간과 세척 방법은 실제 제품 정보를 확인하세요."],
    popular: true,
    beginner: true
  },
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
    recommendedFor: ["현장 첫날을 앞둔 초보", "작업 구인글 연락 전 준비물을 확인하려는 사람", "직종을 아직 정하지 않은 입문자"],
    fieldReason: ["공통 준비물을 먼저 챙기면 현장에서 당황할 일이 줄어듭니다.", "직종이 달라도 장갑, 줄자, 마커 같은 기본품은 자주 쓰입니다."],
    items: ["작업장갑", "줄자", "마커", "수건", "보조 파우치", "준비물 체크리스트"],
    cautions: ["보호구는 현장 기준과 인증 여부를 직접 확인하세요.", "현장마다 필요한 준비물이 다르므로 작업자 또는 현장 책임자에게 다시 확인하세요."],
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
    beginner: true
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
    name: "하루 편한 깔창",
    category: "몸을 편하게",
    use: "출퇴근·서서 일하는 날의 신발 안쪽 정리",
    priceLabel: "문의",
    status: "recommended",
    relatedLessonId: "site-first-day-kit",
    relatedLessonTitle: "현장 첫날 준비물과 기본 예절",
    summary: "직장인, 프리랜서, 현장 작업자처럼 오래 걷거나 서 있는 날을 위한 단품 깔창 후보입니다.",
    recommendedFor: ["오래 서서 일하는 사람", "출퇴근 시간이 긴 사람", "신발 안쪽 착용감을 바꾸고 싶은 사람"],
    fieldReason: ["신발 안쪽 공간과 발에 닿는 느낌을 조정하는 기본 착용품입니다.", "직종과 관계없이 출근부터 퇴근까지 반복해서 사용할 수 있습니다."],
    items: ["깔창 한 켤레", "발뒤꿈치 쿠션", "신발 크기 확인"],
    cautions: ["신발 안쪽 공간과 본인 발 상태에 맞는지 직접 확인하세요.", "의학적 효과나 통증 개선을 보장하는 제품이 아닙니다."],
    popular: true,
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

export type ShopFloor = {
  id: string;
  floor: string;
  name: string;
  description: string;
  recommendedFor: string;
  productIds: string[];
};

export const shopFloors: ShopFloor[] = [
  {
    id: "move",
    floor: "01F",
    name: "MOVE",
    description: "움직임이 많은 사람을 위한 것",
    recommendedFor: "출퇴근·외근·이동이 잦은 하루",
    productIds: ["workday-backpack", "utility-work-pouch"]
  },
  {
    id: "work",
    floor: "02F",
    name: "WORK",
    description: "손과 몸을 많이 쓰는 사람을 위한 것",
    recommendedFor: "현장·매장·물류에서 반복해서 쓰는 하루",
    productIds: ["store-logistics-kit", "utility-work-pouch"]
  },
  {
    id: "care",
    floor: "03F",
    name: "CARE",
    description: "오래 일한 하루를 돌보는 것",
    recommendedFor: "오래 서고 걷는 시간이 긴 하루",
    productIds: ["work-socks-insole", "all-day-carry-set"]
  }
];

export const shopSets: ShopSet[] = [
  {
    id: "workday-common-set",
    title: "하루 공통 워크 컬렉션",
    subtitle: "출근·현장·외근 어디서나 쓰는 기본 제품",
    purpose: "업무 장소가 바뀌어도 자주 쓰는 제품을 함께 살펴볼 수 있도록 정리한 컬렉션입니다.",
    recommendedFor: ["직종과 업무 장소가 자주 바뀌는 사람", "첫 출근 전 공통 준비물을 확인하려는 사람"],
    items: ["유틸리티 파우치", "장갑", "마커", "줄자", "보온병", "작업 타월"],
    relatedProductIds: ["utility-work-pouch", "all-day-carry-set", "work-socks-insole"],
    relatedLessonId: "site-first-day-kit"
  },
  {
    id: "store-logistics-set",
    title: "매장·물류 워크 컬렉션",
    subtitle: "검수·진열·재고 이동을 위한 기본 제품",
    purpose: "매장과 물류 업무에서 반복해서 쓰는 제품을 함께 살펴볼 수 있도록 정리한 컬렉션입니다.",
    recommendedFor: ["매장 진열·검수 업무를 시작하는 사람", "물류 업무용 소지품을 정리하려는 사람"],
    items: ["정리 토트", "검수표 보관", "라벨 롤", "마커", "장갑", "물병"],
    relatedProductIds: ["store-logistics-kit", "utility-work-pouch", "workday-backpack"]
  },
  {
    id: "tile-helper-set",
    title: "타일 조공 워크 컬렉션",
    subtitle: "타일 보조 첫 현장용 기본 구성",
    purpose: "타일 보조가 처음 현장에 갈 때 필요한 개별 제품과 확인 항목을 함께 살펴보는 컬렉션입니다.",
    recommendedFor: ["타일 작업 구인글에 처음 연락하려는 사람", "타일 보조 준비물을 한 번에 확인하려는 사람"],
    items: ["스펀지", "헤라", "장갑", "줄자", "마커", "양동이 확인"],
    relatedProductIds: ["tile-helper-consumables", "beginner-common-kit"],
    relatedLessonId: "tile-helper-basic"
  },
  {
    id: "bath-silicone-set",
    title: "욕실 실리콘 보수 컬렉션",
    subtitle: "실리콘 보수 전 준비물 체크",
    purpose: "욕실 실리콘 보수 흐름을 배우기 전 관련 제품과 주의사항을 확인하는 컬렉션입니다.",
    recommendedFor: ["욕실 보수 입문자", "실리콘 작업 준비물을 확인하려는 사람"],
    items: ["실리콘 헤라", "마스킹 테이프", "커터칼", "청소포", "장갑"],
    relatedProductIds: ["bath-silicone-repair-kit"],
    relatedLessonId: "plumbing-helper-flow"
  },
  {
    id: "site-covering-set",
    title: "현장 보양 컬렉션",
    subtitle: "실내 작업 전 바닥·벽면 보호",
    purpose: "도배, 장판, 보수 작업 전 주변을 보호하는 기본 보양 소모품 구성입니다.",
    recommendedFor: ["실내 마감 보조", "작업 전 정리와 보양이 필요한 초보"],
    items: ["보양테이프", "커버링", "마스킹 테이프", "칼", "청소포"],
    relatedProductIds: ["site-covering-kit"],
    relatedLessonId: "wallpaper-floor-start"
  },
  {
    id: "beginner-common-set",
    title: "초보 공통 워크 컬렉션",
    subtitle: "직종 정하기 전 먼저 챙길 기본품",
    purpose: "직종이 아직 정해지지 않은 입문자가 현장 첫날 전에 확인할 기본 제품 컬렉션입니다.",
    recommendedFor: ["현장 입문 전 준비물을 모르는 사람", "작업 구인글 연락 전 체크리스트가 필요한 사람"],
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
