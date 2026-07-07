import type { Region, Trade } from "@/types/domain";
import { Button, ButtonLink, FieldLabel, Icon, Input, Select } from "./design-system";

export type BoardFilterValues = {
  q?: string;
  region?: string;
  trade?: string;
  date?: string;
  status?: string;
  sort?: string;
  lodging?: string;
  beginner?: string;
  travel?: string;
  recruitingOnly?: string;
};

type Props = {
  action: string;
  values: BoardFilterValues;
  regions: Region[];
  trades: Trade[];
  showWorkFilters?: boolean;
};

function FilterCheck({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex min-h-11 items-center gap-2 rounded-sm border border-line-strong bg-field px-3 text-sm font-semibold text-ink">
      <input className="h-5 w-5 accent-amber-700" name={name} type="checkbox" value="1" defaultChecked={defaultChecked} />
      <span>{label}</span>
    </label>
  );
}

function FilterFields({
  values,
  regions,
  trades,
  showWorkFilters
}: {
  values: BoardFilterValues;
  regions: Region[];
  trades: Trade[];
  showWorkFilters: boolean;
}) {
  return (
    <>
      <div className="mt-2 grid gap-2 sm:grid-cols-4">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink">지역</span>
          <Select className="min-h-11 py-2" name="region" defaultValue={values.region ?? ""}>
            <option value="">전체 지역</option>
            {regions.map((region) => (
              <option key={region.id} value={region.name}>
                {region.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink">직종</span>
          <Select className="min-h-11 py-2" name="trade" defaultValue={values.trade ?? ""}>
            <option value="">전체 직종</option>
            {trades.map((trade) => (
              <option key={trade.id} value={trade.name}>
                {trade.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink">상태</span>
          <Select className="min-h-11 py-2" name="status" defaultValue={values.status ?? ""}>
            <option value="">전체 상태</option>
            <option value="recruiting">모집중</option>
            <option value="closed">마감</option>
          </Select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink">정렬</span>
          <Select className="min-h-11 py-2" name="sort" defaultValue={values.sort ?? "latest"}>
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
          </Select>
        </label>
      </div>

      {showWorkFilters ? (
        <div className="mt-2 flex flex-wrap gap-2">
          <label className="block min-w-[132px] flex-1 sm:max-w-[180px]">
            <span className="mb-1 block text-sm font-bold text-ink">날짜</span>
            <Select className="min-h-11 py-2" name="date" defaultValue={values.date ?? ""}>
              <option value="">전체 날짜</option>
              <option value="today">오늘</option>
              <option value="tomorrow">내일</option>
            </Select>
          </label>
          <FilterCheck name="recruitingOnly" label="모집중만" defaultChecked={values.recruitingOnly === "1"} />
          <FilterCheck name="lodging" label="숙소제공" defaultChecked={values.lodging === "1"} />
          <FilterCheck name="beginner" label="초보가능" defaultChecked={values.beginner === "1"} />
          <FilterCheck name="travel" label="원정가능" defaultChecked={values.travel === "1"} />
        </div>
      ) : null}
    </>
  );
}

function FilterActions({ action }: { action: string }) {
  return (
    <div className="mt-2 flex gap-2">
      <Button fullWidth type="submit" variant="warning">
        필터 적용
      </Button>
      <ButtonLink fullWidth href={action}>
        초기화
      </ButtonLink>
    </div>
  );
}

function SearchRow({ inputId, defaultValue }: { inputId: string; defaultValue?: string }) {
  return (
    <>
      <FieldLabel htmlFor={inputId} label="검색" />
      <div className="flex gap-2">
        <Input
          className="min-h-12 flex-1"
          id={inputId}
          type="search"
          name="q"
          placeholder="예: 평택 타일 18만 숙소"
          defaultValue={defaultValue ?? ""}
        />
        <Button className="shrink-0 px-4" type="submit" variant="primary" size="lg">
          <Icon name="search" className="mr-1.5 h-4 w-4" />
          찾기
        </Button>
      </div>
    </>
  );
}

export function BoardFilters({ action, values, regions, trades, showWorkFilters = false }: Props) {
  const hasFilter =
    Boolean(
      values.region ||
        values.trade ||
        values.date ||
        values.status ||
        values.lodging ||
        values.beginner ||
        values.travel ||
        values.recruitingOnly
    ) ||
    (values.sort && values.sort !== "latest");

  return (
    <div>
      <form action={action} className="board-panel p-2 sm:hidden">
        <SearchRow inputId="board-search-mobile" defaultValue={values.q} />
        <details className="mt-2 sm:hidden" open={hasFilter || Boolean(values.q)}>
          <summary className="min-h-11 cursor-pointer border border-line-strong bg-field px-3 py-2 text-sm font-semibold text-ink">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="filter" className="h-4 w-4 text-accent" />
              필터/정렬 {hasFilter ? "적용 중" : "열기"}
            </span>
          </summary>
          <FilterFields values={values} regions={regions} trades={trades} showWorkFilters={showWorkFilters} />
          <FilterActions action={action} />
        </details>
      </form>

      <form action={action} className="board-panel hidden p-2 sm:block">
        <SearchRow inputId="board-search-desktop" defaultValue={values.q} />
        <FilterFields values={values} regions={regions} trades={trades} showWorkFilters={showWorkFilters} />
        <FilterActions action={action} />
      </form>
    </div>
  );
}
