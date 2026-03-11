'use client';

import { useState, useEffect } from 'react';

export default function BorrowLendPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // Form handling
  const [personName, setPersonName] = useState('');
  const [direction, setDirection] = useState('lent'); // lent (they owe me) | borrowed (I owe them)
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');

  // Repay modal state
  const [repayEntry, setRepayEntry] = useState(null);
  const [repayAmount, setRepayAmount] = useState('');

  const loadData = async () => {
    try {
      const res = await fetch('/api/borrow-lend');
      if (!res.ok) throw new Error('Failed to fetch entries');
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/borrow-lend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personName, direction, principalAmount: amount, dueDate, note })
      });
      if (!res.ok) throw new Error('Failed to add entry');

      setIsAdding(false);
      setPersonName(''); setAmount(''); setDueDate(''); setNote(''); setDirection('lent');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this record entirely?')) return;
    try {
      const res = await fetch(`/api/borrow-lend/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRecordRepayment(e) {
    e.preventDefault();
    setError('');
    if (!repayEntry) return;

    try {
      const res = await fetch(`/api/borrow-lend/${repayEntry.id}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REPAY', amount: repayAmount })
      });
      if (!res.ok) throw new Error('Failed to record repayment');
      
      setRepayEntry(null);
      setRepayAmount('');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  // Compute summaries
  const totalLent = entries.filter(e => e.direction === 'lent' && e.status !== 'settled').reduce((sum, e) => sum + e.outstandingAmount, 0);
  const totalBorrowed = entries.filter(e => e.direction === 'borrowed' && e.status !== 'settled').reduce((sum, e) => sum + e.outstandingAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Borrow / Lend</h1>
          <p className="text-gray-400 text-sm">Track money you owe and money owed to you</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-medium shadow-lg hover:scale-105 transition-all text-sm"
        >
          {isAdding ? 'Cancel' : '+ New Entry'}
        </button>
      </div>

      {error && <div className="p-4 bg-red-500/10 text-red-400 rounded-xl text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
        <div className="bg-gray-900/50 border border-emerald-500/20 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Total Owed to You (Lent)</p>
          <p className="text-3xl font-bold text-emerald-400">{formatCurrency(totalLent)}</p>
        </div>
        <div className="bg-gray-900/50 border border-rose-500/20 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Total You Owe (Borrowed)</p>
          <p className="text-3xl font-bold text-rose-400">{formatCurrency(totalBorrowed)}</p>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="p-6 bg-gray-900/50 border border-gray-800/50 rounded-2xl max-w-2xl space-y-4">
          <h2 className="text-lg font-medium">Record Borrow/Lend</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Direction *</label>
              <select required value={direction} onChange={e => setDirection(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500">
                <option value="lent">I Lent Money (They owe me)</option>
                <option value="borrowed">I Borrowed Money (I owe them)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Person Name *</label>
              <input type="text" required value={personName} onChange={e => setPersonName(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Amount *</label>
              <input type="number" required min="1" value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Due Date (Optional)</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none" />
            </div>
            <div className="col-span-full">
              <label className="block text-sm text-gray-400 mb-1">Note (Optional)</label>
              <input type="text" value={note} onChange={e => setNote(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none" placeholder="e.g. For dinner switch" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">Save Entry</button>
          </div>
        </form>
      )}

      {/* Repayment Modal */}
      {repayEntry && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleRecordRepayment} className="bg-gray-950 border border-gray-800 p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl">
            <h3 className="text-lg font-medium">Record Repayment</h3>
            <p className="text-sm text-gray-400">
              For: {repayEntry.personName} <br/>
              Max Outstanding: {formatCurrency(repayEntry.outstandingAmount)}
            </p>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Amount Received/Paid</label>
              <input type="number" required min="1" max={repayEntry.outstandingAmount} value={repayAmount} onChange={e => setRepayAmount(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setRepayEntry(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg">Confirm</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-900/50 rounded-2xl" />
        </div>
      ) : entries.length === 0 && !isAdding ? (
        <div className="text-center py-20 bg-gray-900/20 border border-gray-800/30 rounded-2xl border-dashed">
          <div className="text-4xl mb-4">🤝</div>
          <p className="text-gray-400 mb-4">No borrow/lend records found</p>
          <button onClick={() => setIsAdding(true)} className="text-emerald-400 hover:text-emerald-300 font-medium text-sm">
            Add a record
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {entries.map(entry => {
            const isLent = entry.direction === 'lent';
            const isSettled = entry.status === 'settled';
            
            return (
              <div key={entry.id} className={`bg-gray-900/50 border rounded-2xl p-5 group flex flex-col ${
                isSettled ? 'border-gray-800/50 opacity-60' : isLent ? 'border-emerald-500/20' : 'border-rose-500/20'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {entry.personName}
                      {isSettled && <span className="text-[10px] px-2 py-0.5 bg-gray-800 text-emerald-400 rounded-full">Settled</span>}
                    </h3>
                    <p className={`text-xs ${isLent ? 'text-emerald-400/80' : 'text-rose-400/80'} uppercase tracking-wider font-semibold mt-1`}>
                      {isLent ? 'Owes you' : 'You owe'}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(entry.id)} className="text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-500">Outstanding</p>
                  <p className={`text-2xl font-bold ${isSettled ? 'text-gray-400' : isLent ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatCurrency(entry.outstandingAmount)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">originally {formatCurrency(entry.principalAmount)}</p>
                </div>
                
                <div className="mt-auto border-t border-gray-800/50 pt-4 flex justify-between items-center text-xs">
                  <div className="text-gray-500">
                    {entry.dueDate ? `Due: ${new Date(entry.dueDate).toLocaleDateString()}` : 'No due date'}
                  </div>
                  {!isSettled && (
                    <button 
                      onClick={() => setRepayEntry(entry)}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Record {isLent ? 'Receipt' : 'Payment'}
                    </button>
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
