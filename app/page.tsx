import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { Badge, BoardIconFrame, ButtonLink, CompactEmptyState, EmptyState, NoticeBox, QuickMenuButton, SectionHeader, SidebarCard } from "@/components/design-system";
import { PostCard } from "@/components/post-card";
import { SearchBox } from "@/components/search-box";
import { getBoards, getNotices, getPosts, getRegions } from "@/lib/data";
import { SHORT_MARKET_NOTICE, SHORT_WORK_NOTICE } from "@/lib/constants";
import { formatDate, isActiveUntil } from "@/lib/format";
import type { Board, Notice, Post, Region } from "@/types/domain";

export const dynamic = "force-dynamic";

const homeSections = [
  { title: "오늘/내일 급한 작업레이드", slug: "work-raid", href: "/boards/work-raid", sort: "latest" },
  { title: "원정레이드", slug: "remote-raid", href: "/boards/remote-raid", sort: "latest" },
  { title: "보조 급구", slug: "dimodo", href: "/boards/dimodo", sort: "latest" },
  { title: "오늘 일당 가능", slug: "available-today", href: "/boards/available-today", sort: "latest" },
  { title: "공구장터 최신글", slug: "tool-market", href: "/boards/tool-market", sort: "latest" },
  { title: "자재나눔거래", slug: "materials", href: "/boards/materials", sort: "latest" },
  { title: "현장자유 인기글", slug: "free", href: "/boards/free", sort: "popular" },
  { title: "초보입문 인기글", slug: "beginner", href: "/boards/beginner", sort: "popular" }
] as const;

const priorityBoards = [
  { href: "/boards/work-raid", title: "작업레이드", body: "오늘·내일 급한 현장", primary: true, icon: "lightning", tone: "work" },
  { href: "/boards/dimodo", title: "보조구함", body: "보조·조공 모집", primary: true, icon: "people", tone: "work" },
  { href: "/boards/tool-market", title: "공구장터", body: "판매·대여·교환", primary: false, icon: "tool", tone: "market" },
  { href: "/boards/free", title: "현장자유", body: "잡담·현장 후기", primary: false, icon: "board", tone: "default" }
] as const;

const entryCards = [
  { href: "/boards/work-raid", title: "일 찾는 사람", body: "오늘 작업과 원정글 보기", icon: "lightning", tone: "work" },
  { href: "/boards/work-raid/new", title: "사람 구하는 사람", body: "조건 적고 모집글 올리기", icon: "people", tone: "work" },
  { href: "/boards/tool-market", title: "공구/자재 거래", body: "공구장터와 자재글 확인", icon: "tool", tone: "market" },
  { href: "/boards/beginner", title: "현장 초보", body: "준비물과 질문부터 보기", icon: "flag", tone: "guide" }
] as const;

function popularityScore(post: Post) {
  return post.up_count * 4 + post.comment_count * 3 + post.view_count;
}

