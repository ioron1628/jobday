import Link from "next/link";
import { Icon } from "@/components/design-system";

export function ShopCartLink() {
  return (
    <Link
      href="/shop"
      aria-label="JOBDAYSHOP"
      title="JOBDAYSHOP"
      className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-accent"
    >
      <Icon name="box" className="h-5 w-5" />
    </Link>
  );
}
