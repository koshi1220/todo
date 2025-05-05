import { useCallback } from "react";
import { GRID_ROWS as ROWS, GRID_COLS as COLS } from "../../config/config.js";

export const useGridPosition = () => {
  const snapToGrid = useCallback((relX: number, relY: number, width: number, height: number) => {
    const colWidth = width / COLS;
    const rowHeight = height / ROWS;

    const x = Math.max(0, Math.min(COLS - 1, Math.floor(relX / colWidth)));
    const y = Math.max(0, Math.min(ROWS - 1, Math.floor(relY / rowHeight)));

    return { x, y };
  }, []);

  return { snapToGrid };
};
