import { ButtonLink, Icon, NoticeBox } from "@/components/design-system";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-3 py-8">
      <section className="w-full border border-line-strong bg-white p-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center border border-line bg-soft text-accent">
            <Icon name="question" className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-accent">404</p>
            <h1 className="mt-1 text-2xl font-bold leading-[1.3] text-ink">페이지를 찾을 수 없습니다</h1>
            <p className="mt-2 text-base font-medium leading-7 text-muted">
              글이 삭제됐거나 주소가 바뀌었을 수 있습니다. 아래 버튼으로 다시 이동해보세요.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <ButtonLink href="/" variant="primary" size="lg" fullWidth>
            홈으로 이동
          </ButtonLink>
          <ButtonLink href="/listen" size="lg" fullWidth>
            방송 듣기
          </ButtonLink>
          <ButtonLink href="/occupations" size="lg" fullWidth>
            직업 찾기
          </ButtonLink>
        </div>

        <NoticeBox className="mt-4" tone="muted">
          <p>주소를 직접 입력했다면 철자가 맞는지 한 번 더 확인해주세요.</p>
        </NoticeBox>
      </section>
    </main>
  );
}
