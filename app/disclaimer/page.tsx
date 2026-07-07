import { GUARDRAIL_NOTICE, MARKET_NOTICE } from "@/lib/constants";

const checks = [
  "임금과 지급일",
  "작업시간과 작업내용",
  "안전사항과 보호구",
  "숙소 제공 여부",
  "교통비와 차량동승 여부",
  "필요 공구와 준비물",
  "공구/자재 상태, 수량, 가격, 지역"
];

export default function DisclaimerPage() {
  return (
    <article className="board-panel rounded-md p-4">
      <p className="text-sm font-bold text-accent">초안</p>
      <h1 className="mt-1 text-2xl font-bold leading-[1.3] text-slate-950">책임 제한 안내</h1>
      <div className="mt-4 space-y-4 text-base leading-7 text-slate-700">
        <p className="font-semibold">{GUARDRAIL_NOTICE}</p>
        <p className="font-semibold">{MARKET_NOTICE}</p>
        <p>JOBDAY의 게시글, 댓글, 광고, 프리미엄 노출은 이용자 또는 광고주가 입력한 정보입니다. JOBDAY가 작업 품질, 임금 지급, 현장 안전, 거래 결과를 보장한다는 뜻이 아닙니다.</p>
      </div>

      <section className="mt-5">
        <h2 className="text-lg font-bold leading-[1.35] text-slate-950">직접 확인해야 할 것</h2>
        <ul className="mt-2 grid gap-2 text-base font-medium leading-7 text-slate-700 sm:grid-cols-2">
          {checks.map((item) => (
            <li key={item} className="border border-slate-200 bg-slate-50 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5 space-y-2 text-base font-medium leading-7 text-slate-700">
        <h2 className="text-lg font-bold leading-[1.35] text-slate-950">문제가 의심될 때</h2>
        <p>허위 구인글, 임금/조건 불명확, 임금체불 의심, 노쇼, 사기 의심, 거래 문제는 신고 기능을 사용해주세요.</p>
        <p>신고가 접수되면 운영자가 확인 후 게시글 또는 댓글을 숨김 처리할 수 있습니다. 신고만으로 자동 삭제되지는 않습니다.</p>
        <p>JOBDAY는 공개 블랙리스트를 운영하지 않습니다.</p>
      </section>
    </article>
  );
}
