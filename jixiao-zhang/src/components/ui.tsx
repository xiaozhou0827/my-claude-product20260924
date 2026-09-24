import type { Expense, Income } from '../types';
import { CATEGORY_COLORS } from '../types';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  gradient: string;
  onClick?: () => void;
}

export function StatCard({ title, value, subtitle, icon, gradient, onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl p-5 text-white card-hover ${gradient}`}
    >
      {/* 装饰圆形 */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">{icon}</span>
          <span className="text-xs font-medium opacity-80">{title}</span>
        </div>
        <div className="text-3xl font-bold number-font">{value}</div>
        {subtitle && (
          <div className="text-xs mt-1 opacity-90">{subtitle}</div>
        )}
      </div>
    </button>
  );
}

interface QuickActionProps {
  icon: string;
  label: string;
  gradient: string;
  onClick: () => void;
}

export function QuickAction({ icon, label, gradient, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl text-white ${gradient} hover-lift`}
    >
      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

interface ExpenseRowProps {
  expense: Expense;
  onClick: () => void;
}

export function ExpenseRow({ expense, onClick }: ExpenseRowProps) {
  const color = CATEGORY_COLORS[expense.category];

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-sakura-light/30 transition-colors text-left"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
        style={{ backgroundColor: color }}
      >
        {expense.category}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-text-main truncate">{expense.category}</div>
        <div className="text-sm text-text-sub mt-0.5">
          {expense.date} · {expense.paymentMethod}
        </div>
        {expense.note && (
          <div className="text-xs text-text-sub mt-0.5 truncate">{expense.note}</div>
        )}
      </div>

      <div className="text-right flex-shrink-0">
        <div className="font-bold text-rose text-lg number-font">
          -¥{expense.amount.toFixed(2)}
        </div>
      </div>
    </button>
  );
}

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const tabs = [
    { id: 'home', label: '首页', icon: '🏠' },
    { id: 'expenses', label: '账单', icon: '📋' },
    { id: 'stats', label: '统计', icon: '📊' },
    { id: 'budget', label: '预算', icon: '💰' },
    { id: 'profile', label: '我的', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-divider z-50">
      <div className="max-w-lg mx-auto flex justify-around py-2 px-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${
              activeTab === tab.id
                ? 'text-sakura-deep'
                : 'text-text-sub hover:text-sakura'
            }`}
          >
            <div className="relative">
              <span className="text-2xl">{tab.icon}</span>
              {activeTab === tab.id && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sakura-deep" />
              )}
            </div>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 animate-fade-in">
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-divider rounded-full mx-auto mb-6" />
        {children}
      </div>
      <div className="absolute inset-0" onClick={onClose} />
    </div>
  );
}

interface IncomeRowProps {
  income: Income;
}

export function IncomeRow({ income }: IncomeRowProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-mint/10 transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-mint flex items-center justify-center text-white text-xl">
        ¥
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-text-main truncate">{income.source}</div>
        <div className="text-sm text-text-sub mt-0.5">
          {income.date}
        </div>
        {income.note && (
          <div className="text-xs text-text-sub mt-0.5 truncate">{income.note}</div>
        )}
      </div>

      <div className="text-right flex-shrink-0">
        <div className="font-bold text-mint-deep text-lg number-font">
          +¥{income.amount.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4 animate-pulse-soft">{icon}</div>
      <div className="font-semibold text-text-main text-lg">{title}</div>
      <div className="text-sm text-text-sub mt-2">{description}</div>
    </div>
  );
}
