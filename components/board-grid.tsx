import type { Board } from "@/types/domain";
import { BoardListItem } from "./design-system";

export function BoardGrid({ boards }: { boards: Board[] }) {
  return (
    <div className="grid grid-cols-2 border-l border-t border-line bg-white sm:grid-cols-3">
      {boards.map((board) => (
        <BoardListItem key={board.id} board={board} />
      ))}
    </div>
  );
}
