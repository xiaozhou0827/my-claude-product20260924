import type { Expense, PaymentMethod } from '../types';
import { useState } from 'react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}

export default function AddExpenseModal({ isOpen, onClose, onAdd }: AddExpenseModalProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Expense['category']>('餐饮');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('现金');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('请输入有效的金额');
      return;
    }
    onAdd({ amount: numAmount, category, date, note: note || undefined, paymentMethod });
    setAmount('');
    setCategory('餐饮');
    setNote('');
    setPaymentMethod('现金');
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-text-main">记一笔</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-sakura-light flex items-center justify-center text-text-sub hover:bg-sakura hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 金额输入 */}
          <div className="mb-6 text-center">
            <div className="text-sm text-text-sub mb-2">金额</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl text-text-main">¥</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="text-4xl font-bold text-center w-40 bg-transparent border-b-2 border-sakura focus:outline-none text-text-main placeholder-gray-300"
                step="0.01"
                min="0"
                autoFocus
              />
            </div>
          </div>

          {/* 分类选择 */}
          <div className="mb-6">
            <div className="text-sm text-text-sub mb-3">分类</div>
            <div className="grid grid-cols-4 gap-3">
              {['餐饮', '交通', '购物', '娱乐', '医疗', '教育', '居住', '其他'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat as Expense['category'])}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
                    category === cat
                      ? 'bg-sakura text-white shadow-pink'
                      : 'bg-sakura-light text-text-main hover:bg-sakura-light/80'
                  }`}
                >
                  <span className="text-xs">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 日期和支付方式 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-sm text-text-sub mb-2">日期</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-sakura-light text-text-main focus:outline-none focus:ring-2 focus:ring-sakura"
              />
            </div>
            <div>
              <div className="text-sm text-text-sub mb-2">支付方式</div>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full p-3 rounded-xl bg-sakura-light text-text-main focus:outline-none focus:ring-2 focus:ring-sakura appearance-none"
              >
                {['现金', '微信', '支付宝', '信用卡', '其他'].map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 备注 */}
          <div className="mb-6">
            <div className="text-sm text-text-sub mb-2">备注（可选）</div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="添加备注..."
              className="w-full p-3 rounded-xl bg-sakura-light text-text-main focus:outline-none focus:ring-2 focus:ring-sakura placeholder-text-sub"
            />
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-sakura text-white font-bold text-lg hover:bg-sakura-deep transition-colors shadow-pink"
          >
            保存
          </button>
        </form>
      </div>
    </div>
  );
}
