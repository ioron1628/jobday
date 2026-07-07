import Link from "next/link";
import { ShopActionButton } from "@/components/shop-action-button";
import { Badge, ButtonLink, Icon, IconFrame, NoticeBox, SectionHeader, SidebarCard } from "@/components/design-system";
import { getShopProduct, shopSets } from "@/lib/shop";

export default function ShopSetsPage() {
  return (
    <div className="space-y-3 xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-4 xl:space-y-0">
      <div className="space-y-3">
        <section className="border border-line-strong bg-white p-3">
          <div className="flex items-start gap-3">
            <IconFrame icon="briefcase" tone="work" size="lg" />
            <div className="min-w-0 flex-1">
              <Badge tone="accent" icon="check">초보 추천 세트</Badge>
              <h1 className="mt-2 text-2xl font-bold leading-[1.25] text-ink">현장 준비 세트</h1>
              <p className="mt-2 text-base font-medium leading-7 text-muted">
                처음 현장에 가는 사람과 특정 작업을 준비하는 사람이 빠뜨리기 쉬운 준비물을 묶어 보여줍니다.
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-3">
          {shopSets.map((set) => {
            const products = set.relatedProductIds.map((id) => getShopProduct(id)).filter(Boolean);

            return (
              <section id={set.id} key={set.id} className="border border-line bg-white">
                <SectionHeader title={set.title} />
                <div className="space-y-3 p-3">
                  <div>
                    <p className="text-lg font-bold leading-7 text-ink">{set.subtitle}</p>
                    <p className="mt-1 text-base font-medium leading-7 text-muted">{set.purpose}</p>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="border border-line bg-soft p-3">
                      <p className="text-sm font-bold text-muted">추천 대상</p>
                      <ul className="mt-2 space-y-1">
                        {set.recommendedFor.map((item) => (
                          <li key={item} className="flex gap-2 text-sm font-semibold leading-6 text-ink">
                            <Icon name="user" className="mt-1 h-4 w-4 text-accent" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border border-line bg-soft p-3">
                      <p className="text-sm font-bold text-muted">구성품</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {set.items.map((item) => (
                          <Badge key={item} tone="default" icon="tool">{item}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border border-line bg-white">
                    <SectionHeader title="관련 상품" />
                    <div className="divide-y divide-slate-200">
                      {products.map((product) => product ? (
                        <Link key={product.id} href={`/shop/${product.id}`} className="flex min-h-11 items-center justify-between px-3 py-2 text-base font-semibold text-ink active:bg-amber-50">
                          {product.name}
                          <Badge tone={product.priceLabel === "문의" ? "default" : "warning"} icon="wage">{product.priceLabel}</Badge>
                        </Link>
                      ) : null)}
                    </div>
                  </div>

                  {set.relatedLessonId ? (
                    <ButtonLink href={`/skills/${set.relatedLessonId}`} size="lg" fullWidth>
                      관련 강의 보기
                    </ButtonLink>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>

        <NoticeBox collapsible tone="warning" title="세트 확인 안내">
          <p>세트 구성은 현장 준비를 돕는 참고용입니다. 실제 필요한 준비물은 직종, 현장, 작업자 지시에 따라 달라질 수 있습니다.</p>
          <p>보호구는 인증 제품 여부와 현장 기준을 직접 확인해야 합니다.</p>
        </NoticeBox>
      </div>

      <aside className="hidden space-y-3 xl:block">
        <SidebarCard title="세트 문의">
          <div className="space-y-3 p-3">
            <p className="text-sm font-medium leading-6 text-muted">초기에는 문의와 준비중 안내만 제공합니다.</p>
            <ShopActionButton>세트 문의하기</ShopActionButton>
          </div>
        </SidebarCard>

        <SidebarCard title="세트 바로가기">
          <div className="divide-y divide-slate-200">
            {shopSets.map((set) => (
              <Link key={set.id} href={`/shop/sets#${set.id}`} className="block px-3 py-2 text-sm font-semibold leading-6 text-ink active:bg-amber-50">
                {set.title}
              </Link>
            ))}
          </div>
        </SidebarCard>

        <SidebarCard title="JOBDAYSHOP 목록" actionHref="/shop" actionLabel="보기">
          <p className="p-3 text-sm font-medium leading-6 text-muted">개별 준비물은 JOBDAYSHOP 메인에서 확인할 수 있습니다.</p>
        </SidebarCard>
      </aside>
    </div>
  );
}
