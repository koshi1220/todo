import { ReactNode } from "react";
import clsx from "clsx";

/**
 * AppLayout
 * - MatrixPage 専用レイアウト
 * - isDragging に応じて背景色を変更（DnD中は淡色化）
 */
interface AppLayoutProps {
  children: ReactNode;
  isDragging?: boolean; // DnD中かどうか（背景切り替えトリガー）
}

export const AppLayout = ({ children, isDragging = false }: AppLayoutProps) => {
  return (
    <div
      className={clsx(
        'min-h-screen transition-colors duration-300',
        isDragging ? 'bg-gray-100' : 'bg-white'
      )}
    >
      {children}
    </div>
  );
};
