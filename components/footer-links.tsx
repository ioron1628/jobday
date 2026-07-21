import Link from "next/link";
import { isFeatureEnabled } from "@/lib/feature-flags";

function getFooterLinks() {
  const links = [
  { href: "/listen", label: "듣기" },
  { href: "/occupations", label: "직업 허브" },
  { href: isFeatureEnabled("jobs") ? "/jobs" : "/episodes/job-post-checklist", label: "일자리 찾기" },
  ...(isFeatureEnabled("internal_apply") ? [{ href: "/podcast/submit", label: "출연 신청" }] : []),
  ...(isFeatureEnabled("community") ? [{ href: "/boards", label: "커뮤니티" }] : []),
  ...(isFeatureEnabled("shop") ? [{ href: "/shop", label: "JOBDAYSHOP" }] : []),
  ...(isFeatureEnabled("business_ads") ? [{ href: "/business", label: "비즈니스" }] : []),
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/disclaimer", label: "책임 제한 안내" },
  { href: "/community-rules", label: "이용 규칙" }
  ];

  return links;
}

export function FooterLinks() {
  const footerLinks = getFooterLinks();

  return (
    <footer className="mx-auto w-full max-w-6xl px-2 pb-28 pt-6 sm:px-4">
      <div className="border-t border-line pt-4">
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-ink">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="underline-offset-4 hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mt-3 text-[12px] font-medium leading-5 text-muted">
          JOBDAY는 직업인의 이야기, 구인 정보, 커뮤니티, 직업별 큐레이션을 연결하는 플랫폼입니다. 구인 조건, 거래 내용, 협찬 여부는 이용자가 직접 확인해야 합니다.
        </p>
      </div>
    </footer>
  );
}
