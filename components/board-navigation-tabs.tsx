import Link from "next/link";
import type { Board } from "@/types/domain";
import { BoardIconFrame } from "./design-system";

const tabSlugs = ["work-raid", "remote-raid", "dimodo", "available-today", "tool-market", "materials", "beginner", "free"];

export function BoardNavigationTabs({ boards, currentSlug }: { boards: Board[]; currentSlug?: string }) {
  const visibleBoards = tabSlugs
    .map((slug) => boards.find((board) => board.slug === slug))
    .filter((board): board is Board => Boolean(board));

  if (!visibleBoards.length) return null;

  return (
    <nav className="border border-line bg-white" aria-label="주요 게시판 이동">
      <div className="flex gap-1 overflow-x-auto px-2 py-2">
        {visibleBoards.map((board) => {
          const active = board.slug === currentSlug;
          return (
            <Link
              key={board.id}
              href={`/boards/${board.slug}`}
              aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 border px-2.5 text-[13px] font-bold leading-tight active:translate-y-px sm:px-3 sm:text-sm ${
                active ? "border-accent bg-accent text-white" : "border-line bg-white text-ink active:bg-amber-50"
              }`}
            >
              <BoardIconFrame board={board} size="sm" className={active ? "!border-white/35 !bg-white/15 !text-white" : ""} />
              {board.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
