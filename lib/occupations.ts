export type Occupation = {
  slug: string;
  name: string;
  industry: string;
  headline: string;
  description: string;
  audience: string;
  firstQuestions: string[];
  boardSlug: string;
  jobBoardSlug: string;
  shopProductIds: string[];
  episodeIds: string[];
  revenuePath: string;
};

export const occupations: Occupation[] = [
  {
    slug: "logistics-night",
    name: "야간 물류",
    industry: "물류·운반",
    headline: "남들이 잠든 시간에 움직이는 사람들",
    description: "야간 물류의 하루 리듬, 체력, 동료 문화, 처음 들어갈 때 확인할 조건을 다룹니다.",
    audience: "야간 근무를 고민하는 사람, 물류 일을 시작하려는 사람",
    firstQuestions: ["몇 시에 시작하고 끝나는가", "식사와 휴식은 어떻게 잡히는가", "허리·무릎 부담은 어느 정도인가"],
    boardSlug: "questions",
    jobBoardSlug: "work-raid",
    shopProductIds: ["store-logistics-kit", "work-socks-insole", "all-day-carry-set"],
    episodeIds: ["daily-wage-real-cost", "job-post-checklist"],
    revenuePath: "물류 기업 브랜딩, 추천 공고, 장갑·깔창·보온용품 큐레이션"
  },
  {
    slug: "site-helper",
    name: "현장 보조",
    industry: "건설·현장",
    headline: "첫날을 버티는 법부터 다음 단계까지",
    description: "현장 초보가 헷갈리는 준비물, 연락방법, 일당 조건, 반장과의 소통을 정리합니다.",
    audience: "지인 라인 없이 현장에 들어오려는 초보",
    firstQuestions: ["어떤 준비물이 필요한가", "보조가 실제로 하는 일은 무엇인가", "일당과 지급방식은 어떻게 확인하는가"],
    boardSlug: "beginner",
    jobBoardSlug: "dimodo",
    shopProductIds: ["beginner-common-kit", "tile-helper-consumables", "protective-gear-check"],
    episodeIds: ["field-first-day", "job-post-checklist"],
    revenuePath: "초보입문 콘텐츠, 준비물 큐레이션, 직종별 스폰서"
  },
  {
    slug: "remote-field",
    name: "원정 작업",
    industry: "지역 이동·숙박",
    headline: "일당보다 먼저 봐야 할 이동과 숙소",
    description: "원정 구인의 출발지역, 숙소, 교통비, 차량동승 조건을 실제 판단 순서로 보여줍니다.",
    audience: "부산·울산·경남에서 수도권 원정을 고민하는 작업자",
    firstQuestions: ["숙소는 몇 명이 쓰는가", "출발 장소와 차량동승 조건은 무엇인가", "이동비까지 계산하면 남는 돈은 얼마인가"],
    boardSlug: "remote-raid",
    jobBoardSlug: "remote-raid",
    shopProductIds: ["workday-backpack", "utility-work-pouch", "all-day-carry-set"],
    episodeIds: ["remote-work-checklist", "daily-wage-real-cost"],
    revenuePath: "원정 구인 상단노출, 이동·숙박 관련 스폰서, 원정 준비물 큐레이션"
  },
  {
    slug: "store-shift",
    name: "매장 근무",
    industry: "서비스·리테일",
    headline: "서서 일하는 하루의 체력과 루틴",
    description: "매장, 검수, 진열, 고객 응대처럼 반복되는 하루를 직업 이야기와 준비물로 연결합니다.",
    audience: "매장 일을 시작하거나 오래 서서 일하는 사람",
    firstQuestions: ["서 있는 시간이 얼마나 긴가", "휴식은 어떻게 잡히는가", "필요한 개인 준비물은 무엇인가"],
    boardSlug: "free",
    jobBoardSlug: "work-raid",
    shopProductIds: ["work-socks-insole", "utility-work-pouch", "all-day-carry-set"],
    episodeIds: ["daily-wage-real-cost"],
    revenuePath: "서비스직 콘텐츠 스폰서, 편한 깔창·텀블러·정리용품 제휴"
  },
  {
    slug: "field-trade",
    name: "기술 직종",
    industry: "타일·목공·전기·설비",
    headline: "기술이 일이 되는 과정",
    description: "보조에서 시작해 직종을 이해하고, 질문과 공구, 구인 정보로 이어지는 기술직 허브입니다.",
    audience: "타일, 목공, 전기, 설비 같은 기술직에 관심 있는 입문자",
    firstQuestions: ["초보가 어느 단계부터 배워야 하는가", "기공 공구와 개인 준비물은 어떻게 다른가", "위험한 현장을 어떻게 걸러야 하는가"],
    boardSlug: "beginner",
    jobBoardSlug: "work-raid",
    shopProductIds: ["tile-helper-consumables", "site-covering-kit", "bath-silicone-repair-kit"],
    episodeIds: ["field-first-day", "tool-market-basics"],
    revenuePath: "직종별 강의, 공구·소모품 제휴, 직종 카테고리 스폰서"
  },
  {
    slug: "freelance-workday",
    name: "프리랜서의 하루",
    industry: "독립 업무",
    headline: "일을 구하고, 정리하고, 회복하는 하루",
    description: "고정 회사 밖에서 일하는 사람의 일정관리, 수입 변동, 장비, 커뮤니티를 다룹니다.",
    audience: "프리랜서, 외근직, 프로젝트 단위로 일하는 사람",
    firstQuestions: ["일을 어디서 얻는가", "하루 루틴은 어떻게 지키는가", "장비와 비용은 어떻게 관리하는가"],
    boardSlug: "free",
    jobBoardSlug: "available-today",
    shopProductIds: ["workday-backpack", "utility-work-pouch", "work-socks-insole"],
    episodeIds: ["daily-wage-real-cost"],
    revenuePath: "업무 도구 큐레이션, 프리랜서 브랜드 협찬, 멤버십 확장"
  }
];

export function getOccupation(slug: string) {
  return occupations.find((occupation) => occupation.slug === slug);
}

export function getOccupationName(slug: string) {
  return getOccupation(slug)?.name ?? slug;
}

export function getOccupationSlugByName(name: string) {
  return occupations.find((occupation) => occupation.name === name)?.slug ?? null;
}

export const occupationSeed = occupations.map((occupation, index) => ({
  slug: occupation.slug,
  name: occupation.name,
  industry: occupation.industry,
  headline: occupation.headline,
  description: occupation.description,
  audience: occupation.audience,
  sort_order: (index + 1) * 10,
  status: "published" as const
}));
