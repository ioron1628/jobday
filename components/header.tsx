import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/design-system";
import { ShopCartLink } from "@/components/shop-cart-link";
import { isFeatureEnabled } from "@/lib/feature-flags";

export function Header() {
  const showCommunity = isFeatureEnabled("community");
  const showJobs = isFeatureEnabled("jobs");
  const showShop = isFeatureEnabled("shop");
  const showBusiness = isFeatureEnabled("business_ads");
  const showApply = isFeatureEnabled("internal_apply");
  const jobsHref = showJobs ? "/jobs" : "/episodes/job-post-checklist";

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur-xl">
      <div className="relative mx-auto flex min-h-[68px] max-w-[1360px] items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brand/jobday-wordmark-new.png"
            alt="JOBDAY"
            width={471}
            height={144}
            className="h-7 w-auto max-w-[124px] object-contain mix-blend-multiply sm:h-8 sm:max-w-[150px]"
            priority
          />
          <span className="sr-only">JOBDAY</span>
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-[13px] font-semibold text-muted sm:flex">
          <Link className="py-2 hover:text-ink" href="/listen">
            듣기
          </Link>
          <Link className="py-2 hover:text-ink" href="/occupations">
            직업 찾기
          </Link>
          <Link className="py-2 hover:text-ink" href={jobsHref}>
            일자리 찾기
          </Link>
          {showApply ? (
            <Link className="py-2 hover:text-ink" href="/podcast/submit">
              출연 신청
            </Link>
          ) : null}
          {showCommunity ? (
            <Link className="py-2 hover:text-ink" href="/boards/free">
              커뮤니티
            </Link>
          ) : null}
          {showBusiness ? (
            <Link className="py-2 hover:text-ink" href="/business">
              비즈니스
            </Link>
          ) : null}
          {showShop ? (
            <Link className="py-2 text-accent hover:text-ink" href="/shop">
              JOBDAYSHOP
            </Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-1">
          {showShop ? <ShopCartLink /> : null}
          <Link href="/login" aria-label="로그인" title="로그인" className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-accent">
            <Icon name="user" className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
