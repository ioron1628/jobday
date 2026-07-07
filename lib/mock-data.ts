import type { AdSlot, Board, Comment, Notice, Post, Region, Trade } from "@/types/domain";

const MOCK_TIME = "2026-07-04T00:00:00.000Z";

export const mockBoards: Board[] = [
  {
    id: "mock-board-free",
    slug: "free",
    name: "현장자유",
    description: "현장 이야기와 잡담을 나누는 게시판",
    category: "free",
    sort_order: 10,
    is_active: true,
    requires_guardrail_notice: false,
    created_at: MOCK_TIME,
    updated_at: MOCK_TIME
  },
  {
    id: "mock-board-work-raid",
    slug: "work-raid",
    name: "작업레이드",
    description: "단기 작업, 급한 인원 모집성 정보를 공유하는 게시판",
    category: "work",
    sort_order: 20,
    is_active: true,
    requires_guardrail_notice: true,
    created_at: MOCK_TIME,
    updated_at: MOCK_TIME
  },
  {
    id: "mock-board-remote-raid",
    slug: "remote-raid",
    name: "원정레이드",
    description: "숙식, 이동, 장거리 작업 정보를 공유하는 게시판",
    category: "work",
    sort_order: 30,
    is_active: true,
    requires_guardrail_notice: true,
    created_at: MOCK_TIME,
    updated_at: MOCK_TIME
  },
  {
    id: "mock-board-dimodo",
    slug: "dimodo",
    name: "보조구함",
    description: "보조 인력, 조공, 현장 보조 정보 공유 게시판",
    category: "work",
    sort_order: 40,
    is_active: true,
    requires_guardrail_notice: true,
    created_at: MOCK_TIME,
    updated_at: MOCK_TIME
  },
  {
    id: "mock-board-available-today",
    slug: "available-today",
    name: "오늘일당가능",
    description: "오늘 가능한 지역과 직종을 작업자가 직접 올리는 게시판",
    category: "work",
    sort_order: 50,
    is_active: true,
    requires_guardrail_notice: true,
    created_at: MOCK_TIME,
    updated_at: MOCK_TIME
  },
  {
    id: "mock-board-tool-market",
    slug: "tool-market",
    name: "공구장터",
    description: "공구 판매, 대여, 교환 정보를 공유하는 게시판",
    category: "market",
    sort_order: 60,
    is_active: true,
    requires_guardrail_notice: true,
    created_at: MOCK_TIME,
    updated_at: MOCK_TIME
  },
  {
    id: "mock-board-materials",
    slug: "materials",
    name: "자재나눔거래",
    description: "남는 자재, 소량 자재, 무료 나눔 정보를 공유하는 게시판",
    category: "market",
    sort_order: 70,
    is_active: true,
    requires_guardrail_notice: true,
    created_at: MOCK_TIME,
    updated_at: MOCK_TIME
  },
  {
    id: "mock-board-beginner",
    slug: "beginner",
    name: "초보입문",
    description: "준비물, 용어, 단가 감각, 현장 기본 정보를 나누는 게시판",
    category: "guide",
    sort_order: 80,
    is_active: true,
    requires_guardrail_notice: false,
    created_at: MOCK_TIME,
    updated_at: MOCK_TIME
  },
  {
    id: "mock-board-questions",
    slug: "questions",
    name: "현장질문",
    description: "시공, 공구, 현장 상황을 질문하는 게시판",
    category: "question",
    sort_order: 90,
    is_active: true,
    requires_guardrail_notice: false,
    created_at: MOCK_TIME,
    updated_at: MOCK_TIME
  },
  {
    id: "mock-board-company-jobs",
    slug: "company-jobs",
    name: "시공사구인",
    description: "시공사와 업체가 작성한 정보성 구인 게시판",
    category: "company",
    sort_order: 100,
    is_active: true,
    requires_guardrail_notice: true,
    created_at: MOCK_TIME,
    updated_at: MOCK_TIME
  },
  {
    id: "mock-board-notices",
    slug: "notices",
    name: "공지사항",
    description: "운영 공지와 이용 안내",
    category: "notice",
    sort_order: 110,
    is_active: true,
    requires_guardrail_notice: false,
    created_at: MOCK_TIME,
    updated_at: MOCK_TIME
  }
];

