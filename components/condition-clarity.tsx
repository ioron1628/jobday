import { Badge, Icon } from "@/components/design-system";
import { asText } from "@/lib/format";

type ClarityItem = {
  label: string;
  value: unknown;
};

function hasValue(value: unknown) {
  return asText(value) !== "-";
}

export function ConditionClarity({ items }: { items: ClarityItem[] }) {
  const filledCount = items.filter((item) => hasValue(item.value)).length;
  const totalCount = items.length;
  const percent = totalCount ? Math.round((filledCount / totalCount) * 100) : 0;
  const isComplete = filledCount === totalCount;

  return (
    <section className="border-t border-line-strong bg-white px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold leading-6 text-ink">조건 명확도</h2>
          <p className="text-sm font-medium leading-5 text-muted">핵심 조건이 얼마나 채워졌는지 보여줍니다.</p>
        </div>
        <Badge tone={isComplete ? "success" : "warning"} icon={isComplete ? "check" : "warning"} className="font-bold">
          {filledCount}/{totalCount}
        </Badge>
      </div>
      <div className="mt-3 h-2 overflow-hidden bg-soft">
        <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {items.map((item) =>
          hasValue(item.value) ? (
            <Badge key={item.label} tone="success" icon="check">
              {item.label}
            </Badge>
          ) : (
            <Badge key={item.label} tone="muted" icon="warning">
              {item.label} 확인필요
            </Badge>
          )
        )}
      </div>
      {!isComplete ? (
        <p className="mt-2 flex items-start gap-1.5 text-sm font-medium leading-6 text-muted">
          <Icon name="notice" className="mt-1 h-3.5 w-3.5" />
          <span>비어 있는 조건은 댓글이나 연락으로 작성자와 직접 확인하세요.</span>
        </p>
      ) : null}
    </section>
  );
}
