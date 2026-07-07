"use client";

import { Button, ButtonLink, ErrorMessage } from "@/components/design-system";

export default function BoardsErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="board-panel space-y-3 p-4">
      <h1 className="text-2xl font-bold leading-[1.3] text-ink">게시판을 불러오지 못했습니다</h1>
      <ErrorMessage tone="muted">잠시 후 다시 시도하거나 홈에서 다른 게시판을 확인해보세요.</ErrorMessage>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="primary" onClick={() => reset()}>
          다시 시도
        </Button>
        <ButtonLink href="/" size="md">
          홈으로 이동
        </ButtonLink>
      </div>
    </section>
  );
}
