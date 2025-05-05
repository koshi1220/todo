import { Ticket } from "@models/Ticket.js";

/**
 * createEmptyTicket
 *
 * 📌 チケット初期化関数
 * - 指定されたグリッド座標 (x, y) に新規チケットを初期化
 * - UUIDを自動採番
 * - タイトル・説明・期限などは空で生成
 *
 * 🎯 使用タイミング例:
 * - ユーザーがマトリクスの空白セルをクリックしたとき
 * - 初回ログイン後のチュートリアル導線（将来的に）
 * - 全チケット削除後の再作成導線（将来的に）
 *
 * 🔧 注意: 実際の表示・保存・編集は呼び出し元で行う（この関数は状態の初期構造を返すのみ）
 */
export function createEmptyTicket(x = 0, y = 0): Ticket {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    deadline: new Date().toISOString().slice(0, 10),
    x,
    y,
  };
}
