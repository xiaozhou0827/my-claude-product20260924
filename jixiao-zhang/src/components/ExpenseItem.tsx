import type { Expense } from '../types';
import { useState } from 'react';
import { CATEGORY_COLORS } from '../types';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="flex items-center gap-3 p-4 bg-white rounded-2xl mb-3 shadow-sm hover:shadow-pink transition-shadow"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* 分类图标 */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
        style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
      >
        {expense.category[0]}
      </div>

      {/* 信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-main">{expense.category}</span>
          {expense.note && (
            <span className="text-xs text-text-sub truncate">{expense.note}</span>
          )}
        </div>
        <div className="text-xs text-text-sub mt-1">
          {expense.date} · {expense.paymentMethod}
        </div>
      </div>

      {/* 金额 */}
      <div className="text-right flex-shrink-0">
        <div className="font-bold text-rose">-¥{expense.amount.toFixed(2)}</div>
      </div>

      {/* 操作按钮 */}
      {showActions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(expense)}
            className="w-8 h-8 rounded-full bg-lavender/30 flex items-center justify-center text-text-sub hover:bg-lavender hover:text-white transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="w-8 h-8 rounded-full bg-coral/30 flex items-center justify-center text-text-sub hover:bg-coral hover:text-white transition-colors"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}
