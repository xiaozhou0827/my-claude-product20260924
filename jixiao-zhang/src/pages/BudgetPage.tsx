import type { Expense, Budget, Category } from '../types';
import { useState } from 'react';

interface BudgetPageProps {
  expenses: Expense[];
  budget: Budget;
  onUpdateBudget: (budget: Partial<Budget>) => void;
}

export default function BudgetPage({ expenses, budget, onUpdateBudget }: BudgetPageProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryBudget, setCategoryBudget] = useState('');

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthExpenses = expenses.filter(e => {
    const date = new Date(e.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalExpense = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget.monthlyLimit - totalExpense;
  const progress = Math.min((totalExpense / budget.monthlyLimit) * 100, 100);

  const categorySpending = monthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<Category, number>);

  const handleCategoryBudgetChange = (category: Category, value: string) => {
    const numValue = parseFloat(value) || 0;
    onUpdateBudget({
      categoryLimits: {
        ...budget.categoryLimits,
        [category]: numValue,
      },
    });
  };

  const getBudgetColor = (used: number, limit: number) => {
    const percentage = limit > 0 ? (used / limit) * 100 : 0;
    if (percentage >= 100) return '#FF8B94';
    if (percentage >= 80) return '#FFEAA7';
    return '#A8E6CF';
  };

  return (
    <div className="p-4 pb-28 space-y-6">
      {/* 顶部标题 */}
      <div>
        <h1 className="text-2xl font-bold text-text-main">预算管理</h1>
        <p className="text-text-sub text-sm mt-1">合理规划，理性消费</p>
      </div>

      {/* 月度预算卡片 */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-text-sub">本月预算</div>
            <div className="text-3xl font-bold text-text-main number-font">
              ¥{budget.monthlyLimit.toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => {
              const newLimit = prompt('请输入新的月度预算:', budget.monthlyLimit.toString());
              if (newLimit && !isNaN(parseFloat(newLimit))) {
                onUpdateBudget({ monthlyLimit: parseFloat(newLimit) });
              }
            }}
            className="px-4 py-2 rounded-xl bg-sakura-light text-sakura-deep text-sm font-medium hover:bg-sakura/30 transition-colors"
          >
            编辑
          </button>
        </div>

        {/* 进度条 */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-sub">已使用 {progress.toFixed(1)}%</span>
            <span className="font-medium text-text-main number-font">
              ¥{totalExpense.toFixed(0)} / ¥{budget.monthlyLimit}
            </span>
          </div>
          <div className="h-4 bg-sakura-light rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 gradient-sakura"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 剩余预算 */}
        <div className={`p-4 rounded-2xl ${remaining >= 0 ? 'bg-mint/20' : 'bg-coral/20'}`}>
          <div className="text-sm text-text-sub mb-1">本月剩余</div>
          <div className={`text-2xl font-bold number-font ${remaining >= 0 ? 'text-mint-deep' : 'text-coral'}`}>
            ¥{remaining.toFixed(2)}
          </div>
        </div>
      </div>

      {/* 分类预算 */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-text-main mb-4">分类预算</h2>
        <div className="space-y-4">
          {(['餐饮', '交通', '购物', '娱乐', '医疗', '教育', '居住', '其他'] as Category[]).map(category => {
            const spent = categorySpending[category] || 0;
            const limit = budget.categoryLimits[category] || 0;
            const categoryProgress = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-text-main font-medium">{category}</span>
                    {limit > 0 && (
                      <span className="text-xs text-text-sub number-font">
                        ¥{spent.toFixed(0)} / ¥{limit.toFixed(0)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setCategoryBudget(limit.toString());
                    }}
                    className="text-xs text-sakura-deep hover:text-sakura font-medium px-3 py-1 rounded-full hover:bg-sakura-light/50 transition-colors"
                  >
                    {limit > 0 ? '修改' : '设置'}
                  </button>
                </div>
                {limit > 0 && (
                  <div className="h-2 bg-sakura-light rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${categoryProgress}%`,
                        backgroundColor: getBudgetColor(spent, limit),
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 预算提示 */}
      <div className="card p-4 flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <div>
          <div className="text-sm font-medium text-text-main">预算小贴士</div>
          <div className="text-xs text-text-sub mt-1">建议将支出控制在预算的80%以内，留出应急资金</div>
        </div>
      </div>

      {/* 分类预算编辑弹窗 */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm animate-scale-in">
            <h3 className="text-xl font-bold text-text-main mb-4">
              设置 {editingCategory} 预算
            </h3>
            <input
              type="number"
              value={categoryBudget}
              onChange={(e) => setCategoryBudget(e.target.value)}
              className="w-full p-4 rounded-2xl bg-sakura-light/50 text-text-main text-center text-2xl font-bold number-font mb-4 focus:outline-none focus:ring-2 focus:ring-sakura"
              placeholder="输入预算金额"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (editingCategory && categoryBudget) {
                    handleCategoryBudgetChange(editingCategory, categoryBudget);
                    setEditingCategory(null);
                  }
                }}
                className="flex-1 py-3 rounded-2xl gradient-sakura text-white font-bold hover:opacity-90 transition-opacity"
              >
                确定
              </button>
              <button
                onClick={() => setEditingCategory(null)}
                className="flex-1 py-3 rounded-2xl bg-sakura-light text-text-main font-bold hover:bg-sakura/30 transition-colors"
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
