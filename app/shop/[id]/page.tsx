import Link from "next/link";
import { notFound } from "next/navigation";
import { ShopActionButton } from "@/components/shop-action-button";
import { ShopProductCard } from "@/components/shop-card";
import { Badge, ButtonLink, Icon, IconFrame, NoticeBox, SectionHeader, SidebarCard } from "@/components/design-system";
import { getShopProduct, shopProducts, shopStatusLabels } from "@/lib/shop";

function relatedProducts(currentId: string, category: string) {
  return shopProducts.filter((product) => product.id !== currentId && product.category === category).slice(0, 3);
}

export default async function ShopDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getShopProduct(id);
  if (!product) notFound();

  const related = relatedProducts(product.id, product.category);

  return (
    <div className="space-y-3 xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-4 xl:space-y-0">
      <article className="space-y-3">
        <section className="border border-line-strong bg-white p-3">
          <div className="flex gap-3">
            <IconFrame icon="tool" tone="market" size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-1.5">
                <Badge tone={product.status === "recommended" || product.status === "inquiry" ? "success" : product.status === "planned" ? "warning" : "muted"} icon="notice">
                  {shopStatusLabels[product.status]}
                </Badge>
                <Badge tone="market" icon="tool">{product.category}</Badge>
                <Badge tone={product.priceLabel === "문의" ? "default" : "warning"} icon="wage">{product.priceLabel}</Badge>
              </div>
              <h1 className="mt-2 text-2xl font-bold leading-[1.25] text-ink">{product.name}</h1>
              <p className="mt-2 text-base font-medium leading-7 text-muted">{product.summary}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <ShopActionButton>문의하기</ShopActionButton>
                <ButtonLink href="/shop" size="lg" fullWidth>
                  JOBDAYSHOP 목록
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <section className="border border-line bg-white">
          <SectionHeader title="제품 용도" />
          <div className="p-3">
            <p className="text-lg font-bold leading-7 text-ink">{product.use}</p>
            <p className="mt-2 text-base font-medium leading-7 text-muted">{product.summary}</p>
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-2">
          <div className="border border-line bg-white">
            <SectionHeader title="추천 대상" />
            <ul className="divide-y divide-slate-200">
              {product.recommendedFor.map((item) => (
                <li key={item} className="flex gap-2 px-3 py-2 text-base font-semibold leading-6 text-ink">
                  <Icon name="user" className="mt-1 h-4 w-4 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-line bg-white">
            <SectionHeader title="현장에서 쓰는 이유" />
            <ul className="divide-y divide-slate-200">
              {product.fieldReason.map((item) => (
                <li key={item} className="flex gap-2 px-3 py-2 text-base font-semibold leading-6 text-ink">
                  <Icon name="check" className="mt-1 h-4 w-4 text-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border border-line bg-white">
          <SectionHeader title="구성품" count={`${product.items.length}개`} />
          <div className="flex flex-wrap gap-1.5 p-3">
            {product.items.map((item) => (
              <Badge key={item} tone="default" icon="tool" className="text-sm">{item}</Badge>
            ))}
          </div>
        </section>

        <section className="border border-line bg-white">
          <SectionHeader title="주의사항" />
          <ul className="divide-y divide-slate-200">
            {product.cautions.map((item) => (
              <li key={item} className="flex gap-2 px-3 py-2 text-base font-semibold leading-6 text-ink">
                <Icon name="warning" className="mt-1 h-4 w-4 text-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {product.relatedLessonId && product.relatedLessonTitle ? (
          <section className="border border-line bg-white">
            <SectionHeader title="관련 강의" />
            <Link href={`/skills/${product.relatedLessonId}`} className="flex min-h-12 items-center justify-between px-3 py-2 text-base font-bold text-ink active:bg-amber-50">
              {product.relatedLessonTitle}
              <Icon name="reply" className="h-4 w-4 rotate-180 text-accent" />
            </Link>
          </section>
        ) : null}

        <NoticeBox collapsible tone="warning" title="보호구/제품 확인 안내">
          <p>안전화, 안전모, 마스크 등 보호구는 인증 제품 여부와 현장 기준을 직접 확인해야 합니다.</p>
          <p>JOBDAYSHOP은 현장 준비물 큐레이션이며, 제품 성능이나 현장 적합성을 대신 판단하지 않습니다.</p>
        </NoticeBox>
      </article>

      <aside className="hidden space-y-3 xl:block">
        <SidebarCard title="문의">
          <div className="space-y-3 p-3">
            <p className="text-sm font-medium leading-6 text-muted">초기 JOBDAYSHOP은 문의와 준비중 안내만 제공합니다.</p>
            <ShopActionButton>문의하기</ShopActionButton>
          </div>
        </SidebarCard>

        {related.length ? (
          <SidebarCard title="같은 카테고리">
            <div className="space-y-2 p-2">
              {related.map((item) => (
                <ShopProductCard key={item.id} product={item} compact />
              ))}
            </div>
          </SidebarCard>
        ) : null}

        <SidebarCard title="세트로 보기" actionHref="/shop/sets" actionLabel="보기">
          <p className="p-3 text-sm font-medium leading-6 text-muted">초보 준비물은 세트 페이지에서 한 번에 확인할 수 있습니다.</p>
        </SidebarCard>
      </aside>
    </div>
  );
}
