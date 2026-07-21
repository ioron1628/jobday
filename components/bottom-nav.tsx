import { BottomNavItem, type IconName } from "./design-system";
import { isFeatureEnabled } from "@/lib/feature-flags";

const baseItems = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/listen", label: "듣기", icon: "play" },
  { href: "/occupations", label: "직업", icon: "briefcase" },
  { href: "/episodes/job-post-checklist", label: "일자리", icon: "building" }
] satisfies Array<{ href: string; label: string; icon: IconName }>;

export function BottomNav() {
  const items = [
    ...baseItems.map((item) => (item.label === "일자리" && isFeatureEnabled("jobs") ? { ...item, href: "/jobs" } : item)),
    { href: "/me", label: "마이", icon: "user" } as const
  ].slice(0, 5);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white sm:hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-5">
        {items.map((item) => (
          <BottomNavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
        ))}
      </div>
    </nav>
  );
}
