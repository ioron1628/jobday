import Link from "next/link";
import { Badge, ButtonLink, Icon, IconFrame, type IconName } from "@/components/design-system";
import { shopStatusLabels, type ShopCategory, type ShopProduct, type ShopStatus } from "@/lib/shop";

function categoryIcon(category: ShopCategory): IconName {
  if (category === "보호용품") return "helmet";
  if (category === "공구소모품" || category === "타일 준비물" || category === "실리콘/보수 세트") return "tool";
  if (category === "작업복/양말/깔창") return "user";
  if (category === "Jobday 굿즈") return "star";
  return "briefcase";
}

function statusTone(status: ShopStatus) {
  if (status === "recommended" || status === "inquiry") return "success";
  if (status === "planned") return "warning";
  return "muted";
}

export function ShopProductCard({ product, compact = false }: { product: ShopProduct; compact?: boolean }) {
  return (
    <article className="border border-line bg-white shadow-[inset_0_-2px_0_rgba(17,24,39,0.04)]">
      <Link href={`/shop/${product.id}`} className="block p-3 active:bg-amber-50">
        <div className="flex gap-3">
          <IconFrame icon={categoryIcon(product.category)} tone={product.category === "Jobday 굿즈" ? "guide" : "market"} size={compact ? "md" : "lg"} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1.5">
              <Badge tone={statusTone(product.status)} icon={product.status === "recommended" ? "check" : "notice"}>
                {shopStatusLabels[product.status]}
              </Badge>
              <Badge tone="market" icon="tool">{product.category}</Badge>
              <Badge tone={product.priceLabel === "문의" ? "default" : "warning"} icon="wage">{product.priceLabel}</Badge>
            </div>
            <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-[1.3] text-ink">{product.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-muted">{product.summary}</p>
          </div>
        </div>

        <div className="mt-3 grid gap-1.5 text-sm font-semibold leading-5 text-ink sm:grid-cols-2">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="briefcase" className="h-4 w-4 text-accent" />
            {product.use}
          </span>
          {product.relatedLessonTitle ? (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="star" className="h-4 w-4 text-accent" />
              {product.relatedLessonTitle}
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.items.slice(0, compact ? 3 : 5).map((item) => (
            <Badge key={item} tone="default" icon="check">{item}</Badge>
          ))}
        </div>
      </Link>

      <div className="border-t border-line bg-soft p-2">
        <ButtonLink href={`/shop/${product.id}`} size="sm" variant="secondary" fullWidth>
          상세 보기
        </ButtonLink>
      </div>
    </article>
  );
}