export const mockRegions: Region[] = [
  { id: "mock-region-seoul", slug: "seoul", name: "서울", sort_order: 10 },
  { id: "mock-region-gyeonggi", slug: "gyeonggi", name: "경기", sort_order: 20 },
  { id: "mock-region-incheon", slug: "incheon", name: "인천", sort_order: 30 },
  { id: "mock-region-busan", slug: "busan", name: "부산", sort_order: 40 },
  { id: "mock-region-nationwide", slug: "nationwide", name: "전국", sort_order: 50 }
];

export const mockTrades: Trade[] = [
  { id: "mock-trade-helper", slug: "helper", name: "조공", sort_order: 10 },
  { id: "mock-trade-dimodo", slug: "dimodo", name: "보조", sort_order: 20 },
  { id: "mock-trade-electric", slug: "electric", name: "전기", sort_order: 30 },
  { id: "mock-trade-plumbing", slug: "plumbing", name: "설비", sort_order: 40 },
  { id: "mock-trade-welding", slug: "welding", name: "용접", sort_order: 50 },
  { id: "mock-trade-other", slug: "other", name: "기타", sort_order: 60 }
];

const mockAuthor = {
  id: "mock-profile-worker",
  nickname: "현장테스터",
  region: "경기",
  interested_trade: "전기",
  is_premium_company: false
};

function boardBySlug(slug: string) {
  return mockBoards.find((board) => board.slug === slug) ?? null;
}

function createMockPost(input: {
  id: string;
  boardSlug: string;
  title: string;
  body: string;
  region: string;
  trade: string;
  workDate?: string;
  dailyPay?: number;
  extra?: Post["extra"];
}): Post {
  const board = boardBySlug(input.boardSlug);

  return {
    id: input.id,
    board_id: board?.id ?? `mock-board-${input.boardSlug}`,
    author_id: mockAuthor.id,
    title: input.title,
    body: input.body,
    status: "recruiting",
    region_text: input.region,
    trade_text: input.trade,
    work_date: input.workDate ?? null,
    daily_pay: input.dailyPay ?? null,
    contact_method: "댓글로 연락 방법을 확인하세요.",
    extra: input.extra ?? {},
    view_count: 12,
    comment_count: 1,
    up_count: 2,
    down_count: 0,
    pinned_until: null,
    urgent_until: null,
    created_at: MOCK_TIME,
    updated_at: MOCK_TIME,
    board,
    author: mockAuthor,
    images: []
  };
}

