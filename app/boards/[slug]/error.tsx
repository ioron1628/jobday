"use client";

import { Button, ButtonLink, ErrorMessage } from "@/components/design-system";

export default function BoardDetailErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="board-panel space-y-3 p-4">
      <h1 className="text-2xl font-bold leading-[1.3] text-ink">글 목록을 불러오지 못했습니다</h1>
      <ErrorMessage tone="muted">검색 조건을 바꾸거나 잠시 후 다시 시도해주세요.</ErrorMessage>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="primary" onClick={() => reset()}>
          다시 시도
        </Button>
        <ButtonLink href="/boards" size="md">
          전체 게시판
        </ButtonLink>
      </div>
    </section>
  );
}
