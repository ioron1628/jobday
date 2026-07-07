import { GUARDRAIL_NOTICE, MARKET_BOARD_SLUGS, MARKET_NOTICE, SHORT_MARKET_NOTICE, SHORT_WORK_NOTICE, WORK_BOARD_SLUGS } from "@/lib/constants";
import { NoticeBox } from "./design-system";

type Props = {
  boardSlug?: string | null;
  marketOnly?: boolean;
  collapsible?: boolean;
  compact?: boolean;
};

export function LegalNotice({ boardSlug, marketOnly = false, collapsible = false, compact = false }: Props) {
  const isWork = boardSlug ? WORK_BOARD_SLUGS.includes(boardSlug) : false;
  const isMarket = marketOnly || (boardSlug ? MARKET_BOARD_SLUGS.includes(boardSlug) : false);

  if (!isWork && !isMarket) return null;

  const content = (
    <>
      {isWork ? <p>{compact ? SHORT_WORK_NOTICE : GUARDRAIL_NOTICE}</p> : null}
      {isMarket ? <p className={isWork ? "mt-2" : ""}>{compact ? SHORT_MARKET_NOTICE : MARKET_NOTICE}</p> : null}
    </>
  );

  if (collapsible) {
    return (
      <NoticeBox collapsible tone="warning" title="조건 확인 안내">
        {content}
      </NoticeBox>
    );
  }

  return (
    <NoticeBox tone="warning" title={compact ? "확인 안내" : "조건 확인 안내"}>
      {content}
    </NoticeBox>
  );
}
