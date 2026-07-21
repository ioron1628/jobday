"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./design-system";

const hiddenPrefixes = [
  "/shop",
  "/skills",
  "/write",
  "/login",
  "/signup",
  "/admin",
  "/terms",
  "/privacy",
  "/disclaimer",
  "/liability",
  "/community-rules"
];

function writeHref(pathname: string) {
  const match = pathname.match(/^\/boards\/([^/]+)$/);
  if (match?.[1]) return `/boards/${match[1]}/new`;
  return "/write";
}

export function FloatingWriteButton() {
  const pathname = usePathname();
  const isCommunitySurface = pathname.startsWith("/boards") || pathname.startsWith("/posts");
  const hidden =
    !isCommunitySurface ||
    pathname === "/" ||
    hiddenPrefixes.some((prefix) => pathname.startsWith(prefix)) ||
    pathname.endsWith("/new") ||
    pathname.includes("/edit");

  if (hidden) return null;

  return (
    <Link
      href={writeHref(pathname)}
      className="fixed bottom-20 right-3 z-40 inline-flex min-h-12 items-center justify-center rounded-sm border border-accent-strong bg-accent px-5 py-3 text-base font-semibold text-white active:translate-y-px sm:hidden"
    >
      <Icon name="pencil" className="mr-1.5 h-4 w-4" />
      글쓰기
    </Link>
  );
}
