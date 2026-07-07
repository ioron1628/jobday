import Link from "next/link";

const footerLinks = [
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/disclaimer", label: "책임 제한 안내" },
  { href: "/community-rules", label: "커뮤니티 규칙" }
];

export function FooterLinks() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-2 pb-28 pt-6 sm:px-4">
      <div className="border-t border-slate-200 pt-4">
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-slate-700">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="underline-offset-4 hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mt-3 text-[12px] font-medium leading-5 text-slate-500">
          JOBDAY는 현장직 정보 공유 커뮤니티이며, 계약·임금·출근·안전·거래 결과를 보장하지 않습니다.
        </p>
      </div>
    </footer>
  );
}