export const mockPosts: Post[] = [
  createMockPost({
    id: "mock-post-work-raid",
    boardSlug: "work-raid",
    title: "경기 화성 전기 조공 3명 작업레이드",
    body: "화면 확인용 예시 글입니다. 실제 조건은 작성자와 직접 확인해야 합니다.",
    region: "경기 화성",
    trade: "전기 조공",
    workDate: "2026-07-05",
    dailyPay: 180000,
    extra: {
      departure_region: "서울 구로",
      site_region: "경기 화성",
      work_date: "2026-07-05",
      needed_count: 3,
      daily_pay: 180000,
      lodging_provided: false,
      beginner_ok: true
    }
  }),
  createMockPost({
    id: "mock-post-remote-raid",
    boardSlug: "remote-raid",
    title: "부산 원정 설비 보조 2일",
    body: "숙소와 이동 조건은 작성자 입력 정보로만 확인합니다.",
    region: "부산",
    trade: "설비",
    workDate: "2026-07-06",
    dailyPay: 200000,
    extra: {
      departure_region: "서울",
      site_region: "부산",
      work_date: "2026-07-06",
      work_period: "2일",
      needed_count: 2,
      daily_pay: 200000,
      lodging_provided: true,
      transportation_provided: true,
      ride_share_available: true,
      beginner_ok: false
    }
  }),
  createMockPost({
    id: "mock-post-dimodo",
    boardSlug: "dimodo",
    title: "인천 송도 보조 1명",
    body: "보조 정보 공유 글입니다.",
    region: "인천 송도",
    trade: "보조",
    workDate: "2026-07-05",
    dailyPay: 160000,
    extra: {
      site_region: "인천 송도",
      work_date: "2026-07-05",
      trade: "보조",
      needed_count: 1,
      daily_pay: 160000,
      beginner_ok: true
    }
  }),
  createMockPost({
    id: "mock-post-available",
    boardSlug: "available-today",
    title: "오늘 경기 서부 전기 조공 가능",
    body: "작업자가 직접 올리는 가능 정보 예시입니다.",
    region: "경기 서부",
    trade: "전기 조공",
    workDate: "2026-07-04",
    dailyPay: 170000,
    extra: {
      available_region: "경기 서부",
      available_date: "2026-07-04",
      available_trade: "전기 조공",
      desired_pay: 170000,
      has_vehicle: true,
      can_travel: true
    }
  }),
  createMockPost({
    id: "mock-post-tool",
    boardSlug: "tool-market",
    title: "밀워키 임팩 판매",
    body: "공구 거래는 이용자 간 직접 진행됩니다.",
    region: "경기 수원",
    trade: "공구",
    dailyPay: 120000,
    extra: {
      tool_name: "밀워키 임팩",
      transaction_type: "판매",
      price: 120000,
      condition: "사용감 있음",
      market_region: "경기 수원"
    }
  }),
  createMockPost({
    id: "mock-post-materials",
    boardSlug: "materials",
    title: "석고보드 12장 나눔",
    body: "자재 거래와 나눔은 이용자 간 직접 확인합니다.",
    region: "서울 강서",
    trade: "자재",
    extra: {
      material_name: "석고보드",
      quantity: "12장",
      price: 0,
      market_region: "서울 강서",
      direct_trade: true
    }
  }),
  createMockPost({
    id: "mock-post-free",
    boardSlug: "free",
    title: "오늘 현장 비 와도 진행하나요?",
    body: "현장자유 예시 인기글입니다. 지역별 상황을 댓글로 공유하는 흐름을 확인합니다.",
    region: "전국",
    trade: "현장자유"
  }),
  createMockPost({
    id: "mock-post-beginner",
    boardSlug: "beginner",
    title: "초보 첫 현장 준비물 체크",
    body: "안전화, 장갑, 작업복, 물통처럼 기본 준비물을 확인하는 예시 글입니다.",
    region: "전국",
    trade: "초보입문"
  })
];

export const mockComments: Comment[] = [
  {
    id: "mock-comment-1",
    post_id: "mock-post-work-raid",
    author_id: "mock-profile-commenter",
    parent_id: null,
    body: "예시 댓글입니다. 실제 댓글 등록 흐름은 로그인 후 확인할 수 있습니다.",
    status: "published",
    created_at: MOCK_TIME,
    updated_at: MOCK_TIME,
    author: { id: "mock-profile-commenter", nickname: "댓글테스터" }
  }
];

export const mockNotices: Notice[] = [
  {
    id: "mock-notice-1",
    title: "JOBDAY 이용 안내",
    body: "JOBDAY는 현장직 정보 공유 커뮤니티입니다. 조건과 연락은 이용자 간 직접 확인해야 합니다.",
    is_published: true,
    author_id: null,
    created_at: MOCK_TIME,
    updated_at: MOCK_TIME
  }
];

