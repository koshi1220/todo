import React from "react";

/**
 * 汎用モーダルコンポーネント
 *
 * - `isOpen` が true のときのみ表示
 * - 背景クリックでモーダルを閉じる（`onClick` で `onClose` 呼び出し）
 * - モーダル内のクリックは伝播を止めて閉じないようにしている
 *
 * 📌 今後の拡張候補:
 * - React Portal化（DOMのルート直下に描画）
 * - フェードイン/アウトのアニメーション（framer-motion等）
 * - フォーカストラップ（Tabキーがモーダル外に出ないようにする）
 * - モバイル対応のレスポンシブ最適化
 */
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '10px',
          width: '90%',
          maxWidth: '400px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じない
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
