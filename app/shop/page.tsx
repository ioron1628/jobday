import Link from "next/link";
import { ShopProductCard } from "@/components/shop-card";
import { Badge, ButtonLink, Icon, IconFrame, NoticeBox, SectionHeader, SidebarCard } from "@/components/design-system";
import { getLessonLinkedProducts, getPopularShopProducts, shopCategories, shopSets } from "@/lib/shop";

export default function ShopPage() {
  const popularProducts = getPopularShopProducts();
  const lessonLinkedProducts = getLessonLinkedProducts();

  return (
    <div className="space-y-3 xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-4 xl:space-y-0">
      <div className="space-y-3">
        <section className="border border-line-strong bg-white p-3">
          <div className="flex items-start gap-3">
            <IconFrame icon="tool" tone="market" size="lg" />
            <div className="min-w-0 flex-1">
              <Badge tone="warning" icon="notice">큐레이션</Badge>
              <h1 className="mt-2 text-2xl font-bold leading-[1.25] text-ink">JOBDAYSHOP</h1>
              <p className="mt-1 text-lg font-bold leading-7 text-ink">현장 사람들이 실제로 쓰는 준비물과 필수템</p>
              <p className="mt-2 text-base font-medium leading-7 text-muted">
                초기 JOBDAYSHOP은 준비물 확인, 문의, 준비중 상품 안내에 집중합니다.
              </p>
            </div>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <ButtonLink href="/shop/sets" variant="primary" size="lg" fullWidth>
              초보 추천 세트
            </ButtonLink>
            <ButtonLink href="/boards/tool-market" size="lg" fullWidth>
              공구장터 보기
            </ButtonLink>
          </div>
        </section>

        <section className="border border-line bg-white p-3">
          <div className="flex items-center gap-2">
            <Icon name="filter" className="h-4 w-4 text-accent" />
            <h2 className="text-lg font-bold text-ink">카테고리</h2>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {shopCategories.map((category) => (
              <span key={category} className="inline-flex min-h-10 shrink-0 items-center border border-line bg-soft px-3 text-sm font-bold text-ink">
                {category}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <SectionHeader title="인기 준비물" count={`${popularProducts.length}개`} />
          <div className="grid gap-2 lg:grid-cols-2">
            {popularProducts.map((product) => (
              <ShopProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <SectionHeader title="초보 추천 세트" count={`${shopSets.length}개`} actionHref="/shop/sets" actionLabel="전체보기" />
          <div className="grid gap-2 lg:grid-cols-2">
            {shopSets.map((set) => (
              <Link key={set.id} href={`/shop/sets#${set.id}`} className="block border border-line bg-white p-3 active:bg-amber-50">
                <div className="flex gap-3">
                  <IconFrame icon="briefcase" tone="work" size="md" />
                  <div className="min-w-0 flex-1">
                    <Badge tone="accent" icon="check">세트 구성</Badge>
                    <h3 className="mt-2 text-lg font-bold leading-[1.3] text-ink">{set.title}</h3>
                    <p className="mt-1 text-sm font-medium leading-5 text-muted">{set.subtitle}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {set.items.slice(0, 4).map((item) => (
                    <Badge key={item} tone="default" icon="tool">{item}</Badge>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <SectionHeader title="강의 연계 준비물" count={`${lessonLinkedProducts.length}개`} actionHref="/skills" actionLabel="강의 보기" />
          <div className="grid gap-2 lg:grid-cols-3">
            {lessonLinkedProducts.slice(0, 6).map((product) => (
              <ShopProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </section>

        <NoticeBox collapsible tone="warning" title="보호구 확인 안내">
          <p>안전화, 안전모, 마스크 등 보호구는 인증 제품 여부와 현장 기준을 직접 확인해야 합니다.</p>
          <p>JOBDAYSHOP은 현장 준비물 큐레이션이며, 제품 성능이나 현장 적합성을 대신 판단하지 않습니다.</p>
        </NoticeBox>
      </div>

      <aside className="hidden space-y-3 xl:block">
        <SidebarCard title="JOBDAYSHOP 운영 기준">
          <div className="space-y-2 p-3 text-sm font-medium leading-6 text-muted">
            <p className="text-base font-bold text-ink">결제 없이 추천/문의/준비중 중심으로 운영합니다.</p>
            <p>상품 주문과 배송 처리는 초기 MVP 범위에 넣지 않았습니다.</p>
          </div>
        </SidebarCard>

        <SidebarCard title="강의와 연결">
          <div className="divide-y divide-slate-200">
            <Link href="/skills/site-first-day-kit" className="block px-3 py-2 text-sm font-semibold leading-6 text-ink active:bg-amber-50">현장 첫날 준비물 강의</Link>
            <Link href="/skills/tile-helper-basic" className="block px-3 py-2 text-sm font-semibold leading-6 text-ink active:bg-amber-50">타일 보조 입문 강의</Link>
            <Link href="/skills" className="block px-3 py-2 text-sm font-semibold leading-6 text-ink active:bg-amber-50">JOBDAY 강의 전체</Link>
          </div>
        </SidebarCard>

        <SidebarCard title="커뮤니티 장터">
          <div className="space-y-2 p-3">
            <p className="text-sm font-medium leading-6 text-muted">중고 공구나 자재 거래는 JOBDAYSHOP이 아니라 이용자 간 장터에서 직접 확인합니다.</p>
            <ButtonLink href="/boards/tool-market" fullWidth>공구장터 보기</ButtonLink>
            <ButtonLink href="/boards/materials" fullWidth>자재거래 보기</ButtonLink>
          </div>
        </SidebarCard>
      </aside>
    </div>
  );
}
