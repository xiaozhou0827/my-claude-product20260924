import type { Expense, Income } from '../types';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';

interface StatsPageProps {
  expenses: Expense[];
  incomes: Income[];
}

export default function StatsPage({ expenses, incomes }: StatsPageProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const monthIncomes = incomes.filter(i => {
      const date = new Date(i.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalExpense = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = monthIncomes.reduce((sum, i) => sum + i.amount, 0);

    const categoryStats = monthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(categoryStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const dailyTrend: Array<{ date: string; expense: number; income: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 86400000);
      const dateStr = date.toISOString().split('T')[0];
      const dayExpense = monthExpenses
        .filter(e => e.date === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);
      const dayIncome = monthIncomes
        .filter(i => i.date === dateStr)
        .reduce((sum, i) => sum + i.amount, 0);
      dailyTrend.push({ date: dateStr.slice(5), expense: dayExpense, income: dayIncome });
    }

    return {
      totalExpense,
      totalIncome,
      balance: totalIncome - totalExpense,
      pieData,
      dailyTrend,
    };
  }, [expenses, incomes]);

  const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#a29bfe', '#fd79a8'];

  return (
    <div className="p-4 pb-28 space-y-4">
      {/* 标题 */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">数据统计</h1>
        <p className="text-gray-500 text-sm mt-1">2026年9月消费分析</p>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card shark-card p-4 text-center">
          <div className="text-gray-500 text-xs mb-1">总支出</div>
          <div className="text-xl font-bold text-red-500 number-font">¥{stats.totalExpense.toFixed(0)}</div>
        </div>
        <div className="card shark-card p-4 text-center">
          <div className="text-gray-500 text-xs mb-1">总收入</div>
          <div className="text-xl font-bold text-green-500 number-font">¥{stats.totalIncome.toFixed(0)}</div>
        </div>
        <div className="card shark-card p-4 text-center">
          <div className="text-gray-500 text-xs mb-1">结余</div>
          <div className={`text-xl font-bold number-font ${stats.balance >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
            ¥{stats.balance.toFixed(0)}
          </div>
        </div>
      </div>

      {/* 分类占比 */}
      <div className="card shark-card p-5">
        <h2 className="font-bold text-gray-800 mb-4">消费占比</h2>
        {stats.pieData.length > 0 ? (
          <div className="flex items-center gap-4">
            <div className="flex-1 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.pieData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => `¥${Number(value).toFixed(2)}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {stats.pieData.slice(0, 6).map((item: any, index: number) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800 number-font">
                    ¥{item.value.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-sm">暂无消费数据</div>
          </div>
        )}
      </div>

      {/* 每日趋势 */}
      <div className="card shark-card p-5">
        <h2 className="font-bold text-gray-800 mb-4">30天趋势</h2>
        {stats.dailyTrend.some(d => d.expense > 0) ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.dailyTrend}>
              <defs>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#999' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#999' }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value: any) => `¥${Number(value).toFixed(2)}`}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="expense" stroke="#ff6b6b" strokeWidth={2} fill="url(#colorExpense)" name="支出" />
              <Area type="monotone" dataKey="income" stroke="#4ecdc4" strokeWidth={2} fill="url(#colorIncome)" name="收入" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-sm">暂无趋势数据</div>
          </div>
        )}
      </div>
    </div>
  );
}
