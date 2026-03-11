'use client';

import { useState, useEffect } from 'react';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    accountId: '', type: 'expense', categoryId: '', amount: '', description: '', transactionDate: new Date().toISOString().split('T')[0],
  });

  async function loadData() {
    const [txRes, accRes, catRes] = await Promise.all([
      fetch('/api/transactions'), fetch('/api/accounts'), fetch('/api/categories'),
    ]);
    setTransactions(await txRes.json());
    setAccounts(await accRes.json());
    setCategories(await catRes.json());
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.accountId) return alert('Select an account');
    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ accountId: form.accountId, type: 'expense', categoryId: '', amount: '', description: '', transactionDate: new Date().toISOString().split('T')[0] });
    setShowForm(false);
    loadData();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this transaction?')) return;
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    loadData();
  }

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);
  const filteredCategories = categories.filter(c => {
    if (form.type === 'income') return c.type === 'income';
    if (form.type === 'expense') return c.type === 'expense';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Transactions</h1>
          <p className="text-gray-500 text-sm mt-1">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20 text-sm">
          + Add Transaction
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'income', 'expense', 'transfer'].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === t ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-500 hover:text-gray-300 border border-gray-800/50 hover:border-gray-700'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5 space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value, categoryId: ''})}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Account *</label>
              <select value={form.accountId} onChange={e => setForm({...form, accountId: e.target.value})} required
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none">
                <option value="">Select account</option>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Amount (₹) *</label>
              <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Category</label>
              <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none">
                <option value="">None</option>
                {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Description</label>
              <input value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none" placeholder="What for?" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Date</label>
              <input type="date" value={form.transactionDate} onChange={e => setForm({...form, transactionDate: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white px-4 py-2.5 text-sm">Cancel</button>
          </div>
        </form>
      )}

      {/* Transaction List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">💳</p>
          <p className="text-gray-400 text-lg font-medium">No transactions found</p>
          <p className="text-gray-600 text-sm mt-1">Add your first transaction to start tracking</p>
        </div>
      ) : (
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl divide-y divide-gray-800/30">
          {filtered.map(tx => (
            <div key={tx.id} className="flex items-center gap-3 p-4 hover:bg-gray-800/20 transition-colors group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0" style={{ backgroundColor: tx.category?.color ? tx.category.color + '20' : 'rgba(100,116,139,0.1)' }}>
                {tx.category?.icon || (tx.type === 'income' ? '💰' : '💳')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">{tx.description || tx.category?.name || tx.type}</p>
                <p className="text-xs text-gray-600">{tx.account?.name} · {new Date(tx.transactionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <p className={`text-sm font-bold shrink-0 ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </p>
              <button onClick={() => handleDelete(tx.id)} className="text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xs shrink-0 ml-2">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