export const mockAdSlots: AdSlot[] = [
  {
    id: "mock-ad-home",
    placement: "home_top",
    label: "홈 상단 배너",
    description: "개발 확인용 광고 위치",
    advertiser_name: null,
    sponsor_type: "general",
    target_region: null,
    target_trade: null,
    image_path: null,
    link_url: null,
    starts_at: MOCK_TIME,
    ends_at: null,
    is_active: true,
    admin_memo: null
  },
  {
    id: "mock-ad-tool-sponsor",
    placement: "tool_market_sponsor",
    label: "공구장터 추천 업체 슬롯",
    description: "공구상 스폰서 슬롯",
    advertiser_name: null,
    sponsor_type: "tool_vendor",
    target_region: null,
    target_trade: null,
    image_path: null,
    link_url: null,
    starts_at: MOCK_TIME,
    ends_at: null,
    is_active: true
  },
  {
    id: "mock-ad-region-board",
    placement: "region_board_top",
    label: "지역 작업 광고 자리",
    description: "지역 작업 게시판 광고 위치",
    advertiser_name: null,
    sponsor_type: "general",
    target_region: null,
    target_trade: null,
    image_path: null,
    link_url: null,
    starts_at: MOCK_TIME,
    ends_at: null,
    is_active: true,
    admin_memo: null
  },
  {
    id: "mock-ad-trade-board",
    placement: "trade_board_top",
    label: "직종 게시판 광고 자리",
    description: "직종 게시판 광고 위치",
    advertiser_name: null,
    sponsor_type: "general",
    target_region: null,
    target_trade: null,
    image_path: null,
    link_url: null,
    starts_at: MOCK_TIME,
    ends_at: null,
    is_active: true,
    admin_memo: null
  },
  {
    id: "mock-ad-post-inline",
    placement: "post_inline",
    label: "글 상세 광고 자리",
    description: "글 상세 중간 광고 위치",
    advertiser_name: null,
    sponsor_type: "general",
    target_region: null,
    target_trade: null,
    image_path: null,
    link_url: null,
    starts_at: MOCK_TIME,
    ends_at: null,
    is_active: true,
    admin_memo: null
  },
  {
    id: "mock-ad-market",
    placement: "market_top",
    label: "마켓 상단 광고 자리",
    description: "공구장터와 자재나눔거래 광고 위치",
    advertiser_name: null,
    sponsor_type: "materials",
    target_region: null,
    target_trade: null,
    image_path: null,
    link_url: null,
    starts_at: MOCK_TIME,
    ends_at: null,
    is_active: true,
    admin_memo: null
  },
  {
    id: "mock-ad-workwear",
    placement: "workwear_safety_sponsor",
    label: "작업복/안전화 스폰서 자리",
    description: "작업복, 안전화, 보호구 스폰서 위치",
    advertiser_name: null,
    sponsor_type: "workwear",
    target_region: null,
    target_trade: null,
    image_path: null,
    link_url: null,
    starts_at: MOCK_TIME,
    ends_at: null,
    is_active: true,
    admin_memo: null
  },
  {
    id: "mock-ad-beginner-sponsor",
    placement: "beginner_guide_sponsor",
    label: "초보입문 가이드 후원 자리",
    description: "초보 입문 장비와 가이드 후원 위치",
    advertiser_name: null,
    sponsor_type: "beginner_guide",
    target_region: null,
    target_trade: null,
    image_path: null,
    link_url: null,
    starts_at: MOCK_TIME,
    ends_at: null,
    is_active: true,
    admin_memo: null
  },
  {
    id: "mock-ad-group-buy",
    placement: "group_buy_preview",
    label: "공구/자재 공동구매 예고 자리",
    description: "결제 없는 공동구매 예고 위치",
    advertiser_name: null,
    sponsor_type: "group_buy",
    target_region: null,
    target_trade: null,
    image_path: null,
    link_url: null,
    starts_at: MOCK_TIME,
    ends_at: null,
    is_active: true,
    admin_memo: null
  },
  {
    id: "mock-ad-company-profile",
    placement: "company_profile_sponsor",
    label: "사업자 정보 등록 노출 자리",
    description: "검증 보장이 아닌 사업자 정보 등록 계정 노출 위치",
    advertiser_name: null,
    sponsor_type: "company_profile",
    target_region: null,
    target_trade: null,
    image_path: null,
    link_url: null,
    starts_at: MOCK_TIME,
    ends_at: null,
    is_active: true,
    admin_memo: null
  },
  {
    id: "mock-ad-board",
    placement: "board_top",
    label: "게시판 상단 배너",
    description: "개발 확인용 광고 위치",
    advertiser_name: null,
    sponsor_type: "general",
    target_region: null,
    target_trade: null,
    image_path: null,
    link_url: null,
    starts_at: MOCK_TIME,
    ends_at: null,
    is_active: true
  }
];
