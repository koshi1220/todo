import React from "react";
import Modal from "../views/Modal.js";
import TicketForm from "../views/TicketForm.js";
import { Ticket } from "../models/Ticket.js";
import { useDragTicket } from "../controllers/useDragTicket.js";
import { useAuth } from "../../public/controller/useAuth.js"; // ← 追加
import { useNavigate } from "react-router-dom"; // ← 追加
// import { useTicketsModel } from "../controllers/useTickets.js";
import { useMatrixRefAndSize, useMatrixGridSnap, useMatrixEditor, useMatrixSave, useMatrixDrop, useMatrixCreate } from "../controllers/useMatrixController.js";
import { GRID_ROWS as ROWS, GRID_COLS as COLS } from "../../config/config.js";

/**
 * MatrixPageContent
 * - MatrixページのView構成本体
 * - useMatrixControllers によって提供される各責務を集約し描画
 * - 将来的に config による見た目調整・描画条件切り替えが可能
 */
const MatrixPageContent: React.FC = () => {
  /* ---------------------------- UI構成 / config（将来用） ---------------------------- */
  const showGridLines = true; // ← グリッドの線を表示するかどうか（今は常時ON）
  // const cellStyleOverride = {}; // ← セルのスタイルを外部から上書きする余地あり（未使用）
  // const { user } = useAuth(); // ✅ 追加
  // const { tickets, isLoading, addTicket } = useTicketsModel(user?.uid ?? null);
  /* ---------------------------- Matrix構成用の状態と参照 ---------------------------- */
  const { matrixRef, containerSize } = useMatrixRefAndSize(); // DOM参照とサイズ取得
  const { snapToGrid } = useMatrixGridSnap(); // 座標をグリッドにスナップ補正する処理
  const { editingTicket, openEditor, closeEditor } = useMatrixEditor(); // 編集モーダル用のチケット状態管理
  const { saveTicket, tickets, updateTicket } = useMatrixSave(); // チケットの保存・更新ロジック
  const { logout } = useAuth(); // ← 追加
  const navigate = useNavigate(); // ← 追加
  // 🔄 Drop 処理に渡す関数は updateTicket（既存のupdateのみ想定）
  const { drop } = useMatrixDrop(matrixRef, containerSize, updateTicket); // DnDによる位置更新処理

  // 🖱️ 空白セルクリック → 新規チケット作成トリガー
  const { handleMatrixClick } = useMatrixCreate(matrixRef, snapToGrid, openEditor);

  // 📐 セル1マスあたりの幅と高さ（Matrix描画基準）
  const cellWidth = containerSize.width / COLS;
  const cellHeight = containerSize.height / ROWS;

  const handleLogout = async () => {
    await logout();           // Firebaseからログアウト
    navigate('/');            // ランディングページへリダイレクト
  };

  drop(matrixRef); // refにDrop登録（DnD受け取り）

  const DraggableTicket: React.FC<{
    ticket: Ticket;
    cellWidth: number;
    cellHeight: number;
    left: number;
    top: number;
    onClick: () => void;
  }> = ({ ticket, cellWidth, cellHeight, left, top, onClick }) => {
    const { isDragging, refCallback } = useDragTicket(ticket);
  
    const style: React.CSSProperties = {
      position: 'absolute',
      left,
      top,
      width: cellWidth,
      height: cellHeight,
      backgroundColor: '#d6f5d6',
      border: '1px solid #aaa',
      borderRadius: '6px',
      padding: '0.5em',
      boxSizing: 'border-box',
      cursor: 'grab',
      opacity: isDragging ? 0.5 : 1,
    };
  
    return (
      <div ref={refCallback} style={style} onClick={onClick}>
        <span>{ticket.title}</span>
      </div>
    );
  };
  

  return (
                    
<div className="matrix-wrapper">
  {/* ✅ サインアウトボタン（右上に固定表示） */}
  <button
    onClick={handleLogout}
    style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      padding: '0.6rem 1rem',
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      zIndex: 1000,
    }}
  >
    ログアウト
  </button>

  <div
    ref={matrixRef}
    className="matrix-field"
    onClick={handleMatrixClick}
    style={{ position: 'relative', width: '100%', height: '100vh' }}
  >
    {/* 🔳 グリッドセルの描画 */}
    {showGridLines &&
      Array.from({ length: ROWS }).flatMap((_, row) =>
        Array.from({ length: COLS }).map((_, col) => (
          <div
            key={`cell-${row}-${col}`}
            style={{
              position: 'absolute',
              left: `${col * cellWidth}px`,
              top: `${row * cellHeight}px`,
              width: `${cellWidth}px`,
              height: `${cellHeight}px`,
              border: '1px solid #eee',
              pointerEvents: 'none',
            }}
          />
        ))
      )}



        {/* 🧾 チケット描画 */}
        {tickets.map((ticket) => (
          <DraggableTicket
            key={ticket.id}
            ticket={ticket}
            cellWidth={cellWidth}
            cellHeight={cellHeight}
            left={ticket.x * cellWidth}
            top={ticket.y * cellHeight}
            onClick={() => openEditor(ticket)}
          />
        ))}

        {/* 📝 チケット編集・作成モーダル */}
        <Modal isOpen={!!editingTicket} onClose={closeEditor}>
          {editingTicket && (
            <TicketForm
            ticket={editingTicket}
            onSave={(updated) => {
              saveTicket(editingTicket, updated);
              closeEditor();
            }}
            onCancel={closeEditor}
          />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default MatrixPageContent;
