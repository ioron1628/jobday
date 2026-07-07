"use client";

import { Button, ButtonLink, ErrorMessage, Icon } from "@/components/design-system";

export default function ErrorPage({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="board-panel space-y-3 p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-line bg-soft text-accent">
          <Icon name="warning" className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold leading-[1.3] text-ink">화면을 불러오지 못했습니다</h1>
          <p className="mt-1 text-base font-medium leading-6 text-muted">잠시 후 다시 시도하거나 게시판으로 이동해보세요.</p>
        </div>
      </div>
      <ErrorMessage tone="warning">일시적인 문제일 수 있습니다. 입력하던 내용이 있다면 새로고침 전에 한 번 확인해주세요.</ErrorMessage>
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" size="lg" type="button" onClick={() => reset()}>
          다시 시도
        </Button>
        <ButtonLink href="/boards" size="lg">
          게시판 보기
        </ButtonLink>
      </div>
    </div>
  );
}
