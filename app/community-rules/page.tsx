const bannedRules = [
  "개인정보 노출 금지: 본인 또는 타인의 주민등록번호, 신분증, 계좌번호, 상세 주소를 올리지 않습니다.",
  "명예훼손성 저격글 금지: 특정 개인을 공개적으로 단정해 비방하거나 낙인찍는 글을 올리지 않습니다.",
  "허위 구인글 금지: 임금, 장소, 날짜, 인원, 연락방법을 속이거나 실제와 다르게 올리지 않습니다.",
  "공개 블랙리스트 금지: 이름, 전화번호, 사진, 현장명 등을 모아 공개 처벌하듯 올리지 않습니다.",
  "광고/도배 금지: 같은 글을 반복하거나 커뮤니티 흐름을 방해하는 홍보 글을 올리지 않습니다.",
  "거래 사기 금지: 공구/자재 상태, 수량, 가격, 지역을 속이거나 결제만 유도하지 않습니다."
];

const reportReasons = [
  "허위 구인글",
  "임금/조건 불명확",
  "욕설/비방",
  "개인정보 노출",
  "사기 의심",
  "광고/도배",
  "거래 문제",
  "기타"
];

export default function CommunityRulesPage() {
  return (
    <article className="board-panel rounded-md p-4">
      <p className="text-sm font-bold text-accent">초안</p>
      <h1 className="mt-1 text-2xl font-bold leading-[1.3] text-slate-950">커뮤니티 규칙</h1>
      <p className="mt-3 text-base font-medium leading-7 text-slate-700">
        JOBDAY는 현장직 정보 공유 커뮤니티입니다. 서로 거칠게 말할 수는 있어도, 개인정보 노출과 허위 정보는 허용하지 않습니다.
      </p>

      <section className="mt-5">
        <h2 className="text-lg font-bold leading-[1.35] text-slate-950">금지되는 글</h2>
        <ul className="mt-2 space-y-2 text-base font-medium leading-7 text-slate-700">
          {bannedRules.map((rule) => (
            <li key={rule} className="border border-slate-200 bg-slate-50 px-3 py-2">
              {rule}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5">
        <h2 className="text-lg font-bold leading-[1.35] text-slate-950">신고가 필요한 경우</h2>
        <p className="mt-2 text-base font-medium leading-7 text-slate-700">
          임금체불, 노쇼, 사기 의심, 거래 문제처럼 다툼이 생긴 경우 공개 저격글보다 신고 기능을 먼저 사용해주세요.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {reportReasons.map((reason) => (
            <span key={reason} className="border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-950">
              {reason}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-5 space-y-2 text-base font-medium leading-7 text-slate-700">
        <h2 className="text-lg font-bold leading-[1.35] text-slate-950">운영자 처리</h2>
        <p>신고가 접수되면 운영자는 게시글과 댓글을 확인하고 숨김, 삭제, 계정 제한을 할 수 있습니다.</p>
        <p>신고된 글이 자동으로 삭제되는 것은 아니며, 운영자가 상황을 보고 처리합니다.</p>
        <p>JOBDAY는 임금 지급, 출근 관리, 작업 지시, 안전관리, 업무 배정을 하지 않습니다.</p>
      </section>
    </article>
  );
}
