'use client';

import { useState, useEffect } from 'react';

const ACCOUNT_TYPES = ['salary', 'savings', 'expense', 'cash', 'wallet'];
const TYPE_COLORS = {
  salary: 'bg-green-500/10 border-green-500/20 text-green-400',
  savings: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  expense: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
  cash: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  wallet: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
};
const TYPE_ICONS = { salary: '💼', savings: '🐷', expense: '💳', cash: '💵', wallet: '👛' };

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', type: 'savings', bankName: '', openingBalance: '', minimumBuffer: '' });

  async function loadAccounts() {
    const res = await fetch('/api/accounts');
    const data = await res.json();
    setAccounts(data);
    setLoading(false);
  }

  useEffect(() => { loadAccounts(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', type: 'savings', bankName: '', openingBalance: '', minimumBuffer: '' });
    setShowForm(false);
    loadAccounts();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this account?')) return;
    await fetch(`/api/accounts/${id}`, { method: 'DELETE' });
    loadAccounts();
  }

  const totalBalance = accounts.reduce((sum, a) => sum + a.currentBalance, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Accounts</h1>
          <p className="text-gray-500 text-sm mt-1">Total balance: <span className="text-emerald-400 font-semibold">{formatCurrency(totalBalance)}</span></p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20 text-sm">
          + Add Account
        </button>
      </div>

      {/* Add Account Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Account Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="e.g. HDFC Salary" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/50">
                {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Bank Name</label>
              <input value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="e.g. HDFC Bank" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Opening Balance (₹)</label>
              <input type="number" value={form.openingBalance} onChange={e => setForm({...form, openingBalance: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="0" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white px-4 py-2.5 text-sm transition-colors">Cancel</button>
          </div>
        </form>
      )}

      {/* Account Cards */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🏦</p>
          <p className="text-gray-400 text-lg font-medium">No accounts yet</p>
          <p className="text-gray-600 text-sm mt-1">Add your first bank account to get started</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(acc => {
            const colors = TYPE_COLORS[acc.type] || TYPE_COLORS.savings;
            const icon = TYPE_ICONS[acc.type] || '🏦';
            const available = acc.currentBalance - acc.minimumBuffer;
            return (
              <div key={acc.id} className={`${colors.split(' ')[0]} border ${colors.split(' ')[1]} rounded-2xl p-5 relative group`}>
                <button onClick={() => handleDelete(acc.id)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xs">✕</button>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{acc.name}</p>
                    {acc.bankName && <p className="text-[10px] text-gray-500">{acc.bankName}</p>}
                  </div>
                  <span className="ml-auto text-[10px] uppercase text-gray-500 border border-gray-700 px-2 py-0.5 rounded-full">{acc.type}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Balance</span>
                    <span className={`text-lg font-bold ${colors.split(' ')[2]}`}>{formatCurrency(acc.currentBalance)}</span>
                  </div>
                  {acc.minimumBuffer > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Buffer</span>
                        <span className="text-xs text-gray-400">{formatCurrency(acc.minimumBuffer)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-700/30 pt-1.5">
                        <span className="text-xs text-gray-500">Spendable</span>
                        <span className={`text-sm font-semibold ${available >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(available)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
