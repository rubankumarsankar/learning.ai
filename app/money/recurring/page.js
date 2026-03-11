'use client';

import { useState, useEffect } from 'react';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export default function RecurringPage() {
  const [rules, setRules] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '', amount: '', frequency: 'monthly', dueDay: '', sourceAccountId: '', categoryId: '', autoPay: false, isEssential: true,
  });

  async function loadData() {
    const [rulesRes, accRes, catRes] = await Promise.all([
      fetch('/api/recurring'), fetch('/api/accounts'), fetch('/api/categories'),
    ]);
    setRules(await rulesRes.json());
    setAccounts(await accRes.json());
    setCategories(await catRes.json());
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.sourceAccountId) return alert('Select a source account');
    await fetch('/api/recurring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', amount: '', frequency: 'monthly', dueDay: '', sourceAccountId: '', categoryId: '', autoPay: false, isEssential: true });
    setShowForm(false);
    loadData();
  }

  const totalMonthly = rules.filter(r => r.isActive).reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Recurring Expenses</h1>
          <p className="text-gray-500 text-sm mt-1">Monthly commitment: <span className="text-orange-400 font-semibold">{formatCurrency(totalMonthly)}</span></p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20 text-sm">
          + Add Rule
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5 space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Title *</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none" placeholder="e.g. Rent, Gym, Netflix" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Amount (₹) *</label>
              <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Frequency</label>
              <select value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none">
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Due Day</label>
              <input type="number" min="1" max="31" value={form.dueDay} onChange={e => setForm({...form, dueDay: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none" placeholder="1-31" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Source Account *</label>
              <select value={form.sourceAccountId} onChange={e => setForm({...form, sourceAccountId: e.target.value})} required
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none">
                <option value="">Select</option>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Category</label>
              <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none">
                <option value="">None</option>
                {categories.filter(c => c.type === 'expense').map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" checked={form.autoPay} onChange={e => setForm({...form, autoPay: e.target.checked})} className="rounded border-gray-600" />
              Auto-pay
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" checked={form.isEssential} onChange={e => setForm({...form, isEssential: e.target.checked})} className="rounded border-gray-600" />
              Essential
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white px-4 py-2.5 text-sm">Cancel</button>
          </div>
        </form>
      )}

      {/* Rules List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : rules.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔄</p>
          <p className="text-gray-400 text-lg font-medium">No recurring rules</p>
          <p className="text-gray-600 text-sm mt-1">Add rent, subscriptions, and bills</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map(rule => (
            <div key={rule.id} className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5 hover:border-gray-700/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{rule.category?.icon || '📄'}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{rule.title}</p>
                    <p className="text-[10px] text-gray-600">{rule.sourceAccount?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {rule.isEssential && <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">Essential</span>}
                  {rule.autoPay && <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">Auto</span>}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-lg font-bold text-orange-400">{formatCurrency(rule.amount)}</p>
                  <p className="text-xs text-gray-500 capitalize">{rule.frequency}{rule.dueDay ? ` · Day ${rule.dueDay}` : ''}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${rule.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                  {rule.isActive ? 'Active' : 'Paused'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
