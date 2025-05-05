import { useRef, useState, useEffect } from "react";
import { useDrop } from "react-dnd";

import { Ticket } from "../models/Ticket.js";
// import { GRID_ROWS as ROWS, GRID_COLS as COLS } from "../../config/config.js";

import { createEmptyTicket } from "./initTicket.js";
import { useTicketsModel } from "./useTickets.js";
import { useGridPosition } from "../views/useSnapToGrid.js";

import { useAuth } from "../../public/controller/useAuth.js";

/* -------------------------------------------------------------------------------------------------
 * 📦 基本レイアウト＆DOM参照制御
 * ------------------------------------------------------------------------------------------------- */

export const useMatrixRefAndSize = () => {
//   const matrixRef = useRef<HTMLDivElement>(null);
  // または ref の初期化時に null! を使う
  const matrixRef = useRef<HTMLDivElement>(null!);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (matrixRef.current) {
      const rect = matrixRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    }
  }, []);

  return { matrixRef, containerSize };
};

/* -------------------------------------------------------------------------------------------------
 * 🧭 グリッドスナップロジック（位置補正）
 * ------------------------------------------------------------------------------------------------- */

export const useMatrixGridSnap = () => {
  const { snapToGrid } = useGridPosition();
  return { snapToGrid };
};

/* -------------------------------------------------------------------------------------------------
 * 📝 編集モーダル状態管理
 * ------------------------------------------------------------------------------------------------- */

export const useMatrixEditor = () => {
  const [editingTicket, setEditingTicket] = useState<Partial<Ticket> | null>(null);
  const openEditor = (ticket: Partial<Ticket>) => setEditingTicket(ticket);
  const closeEditor = () => setEditingTicket(null);
  return { editingTicket, openEditor, closeEditor };
};

/* -------------------------------------------------------------------------------------------------
 * 💾 保存処理（新規 or 既存を自動判定）
 * ------------------------------------------------------------------------------------------------- */

export const useMatrixSave = () => {
  const { user } = useAuth();
  const { tickets, addTicket, updateTicket } = useTicketsModel(user?.uid ?? null);

  const saveTicket = (editingTicket: Partial<Ticket> | null, updated: Omit<Ticket, 'id'>) => {
    const existing = editingTicket?.id && tickets.find(t => t.id === editingTicket.id);
    if (existing) {
      updateTicket(editingTicket.id!, updated);
    } else {
      addTicket(updated);
    }
  };

  return { saveTicket, tickets, updateTicket};
};

/* -------------------------------------------------------------------------------------------------
 * 📥 DnD ドロップ処理制御
 * ------------------------------------------------------------------------------------------------- */

export const useMatrixDrop = (
  matrixRef: React.RefObject<HTMLDivElement>,
  _containerSize: { width: number; height: number }, // ← こうする
  updateTicket: (id: string, update: Partial<Ticket>) => void
) => {
  const { snapToGrid } = useGridPosition();

  const [, drop] = useDrop(() => ({
    accept: 'TICKET',
    drop: (item: Ticket, monitor) => {
    console.log('[DND] Drop item:', item);
      const clientOffset = monitor.getClientOffset();
      const element = matrixRef.current;
      if (!clientOffset || !element) return;

      const rect = element.getBoundingClientRect();
      const relativeX = clientOffset.x - rect.left;
      const relativeY = clientOffset.y - rect.top;

      const { x, y } = snapToGrid(relativeX, relativeY, rect.width, rect.height);
      console.log('[DND] updateTicket呼び出し:', item.id, { x, y });
      updateTicket(item.id, { x, y });
      return { dropped: true };
    }
  }));

  return { drop };
};

/* -------------------------------------------------------------------------------------------------
 * 🖱️ 空白セルクリックで新規チケット作成
 * ------------------------------------------------------------------------------------------------- */

export const useMatrixCreate = (
  matrixRef: React.RefObject<HTMLDivElement>,
  snapToGrid: ReturnType<typeof useGridPosition>['snapToGrid'],
  openEditor: (ticket: Ticket) => void
) => {
  const handleMatrixClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || !matrixRef.current) return;
    const rect = matrixRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    const { x, y } = snapToGrid(relativeX, relativeY, rect.width, rect.height);
    openEditor(createEmptyTicket(x, y));
  };

  return { handleMatrixClick };
};
