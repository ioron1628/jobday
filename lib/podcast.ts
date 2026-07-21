export type PodcastEpisodeStatus = "published" | "preparing";

export type PodcastEpisode = {
  id: string;
  title: string;
  season: string;
  episodeNo: number | null;
  category: string;
  format: string;
  duration: string;
  publishedAt: string;
  status: PodcastEpisodeStatus;
  summary: string;
  themeQuestion: string;
  takeaways: string[];
  editorialNotes: string[];
  transcript: string[];
  nextPrompt: string;
  sourceNote: string;
};

export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: "field-first-day",
    title: "첫 현장 가기 전, 오늘 꼭 챙길 것",
    season: "시즌 1: 오늘의 현장 기본기",
    episodeNo: 1,
    category: "초보입문",
    format: "체크리스트 에세이",
    duration: "8분",
    publishedAt: "2026-07-18",
    status: "published",
    summary: "첫날 현장에서 당황하지 않도록 준비물, 도착 시간, 연락 순서를 짧게 정리했습니다.",
    themeQuestion: "처음 현장에 가는 사람이 기술보다 먼저 챙겨야 할 것은 무엇일까?",
    takeaways: ["현장 주소와 집합 장소를 전날 다시 확인하기", "안전화와 작업복처럼 기본 준비물을 먼저 챙기기", "모르는 작업은 현장 책임자에게 먼저 묻기"],
    editorialNotes: ["한 장면: 첫 출근 전날 밤 가방을 싸는 순간", "한 질문: 실수를 줄이는 준비 순서는 무엇인가", "오늘의 확인: 주소, 시간, 연락처, 기본 장비"],
    transcript: [
      "처음 현장에 들어갈 때는 기술보다 준비와 약속을 지키는 일이 먼저입니다.",
      "현장 주소, 집합 시간, 연락할 사람을 메모해 두면 아침에 불필요하게 헤매지 않습니다.",
      "안전화, 작업복, 물, 간단한 간식처럼 기본적인 준비물을 챙기고, 현장에서 요구하는 공구가 있는지 미리 확인하세요.",
      "작업 방법을 모를 때는 혼자 판단하기보다 현장 책임자에게 먼저 묻는 것이 좋습니다. 이 방송은 입문 참고용이며 실제 현장에서는 안전수칙과 책임자의 지시를 우선해야 합니다."
    ],
    nextPrompt: "다음에는 구인글을 볼 때 먼저 확인해야 할 조건을 다룹니다.",
    sourceNote: "JOBDAY 편집 콘텐츠 · 특정 현장이나 업체의 조건을 보장하지 않습니다."
  },
  {
    id: "job-post-checklist",
    title: "구인글을 볼 때 먼저 확인할 여섯 가지",
    season: "시즌 1: 오늘의 현장 기본기",
    episodeNo: 2,
    category: "구인 정보",
    format: "조건 읽기",
    duration: "10분",
    publishedAt: "2026-07-16",
    status: "published",
    summary: "지역, 날짜, 직종, 인원, 일당, 연락방법을 빠르게 확인하는 순서를 소개합니다.",
    themeQuestion: "좋은 구인글과 불안한 구인글은 어떤 조건에서 갈릴까?",
    takeaways: ["현장지역과 작업날짜가 정확한지 보기", "직종과 필요인원을 제목보다 먼저 확인하기", "일당과 지급방식은 연락 전에 다시 물어보기"],
    editorialNotes: ["한 장면: 제목만 보고 연락했다가 조건을 다시 묻는 상황", "한 질문: 연락 전에 꼭 확인할 최소 조건은 무엇인가", "오늘의 확인: 지역, 날짜, 직종, 인원, 일당, 연락방법"],
    transcript: [
      "구인글을 볼 때는 제목보다 조건부터 읽는 습관이 도움이 됩니다.",
      "첫 번째는 현장지역과 작업날짜입니다. 이동할 수 있는 거리와 실제 가능한 날짜인지 먼저 확인하세요.",
      "두 번째는 직종과 필요인원입니다. 내가 할 수 있는 일인지, 몇 명을 구하는지 확인해야 연락 후에 다시 묻는 일이 줄어듭니다.",
      "세 번째는 일당과 지급방식입니다. 게시글에 적힌 내용도 당사자에게 한 번 더 확인하고, 작업조건과 안전사항도 직접 물어봐야 합니다.",
      "JOBDAY는 구인자와 구직자 사이의 계약 당사자가 아닙니다. 연락과 계약은 이용자가 직접 판단해야 합니다."
    ],
    nextPrompt: "다음에는 원정작업에서 숙소와 이동 조건을 확인하는 법을 다룹니다.",
    sourceNote: "JOBDAY 편집 콘텐츠 · 게시글의 임금, 근로조건, 안전사항을 보장하지 않습니다."
  },
  {
    id: "remote-work-checklist",
    title: "원정 구인글에서 숙소와 이동을 확인하는 법",
    season: "시즌 1: 오늘의 현장 기본기",
    episodeNo: 3,
    category: "원정작업",
    format: "원정 체크",
    duration: "9분",
    publishedAt: "2026-07-12",
    status: "published",
    summary: "출발지역, 현장지역, 숙소, 교통비와 차량동승 여부를 연락 전에 확인하는 순서입니다.",
    themeQuestion: "원정작업은 왜 일당만 보고 결정하면 위험할까?",
    takeaways: ["출발지와 현장까지 이동 시간을 계산하기", "숙소 제공 여부와 인원·방식을 구체적으로 묻기", "교통비와 차량동승 조건을 말로만 넘기지 않기"],
    editorialNotes: ["한 장면: 부산에서 수도권 현장을 알아보는 저녁", "한 질문: 이동과 숙박까지 계산하면 실제 조건은 어떻게 달라지는가", "오늘의 확인: 출발지, 현장지역, 숙소, 교통비, 차량동승"],
    transcript: [
      "원정작업은 일당만 보고 결정하기보다 이동과 숙박 조건을 함께 봐야 합니다.",
      "출발지역과 현장지역을 확인하고, 실제 이동 시간과 비용을 스스로 계산해 보세요.",
      "숙소가 제공된다고 적혀 있어도 몇 명이 함께 쓰는지, 현장과 얼마나 떨어져 있는지, 필요한 개인 준비물이 무엇인지 물어보는 편이 좋습니다.",
      "교통비 제공이나 차량동승도 기준과 출발 장소를 직접 확인하세요. JOBDAY는 안전한 현장이나 거래 결과를 보장하지 않으며 당사자 확인이 필요합니다."
    ],
    nextPrompt: "다음에는 공구장터에서 거래 전 확인할 항목을 다룹니다.",
    sourceNote: "JOBDAY 편집 콘텐츠 · 원정 조건과 안전사항은 이용자가 직접 확인해야 합니다."
  },
  {
    id: "tool-market-basics",
    title: "공구장터에서 연락하기 전 확인할 것",
    season: "시즌 1: 오늘의 현장 기본기",
    episodeNo: 4,
    category: "공구장터",
    format: "거래 체크",
    duration: "7분",
    publishedAt: "2026-07-09",
    status: "published",
    summary: "공구 상태, 가격, 지역, 거래방법을 확인하고 연락하는 기본 순서를 정리했습니다.",
    themeQuestion: "공구거래에서 사진만 보고 판단하면 어떤 부분을 놓치기 쉬울까?",
    takeaways: ["사진만 보지 말고 실제 상태를 질문하기", "가격과 직거래 장소를 기록하기", "입금과 전달 조건은 이용자끼리 신중하게 확인하기"],
    editorialNotes: ["한 장면: 사진은 멀쩡해 보이는데 구성품이 빠진 거래", "한 질문: 연락 전 무엇을 물어봐야 실수를 줄일까", "오늘의 확인: 상태, 구성품, 가격, 지역, 전달 방식"],
    transcript: [
      "공구 거래는 사진과 설명만으로 상태를 전부 판단하기 어렵습니다.",
      "사용 기간, 고장 여부, 구성품, 수리 이력처럼 실제 사용에 영향을 주는 내용을 먼저 물어보세요.",
      "가격과 지역, 직거래 여부를 확인하고, 거래 방식과 전달 시점을 서로 분명하게 정리하는 것이 좋습니다.",
      "JOBDAY는 공구 및 자재 거래의 당사자가 아닙니다. 결제나 거래 조건은 이용자끼리 직접 확인해야 합니다."
    ],
    nextPrompt: "다음에는 하루 일당을 볼 때 이동비와 준비 비용까지 함께 계산하는 법을 다룹니다.",
    sourceNote: "JOBDAY 편집 콘텐츠 · 공구 거래 결과와 제품 상태를 보장하지 않습니다."
  },
  {
    id: "daily-wage-real-cost",
    title: "일당을 보기 전에 하루 비용을 계산하는 법",
    season: "시즌 1: 오늘의 현장 기본기",
    episodeNo: 5,
    category: "일과 돈",
    format: "오디오 에세이",
    duration: "11분",
    publishedAt: "2026-07-20",
    status: "published",
    summary: "일당 숫자만 보지 않고 이동비, 식비, 준비물, 작업시간을 함께 보는 관점을 정리했습니다.",
    themeQuestion: "같은 일당이라도 어떤 현장은 왜 실제로 남는 돈이 달라질까?",
    takeaways: ["교통비와 이동 시간을 먼저 계산하기", "식사·숙소·필요공구 제공 여부를 함께 보기", "돈 이야기는 연락 전에 다시 확인하기"],
    editorialNotes: ["한 장면: 일당은 높지만 왕복 이동이 긴 현장을 고민하는 순간", "한 질문: 실제 하루 수익은 무엇으로 결정되는가", "반대 설명: 초보에게는 경험과 팀 분위기도 중요한 판단 기준이 될 수 있음"],
    transcript: [
      "일당을 볼 때 가장 먼저 눈에 들어오는 것은 숫자입니다. 하지만 실제 하루는 숫자 하나로 끝나지 않습니다.",
      "왕복 이동 시간이 길거나 교통비가 많이 들면 같은 일당이라도 체감은 달라집니다. 식사 제공 여부, 숙소 제공 여부, 필요한 공구도 함께 봐야 합니다.",
      "반대로 초보 입장에서는 당장의 금액만이 전부가 아닐 때도 있습니다. 배울 수 있는 현장인지, 무리한 작업을 요구하지 않는지, 연락 과정이 분명한지도 중요한 판단 기준입니다.",
      "JOBDAY 방송은 선택을 대신해 주지 않습니다. 다만 연락 전에 무엇을 확인해야 하는지 정리해, 이용자가 스스로 판단할 수 있도록 돕습니다."
    ],
    nextPrompt: "다음에는 현장에서 반복되는 질문을 모아 짧은 문답형 방송으로 준비합니다.",
    sourceNote: "JOBDAY 편집 콘텐츠 · 임금과 근로조건은 당사자가 직접 확인해야 합니다."
  },
  {
    id: "workday-questions",
    title: "준비중: 이번 주 현장 질문 모음",
    season: "시즌 1: 오늘의 현장 기본기",
    episodeNo: 6,
    category: "현장질문",
    format: "질문 모음",
    duration: "10분",
    publishedAt: "",
    status: "preparing",
    summary: "현장질문 게시판에서 반복되는 질문을 모아 다음 방송으로 준비하고 있습니다.",
    themeQuestion: "초보가 반복해서 묻는 질문에는 어떤 공통점이 있을까?",
    takeaways: ["초보가 자주 묻는 현장 용어", "직종별 기본 준비물", "첫 연락 때 물어볼 내용"],
    editorialNotes: ["운영자가 질문을 익명화한 뒤 다룹니다.", "개인 연락처와 실명 저격은 방송에 넣지 않습니다.", "답변은 현장 입문 참고용으로만 정리합니다."],
    transcript: [],
    nextPrompt: "공개 전 운영자가 사실관계와 개인정보를 확인합니다.",
    sourceNote: "운영자가 내용을 확인한 뒤 공개합니다."
  }
];

export function getPublishedPodcastEpisodes() {
  return podcastEpisodes
    .filter((episode) => episode.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPodcastEpisode(id: string) {
  return podcastEpisodes.find((episode) => episode.id === id) ?? null;
}
