export type SkillCategory = "타일" | "목공" | "전기" | "설비" | "도배" | "철거" | "공통입문";
export type SkillLevel = "입문" | "초급" | "중급";
export type SkillStatus = "free" | "coming-soon" | "paid-soon";

export type SkillLesson = {
  id: string;
  title: string;
  category: SkillCategory;
  level: SkillLevel;
  duration: string;
  instructor: string;
  status: SkillStatus;
  tools: string[];
  summary: string;
  whatYouLearn: string[];
  recommendedFor: string[];
  curriculum: string[];
  instructorBio: string;
  relatedLinks: Array<{ label: string; href: string }>;
  featured?: boolean;
  popular?: boolean;
};

export const skillCategories: SkillCategory[] = ["타일", "목공", "전기", "설비", "도배", "철거", "공통입문"];

export const skillStatusLabels: Record<SkillStatus, string> = {
  free: "무료 맛보기",
  "coming-soon": "준비중",
  "paid-soon": "유료예정"
};

export const skillLessons: SkillLesson[] = [
  {
    id: "site-first-day-kit",
    title: "현장 첫날 준비물과 기본 예절",
    category: "공통입문",
    level: "입문",
    duration: "35분",
    instructor: "현장입문 길잡이",
    status: "free",
    tools: ["안전화", "장갑", "작업복", "줄자"],
    summary: "처음 현장에 가기 전 챙겨야 할 물건, 말투, 쉬는 시간, 연락 방법을 정리합니다.",
    whatYouLearn: ["처음 현장에 가져가야 할 준비물", "반장과 팀원에게 물어볼 기본 질문", "출근 전 확인해야 할 조건", "개인 연락처 공개 시 주의점"],
    recommendedFor: ["지인 라인 없이 현장에 처음 들어가려는 사람", "작업레이드 글을 보고 연락하기 전인 초보", "현장 용어와 분위기가 낯선 사람"],
    curriculum: ["현장 첫날 체크리스트", "작업복과 안전화 고르는 기준", "점심·휴식·퇴근 전 기본 매너", "일당과 숙소 조건 확인법"],
    instructorBio: "여러 현장을 다니며 초보 작업자 입문 질문을 정리해 온 운영진 큐레이션 강의입니다.",
    relatedLinks: [
      { label: "초보입문 게시판", href: "/boards/beginner" },
      { label: "현장질문 게시판", href: "/boards/questions" }
    ],
    featured: true,
    popular: true
  },
  {
    id: "tile-helper-basic",
    title: "타일 보조가 처음 알아야 할 일 순서",
    category: "타일",
    level: "입문",
    duration: "42분",
    instructor: "부산타일반장",
    status: "free",
    tools: ["스펀지", "양동이", "헤라", "줄자"],
    summary: "타일 현장에서 보조가 어떤 순서로 움직이면 되는지, 자재 정리와 뒷정리 기준을 알려줍니다.",
    whatYouLearn: ["타일 현장 보조의 하루 흐름", "자재 옮길 때 조심할 점", "기공이 자주 쓰는 기본 용어", "초보가 실수하기 쉬운 정리 방식"],
    recommendedFor: ["타일 디모도 글에 지원하려는 초보", "타일 현장 보조 경험이 1개월 미만인 사람", "공구 이름부터 익혀야 하는 사람"],
    curriculum: ["타일 현장의 역할 구분", "자재와 공구 위치 잡기", "물·접착제·줄눈 보조 흐름", "마감 후 정리 기준"],
    instructorBio: "아파트와 상가 타일 현장을 오래 다닌 기공이 초보 보조 기준으로 설명합니다.",
    relatedLinks: [
      { label: "타일 작업레이드 보기", href: "/boards/work-raid?trade=%ED%83%80%EC%9D%BC" },
      { label: "공구장터 보기", href: "/boards/tool-market" }
    ],
    popular: true
  },
  {
    id: "electric-helper-terms",
    title: "전기 조공 기본 용어와 현장 동선",
    category: "전기",
    level: "입문",
    duration: "38분",
    instructor: "전기김반장",
    status: "paid-soon",
    tools: ["절연장갑", "검전기", "테이프", "마커"],
    summary: "전기 현장에서 초보가 먼저 익혀야 할 용어와 이동 동선을 정리한 입문 강의입니다.",
    whatYouLearn: ["전기 현장에서 자주 쓰는 기본 용어", "자재 정리와 선 정리 보조 흐름", "말로 전달받은 위치를 확인하는 법", "안전수칙을 우선해야 하는 상황"],
    recommendedFor: ["전기 조공을 처음 시작하는 사람", "용어 때문에 현장에서 멈칫하는 사람", "전기 작업 보조 흐름이 궁금한 사람"],
    curriculum: ["전기 조공이 자주 듣는 말", "자재와 공구 구분", "작업 전 확인할 안전 기준", "초보 질문 정리"],
    instructorBio: "상가와 아파트 전기 현장 경험을 바탕으로 초보자가 헷갈리는 용어를 풀어 설명합니다.",
    relatedLinks: [
      { label: "전기 질문 보기", href: "/boards/questions?trade=%EC%A0%84%EA%B8%B0" },
      { label: "초보입문 보기", href: "/boards/beginner" }
    ],
    popular: true
  },
  {
    id: "wood-measure-line",
    title: "목공 보조를 위한 치수 읽기와 먹줄 기초",
    category: "목공",
    level: "초급",
    duration: "50분",
    instructor: "목수준",
    status: "coming-soon",
    tools: ["줄자", "먹통", "연필", "수평자"],
    summary: "목공 현장에서 치수와 기준선을 어떻게 이해하면 되는지 초보 눈높이로 정리합니다.",
    whatYouLearn: ["줄자 숫자 읽는 법", "기준선과 먹줄의 의미", "목공 보조가 치수 전달받는 방법", "기공에게 다시 확인해야 할 상황"],
    recommendedFor: ["목공 보조를 시작한 초보", "치수와 기준선이 낯선 사람", "먹줄 작업 흐름을 보고 싶은 사람"],
    curriculum: ["치수 읽기 기본", "먹줄 도구 이해", "현장 기준선 보는 법", "실수 줄이는 확인 습관"],
    instructorBio: "인테리어 목공과 내장 목공 현장에서 초보 교육을 자주 맡아온 기공입니다.",
    relatedLinks: [
      { label: "목공 작업글 보기", href: "/boards/work-raid?trade=%EB%AA%A9%EA%B3%B5" },
      { label: "현장질문 보기", href: "/boards/questions" }
    ]
  },
  {
    id: "plumbing-helper-flow",
    title: "설비 보조가 알아야 할 배관 자재 흐름",
    category: "설비",
    level: "입문",
    duration: "45분",
    instructor: "설비박팀장",
    status: "coming-soon",
    tools: ["몽키", "테프론", "장갑", "마커"],
    summary: "설비 현장에서 자재 이름과 보조 동선을 빠르게 익히는 입문 강의입니다.",
    whatYouLearn: ["배관 자재 기본 이름", "자재 전달과 정리 동선", "작업 전후 물 확인 주의점", "초보가 물어봐야 할 기준"],
    recommendedFor: ["설비 조공을 처음 시작하는 사람", "자재 이름을 빨리 익히고 싶은 사람", "현장 동선이 헷갈리는 사람"],
    curriculum: ["자재 이름 익히기", "작업 구역 정리", "공구 보조 흐름", "현장 책임자 지시 확인법"],
    instructorBio: "주거와 상가 설비 현장에서 초보 조공과 함께 일해온 팀장입니다.",
    relatedLinks: [
      { label: "설비 작업글 보기", href: "/boards/work-raid?trade=%EC%84%A4%EB%B9%84" },
      { label: "공구장터 보기", href: "/boards/tool-market" }
    ]
  },
  {
    id: "wallpaper-floor-start",
    title: "도배·장판 보조 입문 흐름",
    category: "도배",
    level: "입문",
    duration: "36분",
    instructor: "도배누나",
    status: "free",
    tools: ["칼", "헤라", "롤러", "장갑"],
    summary: "도배와 장판 현장에서 초보 보조가 맡는 준비, 정리, 자재 이동 흐름을 설명합니다.",
    whatYouLearn: ["도배·장판 현장의 기본 순서", "자재 훼손을 줄이는 이동법", "초보가 맡기 쉬운 정리 업무", "연락 전 확인해야 할 조건"],
    recommendedFor: ["도배·장판 보조를 알아보는 사람", "실내 현장 분위기가 궁금한 사람", "여러 직종 중 입문 경로를 비교하는 사람"],
    curriculum: ["현장 준비와 보양", "자재 이동과 정리", "기본 공구 이름", "마감 후 체크"],
    instructorBio: "실내 마감 현장에서 초보자와 함께 일하며 자주 나오는 질문을 정리했습니다.",
    relatedLinks: [
      { label: "도배 질문 보기", href: "/boards/questions?trade=%EB%8F%84%EB%B0%B0" },
      { label: "초보입문 보기", href: "/boards/beginner" }
    ]
  },
  {
    id: "demolition-basic-safety",
    title: "철거 현장 입문자가 먼저 알아야 할 것",
    category: "철거",
    level: "입문",
    duration: "40분",
    instructor: "철거현장노트",
    status: "coming-soon",
    tools: ["보안경", "마스크", "장갑", "안전화"],
    summary: "철거 현장에서 초보가 무리하지 않고 지시를 확인하며 움직이는 법을 정리합니다.",
    whatYouLearn: ["철거 현장 기본 역할", "먼지와 소음이 있는 현장 주의점", "무거운 자재를 옮길 때 확인할 것", "위험하다고 느낄 때 멈춰야 하는 기준"],
    recommendedFor: ["철거 현장이 처음인 사람", "체력과 안전 기준이 궁금한 사람", "초보가능 글에 지원하기 전인 사람"],
    curriculum: ["현장 입장 전 확인", "보호구 기본", "자재 이동과 폐기물 분리", "무리한 작업을 피하는 법"],
    instructorBio: "철거 현장 경험을 바탕으로 초보가 반드시 알아야 할 기본을 정리합니다.",
    relatedLinks: [
      { label: "철거 작업글 보기", href: "/boards/work-raid?trade=%EC%B2%A0%EA%B1%B0" },
      { label: "현장질문 보기", href: "/boards/questions" }
    ]
  }
];

export function getSkillLesson(id: string) {
  return skillLessons.find((lesson) => lesson.id === id);
}

export function getSkillLessonsByStatus(status: SkillStatus) {
  return skillLessons.filter((lesson) => lesson.status === status);
}

export function getPopularSkillLessons() {
  return skillLessons.filter((lesson) => lesson.popular || lesson.featured);
}
