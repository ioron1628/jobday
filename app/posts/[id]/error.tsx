"use client";

import { Button, ButtonLink, ErrorMessage } from "@/components/design-system";

export default function PostDetailErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="board-panel space-y-3 p-4">
      <h1 className="text-2xl font-bold leading-[1.3] text-ink">글을 불러오지 못했습니다</h1>
      <ErrorMessage tone="warning">글이 삭제됐거나 일시적으로 열리지 않을 수 있습니다. 잠시 후 다시 시도해주세요.</ErrorMessage>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="primary" onClick={() => reset()}>
          다시 시도
        </Button>
        <ButtonLink href="/boards" size="md">
          게시판 보기
        </ButtonLink>
        <ButtonLink href="/boards/work-raid" size="md">
          작업 구인 보기
        </ButtonLink>
      </div>
    </section>
  );
}
