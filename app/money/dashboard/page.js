'use client';

import { useState, useEffect } from 'react';

const ACCOUNT_COLORS = {
  salary: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', icon: '💼' },
  savings: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: '🐷' },
  expense: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', icon: '💳' },
  cash: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', icon: '💵' },
  wallet: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', icon: '👛' },
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-gray-500 py-20">Failed to load dashboard data</div>;
  }

  const { accounts, totalBalance, monthlyIncome, monthlyExpense, monthlySavings, categorySpending, upcomingDues, recentTransactions, recurringCount } = data;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Your financial overview at a glance</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 rounded-2xl p-4 md:p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Net Worth</p>
          <p className="text-xl md:text-2xl font-bold text-emerald-400">{formatCurrency(totalBalance)}</p>
          <p className="text-xs text-gray-500 mt-1">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-4 md:p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Income</p>
          <p className="text-xl md:text-2xl font-bold text-green-400">{formatCurrency(monthlyIncome)}</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-4 md:p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Expenses</p>
          <p className="text-xl md:text-2xl font-bold text-red-400">{formatCurrency(monthlyExpense)}</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-4 md:p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Savings</p>
          <p className={`text-xl md:text-2xl font-bold ${monthlySavings >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(monthlySavings)}</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Account Balances */}
        <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5">
          <h2 className="text-lg font-bold text-white mb-4">Account Balances</h2>
          {accounts.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">No accounts yet. Go to Accounts to add one.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {accounts.map(acc => {
                const style = ACCOUNT_COLORS[acc.type] || ACCOUNT_COLORS.savings;
                return (
                  <div key={acc.id} className={`${style.bg} border ${style.border} rounded-xl p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{style.icon}</span>
                      <span className="text-sm font-medium text-gray-300">{acc.name}</span>
                      <span className="text-[10px] text-gray-500 uppercase ml-auto">{acc.type}</span>
                    </div>
                    <p className={`text-xl font-bold ${style.text}`}>{formatCurrency(acc.currentBalance)}</p>
                    {acc.bankName && <p className="text-xs text-gray-600 mt-1">{acc.bankName}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-white mb-3">Quick Info</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">🔄 Active Recurring</span>
                <span className="text-sm font-bold text-white">{recurringCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">📅 Upcoming Dues</span>
                <span className="text-sm font-bold text-white">{upcomingDues.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">📊 Transactions</span>
                <span className="text-sm font-bold text-white">{recentTransactions.length}</span>
              </div>
            </div>
          </div>

          {/* Category Spending */}
          {categorySpending.length > 0 && (
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5">
              <h2 className="text-lg font-bold text-white mb-3">Top Spending</h2>
              <div className="space-y-2">
                {categorySpending.sort((a, b) => b.amount - a.amount).slice(0, 5).map((cat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 flex items-center gap-2">
                      <span>{cat.icon || '📁'}</span> {cat.name}
                    </span>
                    <span className="text-sm font-semibold text-red-400">{formatCurrency(cat.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-white mb-4">Recent Transactions</h2>
        {recentTransactions.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">No transactions yet. Start by adding income or expenses.</p>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: tx.category?.color ? tx.category.color + '20' : 'rgba(100,116,139,0.1)' }}>
                  {tx.category?.icon || (tx.type === 'income' ? '💰' : '💳')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{tx.description || tx.category?.name || tx.type}</p>
                  <p className="text-xs text-gray-600">{tx.account?.name} · {new Date(tx.transactionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
                <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
