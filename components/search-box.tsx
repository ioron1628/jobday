import { Button, FieldLabel, Icon, Input } from "./design-system";

type Props = {
  action?: string;
  defaultValue?: string;
  label?: string;
  placeholder?: string;
  panel?: boolean;
  className?: string;
};

export function SearchBox({
  action,
  defaultValue,
  label = "빠른 검색",
  placeholder = "예: 울산 타일 18만 공구",
  panel = true,
  className
}: Props) {
  return (
    <form action={action} className={`${panel ? "board-panel p-2" : ""} ${className ?? ""}`.trim()}>
      <FieldLabel htmlFor="site-search" label={label} />
      <div className="flex gap-2">
        <Input
          className="flex-1"
          id="site-search"
          type="search"
          name="q"
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
        <Button className="shrink-0 px-4" variant="primary" size="lg" type="submit">
          <Icon name="search" className="mr-1.5 h-4 w-4" />
          찾기
        </Button>
      </div>
    </form>
  );
}
