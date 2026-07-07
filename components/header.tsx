import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between px-3 sm:px-5">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brand/jobday-header-logo.png"
            alt="JOBDAY"
            width={471}
            height={144}
            className="h-9 w-auto max-w-[150px] object-contain sm:h-10 sm:max-w-[170px]"
            priority
          />
          <span className="sr-only">JOBDAY</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold text-muted sm:gap-2">
          <Link className="rounded-sm px-1.5 py-2 active:bg-amber-50 sm:px-2" href="/boards">
            게시판
          </Link>
          <Link className="rounded-sm px-1.5 py-2 active:bg-amber-50 sm:px-2" href="/login">
            로그인
          </Link>
        </nav>
      </div>
    </header>
  );
}
