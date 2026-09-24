import { useState } from 'react';
import type { Expense } from '../types';
import { EmptyState } from '../components/ui';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const [filterCategory, setFilterCategory] = useState<string>('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const categories = ['全部', '餐饮', '交通', '购物', '娱乐', '医疗', '教育', '居住', '其他'];

  const filteredExpenses = expenses.filter(expense => {
    const matchCategory = filterCategory === '全部' || expense.category === filterCategory;
    const matchSearch = !searchTerm || expense.note?.includes(searchTerm) || expense.category.includes(searchTerm);
    const matchDate = !filterDate || expense.date === filterDate;
    return matchCategory && matchSearch && matchDate;
  });

  const groupedByDate = filteredExpenses.reduce((groups, expense) => {
    if (!groups[expense.date]) groups[expense.date] = [];
    groups[expense.date].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  return (
    <div className="p-4 pb-28">
      {/* 搜索栏 */}
      <div className="mb-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索账单..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm placeholder-gray-400"
          />
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="mb-4 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 日期筛选 */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setFilterDate('')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            !filterDate ? 'bg-green-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setFilterDate(today)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            filterDate === today ? 'bg-green-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          今天
        </button>
        <button
          onClick={() => setFilterDate(yesterday)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            filterDate === yesterday ? 'bg-green-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          昨天
        </button>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-2 rounded-full bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
        />
      </div>

      {/* 账单列表 */}
      {filteredExpenses.length === 0 ? (
        <EmptyState icon="📝" title="暂无账单" description="开始记录你的第一笔消费吧" />
      ) : (
        Object.entries(groupedByDate)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([date, items]) => (
            <div key={date} className="mb-6 animate-slide-up">
              <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="font-semibold text-gray-800">
                  {date === today ? '📅 今天' : date === yesterday ? '📅 昨天' : `📅 ${date}`}
                </h3>
                <span className="text-sm font-medium text-red-500 number-font">
                  ¥{items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                </span>
              </div>

              <div className="card shark-card overflow-hidden">
                {items.map(expense => (
                  <button
                    key={expense.id}
                    onClick={() => setSelectedExpense(expense)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                      style={{ backgroundColor: getCategoryColor(expense.category) }}
                    >
                      {expense.category}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate">{expense.category}</div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {expense.date} · {expense.paymentMethod}
                      </div>
                      {expense.note && (
                        <div className="text-xs text-gray-400 mt-0.5 truncate">{expense.note}</div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-red-500 text-lg number-font">
                        -¥{expense.amount.toFixed(2)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
      )}

      {/* 编辑弹窗 */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-red-100 mx-auto mb-4 flex items-center justify-center text-3xl">
                📝
              </div>
              <h3 className="text-xl font-bold text-gray-800">编辑记录</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">金额</div>
                <input
                  type="number"
                  defaultValue={selectedExpense.amount}
                  className="w-full p-3 rounded-xl bg-gray-100 text-gray-800 font-bold number-font"
                />
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">分类</div>
                <input
                  type="text"
                  defaultValue={selectedExpense.category}
                  className="w-full p-3 rounded-xl bg-gray-100 text-gray-800"
                />
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">备注</div>
                <input
                  type="text"
                  defaultValue={selectedExpense.note || ''}
                  className="w-full p-3 rounded-xl bg-gray-100 text-gray-800"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  onDelete(selectedExpense.id);
                  setSelectedExpense(null);
                }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
              >
                删除
              </button>
              <button
                onClick={() => setSelectedExpense(null)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    '餐饮': '#ff6b6b',
    '交通': '#4ecdc4',
    '购物': '#45b7d1',
    '娱乐': '#96ceb4',
    '医疗': '#ffeaa7',
    '教育': '#dfe6e9',
    '居住': '#a29bfe',
    '其他': '#fd79a8',
  };
  return colors[category] || '#999';
}
