import { useState } from 'react';
import type { Expense, Income, Budget, User } from './types';
import { useAuth } from './hooks/useAuth';
import LoginForm from './pages/LoginForm';
import HomePage from './pages/HomePage';
import ExpenseList from './pages/ExpenseList';
import StatsPage from './pages/StatsPage';
import BudgetPage from './pages/BudgetPage';
import { TabBar } from './components/ui';

type TabType = 'home' | 'expenses' | 'stats' | 'budget' | 'profile';

export default function App() {
  const { getCurrentUser, logout, getStoredData, saveData } = useAuth();
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setActiveTab('home');
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setActiveTab('home');
  };

  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // 获取当前用户数据
  const userData = getStoredData(user.username);
  const { expenses, incomes, budget } = userData;

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpenses = [
      { ...expense, id: Date.now().toString(), createdAt: Date.now() },
      ...expenses,
    ];
    saveData(user.id, { ...userData, expenses: newExpenses });
  };

  const addIncome = (income: Omit<Income, 'id' | 'createdAt'>) => {
    const newIncomes = [
      { ...income, id: Date.now().toString(), createdAt: Date.now() },
      ...incomes,
    ];
    saveData(user.username, { ...userData, incomes: newIncomes });
  };

  const deleteExpense = (id: string) => {
    const newExpenses = expenses.filter(e => e.id !== id);
    saveData(user.id, { ...userData, expenses: newExpenses });
  };

  const updateBudget = (updatedBudget: Partial<Budget>) => {
    saveData(user.username, { ...userData, budget: { ...budget, ...updatedBudget } });
  };

  const clearAllData = () => {
    saveData(user.username, {
      user,
      expenses: [],
      incomes: [],
      budget: { monthlyLimit: 3000, categoryLimits: {} as Record<string, number> },
    });
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 glass border-b border-divider">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">记小账</h1>
            <p className="text-xs text-text-sub mt-0.5">{user.nickname || user.username}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-white text-text-sub text-sm font-medium hover:bg-coral/10 hover:text-coral transition-colors shadow-sm"
            >
              退出
            </button>
            <div className="w-10 h-10 rounded-2xl gradient-sakura flex items-center justify-center text-white text-lg shadow-lg">
              😊
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-lg mx-auto">
        {activeTab === 'home' && (
          <HomePage
            expenses={expenses}
            incomes={incomes}
            budget={budget}
            user={{ username: user.username, nickname: user.nickname }}
            onAddExpense={addExpense}
            onAddIncome={addIncome}
            onUpdateBudget={updateBudget}
            onLogout={handleLogout}
          />
        )}
        {activeTab === 'expenses' && (
          <ExpenseList
            expenses={expenses}
            onDelete={deleteExpense}
          />
        )}
        {activeTab === 'stats' && <StatsPage expenses={expenses} incomes={incomes} />}
        {activeTab === 'budget' && (
          <BudgetPage
            expenses={expenses}
            budget={budget}
            onUpdateBudget={updateBudget}
          />
        )}
        {activeTab === 'profile' && (
          <ProfilePage
            user={user}
            onClearData={clearAllData}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* 底部导航栏 */}
      <TabBar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as TabType)} />
    </div>
  );
}

// 个人中心页面
function ProfilePage({ user, onClearData, onLogout }: {
  user: User;
  onClearData: () => void;
  onLogout: () => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="p-4 pb-28 space-y-6">
      {/* 用户信息卡片 */}
      <div className="card p-6 text-center">
        <div className="w-24 h-24 rounded-3xl gradient-sakura mx-auto mb-4 flex items-center justify-center text-5xl shadow-xl">
          😊
        </div>
        <h2 className="text-xl font-bold text-text-main">{user.nickname || user.username}</h2>
        <p className="text-text-sub text-sm mt-1">@{user.username}</p>
        <p className="text-text-sub text-xs mt-2">
          注册时间：{new Date(user.createdAt).toLocaleDateString()}
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-text-main number-font">128</div>
            <div className="text-xs text-text-sub mt-1">总笔数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose number-font">¥3,280</div>
            <div className="text-xs text-text-sub mt-1">总支出</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-mint-deep number-font">¥8,500</div>
            <div className="text-xs text-text-sub mt-1">总收入</div>
          </div>
        </div>
      </div>

      {/* 设置选项 */}
      <div className="card overflow-hidden">
        <button className="w-full flex items-center justify-between p-4 hover:bg-sakura-light/20 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-sakura-light/50 flex items-center justify-center text-xl">
              ✏️
            </div>
            <div className="text-left">
              <div className="font-medium text-text-main">编辑资料</div>
              <div className="text-xs text-text-sub">修改昵称和头像</div>
            </div>
          </div>
          <span className="text-text-sub">›</span>
        </button>

        <div className="h-px bg-divider mx-4" />

        <button className="w-full flex items-center justify-between p-4 hover:bg-sakura-light/20 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-mint/30 flex items-center justify-center text-xl">
              🔔
            </div>
            <div className="text-left">
              <div className="font-medium text-text-main">提醒设置</div>
              <div className="text-xs text-text-sub">每天 21:00</div>
            </div>
          </div>
          <span className="text-text-sub">›</span>
        </button>

        <div className="h-px bg-divider mx-4" />

        <button className="w-full flex items-center justify-between p-4 hover:bg-sakura-light/20 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-lavender/50 flex items-center justify-center text-xl">
              📤
            </div>
            <div className="text-left">
              <div className="font-medium text-text-main">导出数据</div>
              <div className="text-xs text-text-sub">导出账单到本地</div>
            </div>
          </div>
          <span className="text-text-sub">›</span>
        </button>

        <div className="h-px bg-divider mx-4" />

        <button className="w-full flex items-center justify-between p-4 hover:bg-sakura-light/20 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-lemon/50 flex items-center justify-center text-xl">
              💾
            </div>
            <div className="text-left">
              <div className="font-medium text-text-main">数据备份</div>
              <div className="text-xs text-text-sub">本地存储</div>
            </div>
          </div>
          <span className="text-text-sub">›</span>
        </button>
      </div>

      {/* 关于 */}
      <div className="card p-6 text-center">
        <div className="text-4xl mb-3">📱</div>
        <div className="font-bold text-text-main">记小账</div>
        <div className="text-sm text-text-sub mt-1">v1.0.0</div>
        <div className="text-xs text-text-sub mt-2">用心记录每一笔消费</div>
      </div>

      {/* 危险操作 */}
      <div className="space-y-3">
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full p-4 rounded-2xl bg-coral/10 text-coral font-medium hover:bg-coral/20 transition-colors flex items-center justify-center gap-2"
        >
          <span>🗑️</span>
          <span>清空所有数据</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full p-4 rounded-2xl bg-white text-text-sub font-medium hover:bg-sakura-light/50 transition-colors flex items-center justify-center gap-2"
        >
          <span>🚪</span>
          <span>退出登录</span>
        </button>
      </div>

      {/* 清空数据确认弹窗 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm animate-scale-in">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-text-main">确认清空数据？</h3>
              <p className="text-text-sub text-sm mt-2">此操作不可撤销，所有账单记录将被删除</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-sakura-light text-text-main font-bold hover:bg-sakura/30 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onClearData();
                  setShowConfirm(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-coral text-white font-bold hover:bg-coral/80 transition-colors"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
