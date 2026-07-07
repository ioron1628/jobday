import { BottomNavItem, type IconName } from "./design-system";

const items = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/boards/work-raid", label: "작업", icon: "lightning" },
  { href: "/boards/tool-market", label: "장터", icon: "box" },
  { href: "/write", label: "글쓰기", icon: "pencil" },
  { href: "/me", label: "마이", icon: "user" }
] satisfies Array<{ href: string; label: string; icon: IconName }>;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-5">
        {items.map((item) => (
          <BottomNavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
        ))}
      </div>
    </nav>
  );
}
