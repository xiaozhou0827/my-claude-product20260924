import { useState } from 'react';
import type { Expense, Income, Budget } from '../types';
import { ExpenseRow, Modal, IncomeRow } from '../components/ui';

interface HomePageProps {
  expenses: Expense[];
  incomes: Income[];
  budget: Budget;
  user: { username: string; nickname: string };
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  onAddIncome: (income: Omit<Income, 'id' | 'createdAt'>) => void;
  onUpdateBudget: (budget: Partial<Budget>) => void;
  onLogout: () => void;
}

export default function HomePage({
  expenses,
  incomes,
  budget,
  user,
  onAddExpense,
  onAddIncome,
}: HomePageProps) {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const todayExpenses = expenses.filter(e => e.date === today);
  const monthExpenses = expenses.filter(e => {
    const date = new Date(e.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  const monthIncomes = incomes.filter(i => {
    const date = new Date(i.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const todayExpenseTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthExpenseTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthIncomeTotal = monthIncomes.reduce((sum, i) => sum + i.amount, 0);
  const remainingBudget = budget.monthlyLimit - monthExpenseTotal;
  const budgetProgress = budget.monthlyLimit > 0 ? (monthExpenseTotal / budget.monthlyLimit) * 100 : 0;

  const recentExpenses = expenses.slice(0, 5);
  const recentIncomes = incomes.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '上午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <div className="p-4 pb-28 space-y-4">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-500 text-sm">{getGreeting()} 👋</div>
          <div className="text-xl font-bold text-gray-800">{user.nickname || user.username}</div>
        </div>
        <div className="w-10 h-10 rounded-full shark-gradient flex items-center justify-center text-white font-bold text-lg shadow-md">
          {(user.nickname || user.username).charAt(0).toUpperCase()}
        </div>
      </div>

      {/* 月度概览卡片 - 鲨鱼风格 */}
      <div className="shark-gradient rounded-2xl p-5 text-white shadow-lg">
        <div className="text-sm opacity-90 mb-1">本月收支</div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-xs opacity-80">支出</div>
            <div className="text-2xl font-bold number-font">¥{monthExpenseTotal.toFixed(0)}</div>
          </div>
          <div>
            <div className="text-xs opacity-80">收入</div>
            <div className="text-2xl font-bold number-font">¥{monthIncomeTotal.toFixed(0)}</div>
          </div>
          <div>
            <div className="text-xs opacity-80">结余</div>
            <div className={`text-2xl font-bold number-font ${monthIncomeTotal >= monthExpenseTotal ? 'text-green-300' : 'text-orange-300'}`}>
              ¥{(monthIncomeTotal - monthExpenseTotal).toFixed(0)}
            </div>
          </div>
        </div>

        {/* 预算进度 */}
        <div className="border-t border-white/20 pt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="opacity-90">预算进度</span>
            <span className="font-semibold">{Math.min(Math.round(budgetProgress), 100)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.min(budgetProgress, 100)}%` }}
            />
          </div>
          <div className="text-xs opacity-75 mt-1">
            剩 ¥{remainingBudget.toFixed(0)} / ¥{budget.monthlyLimit}
          </div>
        </div>
      </div>

      {/* 今日支出卡片 */}
      <div className="card shark-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-sm">今日支出</div>
            <div className="text-3xl font-bold text-gray-800 number-font mt-1">¥{todayExpenseTotal.toFixed(2)}</div>
            <div className="text-xs text-gray-400 mt-1">{todayExpenses.length} 笔消费</div>
          </div>
          <div className="text-4xl">💰</div>
        </div>
      </div>

      {/* 快捷记账按钮 */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: '🍜', label: '餐饮', color: 'bg-orange-500' },
          { icon: '🚗', label: '交通', color: 'bg-blue-500' },
          { icon: '🛍️', label: '购物', color: 'bg-purple-500' },
          { icon: '🎮', label: '娱乐', color: 'bg-pink-500' },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => setShowExpenseModal(true)}
            className={`${item.color} text-white rounded-xl py-4 flex flex-col items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* 记收支按钮 */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowExpenseModal(true)}
          className="shark-btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <span>📤</span>
          <span>记支出</span>
        </button>
        <button
          onClick={() => setShowIncomeModal(true)}
          className="py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600 transition-all shadow-md active:scale-95"
        >
          <span>📥</span>
          <span>记收入</span>
        </button>
      </div>

      {/* 最近支出 */}
      <div className="card shark-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800">最近支出</h2>
          <span className="text-sm text-gray-400">{expenses.length} 笔</span>
        </div>
        {recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {recentExpenses.map(expense => (
              <ExpenseRow key={expense.id} expense={expense} onClick={() => {}} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📝</div>
            <div className="text-sm">暂无记录</div>
          </div>
        )}
      </div>

      {/* 最近收入 */}
      {recentIncomes.length > 0 && (
        <div className="card shark-card p-4">
          <h2 className="font-bold text-gray-800 mb-4">最近收入</h2>
          <div className="space-y-3">
            {recentIncomes.map(income => (
              <IncomeRow key={income.id} income={income} />
            ))}
          </div>
        </div>
      )}

      {/* 弹窗 */}
      <Modal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)}>
        <ExpenseForm onClose={() => setShowExpenseModal(false)} onAdd={onAddExpense} />
      </Modal>
      <Modal isOpen={showIncomeModal} onClose={() => setShowIncomeModal(false)}>
        <IncomeForm onClose={() => setShowIncomeModal(false)} onAdd={onAddIncome} />
      </Modal>
    </div>
  );
}

// 支出表单
function ExpenseForm({ onClose, onAdd }: { onClose: () => void; onAdd: (expense: any) => void }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Expense['category']>('餐饮');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Expense['paymentMethod']>('现金');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('请输入有效的金额');
      return;
    }
    onAdd({ amount: numAmount, category, date, note: note || undefined, paymentMethod });
    onClose();
  };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-gray-500 text-sm mb-2">记录支出</div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl text-gray-400">¥</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="text-5xl font-bold text-center bg-transparent outline-none text-gray-800 w-48 number-font"
            step="0.01"
            min="0"
            autoFocus
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <div className="text-sm text-gray-500 mb-3">选择分类</div>
          <div className="grid grid-cols-4 gap-3">
            {(['餐饮', '交通', '购物', '娱乐', '医疗', '教育', '居住', '其他'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                  category === cat
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">
                  {cat === '餐饮' && '🍜'}
                  {cat === '交通' && '🚗'}
                  {cat === '购物' && '🛍️'}
                  {cat === '娱乐' && '🎮'}
                  {cat === '医疗' && '💊'}
                  {cat === '教育' && '📚'}
                  {cat === '居住' && '🏠'}
                  {cat === '其他' && '📦'}
                </span>
                <span className="text-xs font-medium">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <div className="text-sm text-gray-500 mb-2">日期</div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-100 text-gray-800 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-2">支付方式</div>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as Expense['paymentMethod'])}
              className="w-full p-3 rounded-xl bg-gray-100 text-gray-800 outline-none focus:ring-2 focus:ring-blue-200"
            >
              {['现金', '微信', '支付宝', '信用卡', '其他'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-5">
          <div className="text-sm text-gray-500 mb-2">备注</div>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="添加备注（可选）"
            className="w-full p-3 rounded-xl bg-gray-100 text-gray-800 outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl shark-btn-primary text-white font-bold"
        >
          确认支出
        </button>
      </form>
    </div>
  );
}

// 收入表单
function IncomeForm({ onClose, onAdd }: { onClose: () => void; onAdd: (income: any) => void }) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('工资');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('请输入有效的金额');
      return;
    }
    onAdd({ amount: numAmount, source, date, note: note || undefined });
    onClose();
  };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-gray-500 text-sm mb-2">记录收入</div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl text-gray-400">¥</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="text-5xl font-bold text-center bg-transparent outline-none text-gray-800 w-48 number-font"
            step="0.01"
            min="0"
            autoFocus
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <div className="text-sm text-gray-500 mb-2">收入来源</div>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-100 text-gray-800 outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>

        <div className="mb-5">
          <div className="text-sm text-gray-500 mb-2">日期</div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-100 text-gray-800 outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>

        <div className="mb-5">
          <div className="text-sm text-gray-500 mb-2">备注</div>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="添加备注（可选）"
            className="w-full p-3 rounded-xl bg-gray-100 text-gray-800 outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all"
        >
          确认收入
        </button>
      </form>
    </div>
  );
}
