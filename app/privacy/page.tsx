const allowedItems = [
  "이메일",
  "닉네임",
  "선택 입력한 지역",
  "관심 직종과 가능 직종",
  "자기소개",
  "보유 공구",
  "차량 여부",
  "원정 가능 여부",
  "이용자가 게시글에 직접 적은 연락방법"
];

const blockedItems = [
  "주민등록번호",
  "신분증 이미지",
  "계좌번호",
  "정확한 집주소",
  "실시간 위치",
  "출근 기록",
  "임금 지급 정보"
];

export default function PrivacyPage() {
  return (
    <article className="board-panel rounded-md p-4">
      <p className="text-sm font-bold text-accent">초안</p>
      <h1 className="mt-1 text-2xl font-bold leading-[1.3] text-slate-950">개인정보처리방침</h1>
      <p className="mt-3 text-base font-medium leading-7 text-slate-700">
        JOBDAY는 커뮤니티 운영에 필요한 최소한의 정보만 다룹니다. 이 문서는 MVP 안내 초안이며, 실제 서비스 전 법률 검토가 필요합니다.
      </p>

      <section className="mt-5">
        <h2 className="text-lg font-bold leading-[1.35] text-slate-950">처리하는 정보</h2>
        <ul className="mt-2 grid gap-2 text-base font-medium leading-7 text-slate-700 sm:grid-cols-2">
          {allowedItems.map((item) => (
            <li key={item} className="border border-slate-200 bg-slate-50 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5">
        <h2 className="text-lg font-bold leading-[1.35] text-slate-950">JOBDAY가 요구하지 않는 정보</h2>
        <ul className="mt-2 grid gap-2 text-base font-medium leading-7 text-slate-700 sm:grid-cols-2">
          {blockedItems.map((item) => (
            <li key={item} className="border border-red-100 bg-red-50 px-3 py-2 text-red-900">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5 space-y-2 text-base font-medium leading-7 text-slate-700">
        <h2 className="text-lg font-bold leading-[1.35] text-slate-950">연락처와 게시글</h2>
        <p>이용자가 게시글이나 댓글에 직접 적은 연락처는 다른 이용자에게 보일 수 있습니다.</p>
        <p>전화번호, 오픈채팅 링크, 상세 주소 등은 필요한 만큼만 공개하고, 공개 여부는 이용자가 스스로 선택해야 합니다.</p>
        <p>타인의 개인정보를 허락 없이 올리면 게시글이 숨김 또는 삭제될 수 있습니다.</p>
      </section>
    </article>
  );
}