function sectionPosts(posts: Post[], section: (typeof homeSections)[number]) {
  const filteredPosts = posts.filter((post) => post.board?.slug === section.slug);
  if (section.sort !== "popular") {
    return [...filteredPosts].sort((a, b) => {
      const promotedDiff =
        Number(isActiveUntil(b.pinned_until)) +
        Number(isActiveUntil(b.urgent_until)) -
        (Number(isActiveUntil(a.pinned_until)) + Number(isActiveUntil(a.urgent_until)));
      if (promotedDiff !== 0) return promotedDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  return [...filteredPosts].sort((a, b) => {
    const scoreDiff = popularityScore(b) - popularityScore(a);
    if (scoreDiff !== 0) return scoreDiff;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

function HomePostSection({
  title,
  href,
  posts,
  limit = 3,
  featured = false
}: {
  title: string;
  href: string;
  posts: Post[];
  limit?: number;
  featured?: boolean;
}) {
  return (
    <section className={`border bg-white ${featured ? "border-accent" : "border-line"}`}>
      <SectionHeader title={title} actionHref={href} actionLabel="더보기" />
      {posts.length ? (
        <div>
          {posts.slice(0, limit).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="p-2">
          <CompactEmptyState title={`${title} 글이 없습니다`} body="첫 글이 올라오면 이곳에 바로 보입니다." href={href} actionLabel="게시판 보기" />
        </div>
      )}
    </section>
  );
}

function HomeHero({ q }: { q: string }) {
  return (
    <section className="space-y-3 border border-line bg-white p-3">
      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <SearchBox
          defaultValue={q}
          label="검색"
          placeholder="지역, 직종, 공구, 자재를 검색하세요"
          panel={false}
        />
        <ButtonLink className="hidden shrink-0 px-5 lg:inline-flex" href="/write" variant="primary" size="lg">
          글쓰기
        </ButtonLink>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {priorityBoards.map((item) => (
          <QuickMenuButton
            key={item.href}
            href={item.href}
            title={item.title}
            body={item.body}
            icon={item.icon}
            tone={item.tone}
            primary={item.primary}
            className="min-h-[66px]"
          />
        ))}
      </div>

      <section className="border border-line bg-soft p-2">
        <div className="mb-2 flex items-center justify-between gap-2 px-1">
          <p className="text-sm font-bold leading-5 text-ink">처음 오셨다면</p>
          <span className="text-[12px] font-medium leading-5 text-muted">필요한 곳으로 바로 이동</span>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {entryCards.map((item) => (
            <QuickMenuButton key={item.href} href={item.href} title={item.title} body={item.body} icon={item.icon} tone={item.tone} />
          ))}
        </div>
      </section>

      <ButtonLink className="lg:hidden" fullWidth href="/write" variant="primary" size="lg">
        글쓰기
      </ButtonLink>
    </section>
  );
}

function HomeBillboard() {
  return (
    <section className="border border-line bg-white">
      <div className="flex min-h-11 items-center justify-between gap-3 border-b border-line bg-soft px-3 py-2">
        <div className="flex items-center gap-2">
          <Badge tone="warning" icon="megaphone">광고판</Badge>
          <p className="text-base font-bold leading-5 text-ink">상단고정·업체 안내</p>
        </div>
        <span className="hidden text-sm font-medium text-muted sm:inline">운영자 수동 노출</span>
      </div>
      <div className="p-2">
        <AdSlot placement="home_top" label="작업 모집·업체 광고 자리" />
      </div>
      <p className="border-t border-line px-3 py-2 text-[12px] font-medium leading-5 text-muted">
        광고와 작업 조건은 이용자끼리 직접 확인합니다.
      </p>
    </section>
  );
}

function HomeBoardShortcuts({ boards }: { boards: Board[] }) {
  return (
    <section className="space-y-2">
      <SectionHeader title="게시판 바로가기" count={`${boards.length}개`} actionHref="/boards" actionLabel="전체보기" />
      <div className="grid grid-cols-3 border-l border-t border-line bg-white sm:grid-cols-4">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/boards/${board.slug}`}
            className="flex min-h-11 items-center gap-1.5 border-b border-r border-line px-2 py-2 text-sm font-semibold leading-5 text-ink active:bg-amber-50 sm:text-base"
          >
            <BoardIconFrame board={board} size="sm" />
            {board.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

function NoticePreview({ notices }: { notices: Notice[] }) {
  return (
    <section className="border border-line bg-white">
      <SectionHeader title="공지사항" actionHref="/notices" actionLabel="더보기" />
      {notices.length ? (
        <div className="divide-y divide-slate-200">
          {notices.slice(0, 3).map((notice) => (
            <Link key={notice.id} href="/notices" className="block px-3 py-2 active:bg-amber-50">
              <p className="line-clamp-1 text-base font-semibold leading-6 text-ink">{notice.title}</p>
              <p className="mt-1 line-clamp-1 text-sm font-medium leading-5 text-muted">{notice.body}</p>
              <p className="mt-1 text-[12px] font-medium leading-4 text-muted">{formatDate(notice.created_at)}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-2">
          <CompactEmptyState title="등록된 공지가 없습니다" body="운영 공지가 올라오면 이곳에서 확인할 수 있습니다." href="/notices" actionLabel="공지 보기" icon="notice" />
        </div>
      )}
    </section>
  );
}

function RegionShortcuts({ regions }: { regions: Region[] }) {
  const visibleRegions = regions.slice(0, 12);

  return (
    <SidebarCard title="지역별 바로가기" actionHref="/boards/work-raid" actionLabel="작업보기">
      <div className="flex flex-wrap gap-1.5 p-3">
        {visibleRegions.map((region) => (
          <Link
            key={region.id}
            href={`/boards/work-raid?region=${encodeURIComponent(region.name)}`}
            className="inline-flex min-h-9 items-center border border-line bg-white px-2 text-sm font-semibold text-ink active:bg-amber-50"
          >
            {region.name}
          </Link>
        ))}
      </div>
    </SidebarCard>
  );
}

function HomeGuardrailNotice() {
  return (
    <NoticeBox collapsible tone="warning" title="조건 확인 안내">
      <p>{SHORT_WORK_NOTICE}</p>
      <p>{SHORT_MARKET_NOTICE}</p>
    </NoticeBox>
  );
}

function BeginnerGuideCard() {
  return (
    <SidebarCard title="초보입문 가이드" actionHref="/boards/beginner" actionLabel="보기">
      <div className="divide-y divide-slate-200">
        <Link href="/boards/beginner" className="block px-3 py-2 text-sm font-semibold leading-6 text-ink active:bg-amber-50">
          처음 현장 갈 때 준비물
        </Link>
        <Link href="/boards/questions" className="block px-3 py-2 text-sm font-semibold leading-6 text-ink active:bg-amber-50">
          일당·숙소·교통비 질문
        </Link>
        <Link href="/community-rules" className="block px-3 py-2 text-sm font-semibold leading-6 text-ink active:bg-amber-50">
          허위 구인글 신고 기준
        </Link>
      </div>
    </SidebarCard>
  );
}

function CommercialSlot() {
  return (
    <>
      <SidebarCard title="상단고정 자리">
        <div className="border border-dashed border-line bg-soft p-3">
          <Badge tone="warning" icon="pin">상단고정</Badge>
          <p className="mt-2 text-sm font-medium leading-5 text-ink">급한 작업레이드와 업체 안내를 운영자가 수동 노출합니다.</p>
          <p className="mt-1 text-[12px] font-medium leading-5 text-muted">결제 버튼 없이 베타 운영자가 직접 등록합니다.</p>
        </div>
      </SidebarCard>
      <AdSlot placement="tool_market_sponsor" label="공구상 추천 스폰서 자리" />
      <AdSlot placement="workwear_safety_sponsor" label="작업복/안전화 스폰서 자리" />
      <AdSlot placement="beginner_guide_sponsor" label="초보입문 가이드 후원 자리" />
    </>
  );
}

export default async function HomePage({
  searchParams
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams?.q ?? "";
  const [boards, posts, notices, regions] = await Promise.all([
    getBoards(),
    getPosts({ search: q, limit: 80 }),
    getNotices(),
    getRegions()
  ]);
  const urgentSections = homeSections.slice(0, 4);
  const marketSections = homeSections.slice(4, 6);
  const communitySections = homeSections.slice(6);

  return (
    <div className="space-y-3 xl:grid xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-4 xl:space-y-0">
      <div className="space-y-3">
        <HomeHero q={q} />

        {q ? (
          <section className="border border-line bg-white">
            <SectionHeader title="검색 결과" actionHref="/write" actionLabel="글쓰기" />
            {posts.length ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="p-2">
                <EmptyState title="검색 결과가 없습니다" body="지역, 직종, 공구명처럼 더 짧게 검색하거나 게시판을 둘러보세요." href="/boards" actionLabel="게시판 보기" />
              </div>
            )}
          </section>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-3 lg:grid-cols-2">
              {urgentSections.slice(0, 2).map((section) => (
                <HomePostSection
                  key={section.slug}
                  title={section.title}
                  href={section.href}
                  posts={sectionPosts(posts, section)}
                  limit={4}
                  featured={section.slug === "work-raid"}
                />
              ))}
            </div>

            <HomeBillboard />

            <div className="grid gap-3 lg:grid-cols-2">
              {urgentSections.slice(2).map((section) => (
                <HomePostSection
                  key={section.slug}
                  title={section.title}
                  href={section.href}
                  posts={sectionPosts(posts, section)}
                />
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              {marketSections.map((section) => (
                <HomePostSection
                  key={section.slug}
                  title={section.title}
                  href={section.href}
                  posts={sectionPosts(posts, section)}
                />
              ))}
            </div>

            <HomeBoardShortcuts boards={boards} />

            <div className="grid gap-3 lg:grid-cols-2">
              {communitySections.map((section) => (
                <HomePostSection
                  key={section.slug}
                  title={section.title}
                  href={section.href}
                  posts={sectionPosts(posts, section)}
                />
              ))}
            </div>

            <div className="xl:hidden">
              <NoticePreview notices={notices} />
            </div>
            <div className="xl:hidden">
              <HomeGuardrailNotice />
            </div>
          </div>
        )}
      </div>

      <aside className="hidden space-y-3 xl:block">
        <NoticePreview notices={notices} />

        <SidebarCard title="게시판 바로가기">
          <div className="divide-y divide-slate-200">
            {boards.map((board) => (
              <Link key={board.id} href={`/boards/${board.slug}`} className="block px-3 py-2 text-base font-semibold text-ink active:bg-amber-50">
                <span className="inline-flex items-center gap-2">
                  <BoardIconFrame board={board} size="sm" />
                  {board.name}
                </span>
              </Link>
            ))}
          </div>
        </SidebarCard>

        <BeginnerGuideCard />

        <CommercialSlot />

        <RegionShortcuts regions={regions} />

        <HomeGuardrailNotice />
      </aside>
    </div>
  );
}
