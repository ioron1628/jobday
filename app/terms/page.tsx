import Link from "next/link";

const sections = [
  {
    title: "1. 서비스 성격",
    body: [
      "JOBDAY는 현장직 이용자가 게시글과 댓글로 정보를 나누는 커뮤니티입니다.",
      "구인글, 보조 구인, 오늘 일당 가능자, 원정작업, 공구장터, 자재나눔거래 글은 이용자가 직접 올린 정보입니다.",
      "JOBDAY는 구인자와 구직자 사이의 계약 당사자가 아니며, 공구/자재 거래의 당사자도 아닙니다."
    ]
  },
  {
    title: "2. JOBDAY가 하지 않는 일",
    body: [
      "JOBDAY는 임금 지급, 출근 관리, 작업 지시, 안전관리, 업무 배정, 자동 매칭을 하지 않습니다.",
      "JOBDAY는 작업자나 현장을 검증하거나 보장하지 않습니다.",
      "JOBDAY는 공구/자재 거래 대금 결제, 에스크로, 환불, 배송을 대신 처리하지 않습니다."
    ]
  },
  {
    title: "3. 이용자가 직접 확인할 일",
    body: [
      "임금, 작업조건, 안전사항, 작업날짜, 숙소, 교통비, 차량동승, 필요공구, 연락방법은 당사자가 직접 확인해야 합니다.",
      "공구와 자재 거래는 상태, 수량, 가격, 지역, 전달 방법을 직접 확인한 뒤 진행해야 합니다.",
      "연락처 공개 여부와 공개 범위는 이용자가 스스로 선택합니다."
    ]
  },
  {
    title: "4. 운영 조치",
    body: [
      "허위 구인글, 개인정보 노출, 명예훼손성 저격글, 광고/도배, 사기 의심 글은 신고할 수 있습니다.",
      "신고가 접수되면 운영자는 게시글 또는 댓글을 숨김, 삭제, 제한 처리할 수 있습니다.",
      "JOBDAY는 공개 블랙리스트를 운영하지 않습니다. 반복 악성 이용자는 비공개 운영 기준에 따라 제한될 수 있습니다."
    ]
  }
];

export default function TermsPage() {
  return (
    <article className="board-panel rounded-md p-4">
      <p className="text-sm font-bold text-accent">초안</p>
      <h1 className="mt-1 text-2xl font-bold leading-[1.3] text-slate-950">이용약관</h1>
      <p className="mt-3 text-base font-medium leading-7 text-slate-700">
        이 문서는 JOBDAY MVP 운영을 위한 쉬운 안내 초안입니다. 실제 서비스 공개 전에는 변호사 또는 노무사 검토가 필요합니다.
      </p>

      <div className="mt-5 space-y-5">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold leading-[1.35] text-slate-950">{section.title}</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-base font-medium leading-7 text-slate-700">
              {section.body.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-6 rounded-md bg-amber-50 p-3 text-sm font-medium leading-6 text-amber-950">
        자세한 운영 기준은 <Link className="font-bold underline" href="/community-rules">커뮤니티 규칙</Link>과{" "}
        <Link className="font-bold underline" href="/disclaimer">책임 제한 안내</Link>를 함께 확인해주세요.
      </div>
    </article>
  );
}
