'use client';

import { useState, useEffect } from 'react';

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [lenderName, setLenderName] = useState('');
  const [type, setType] = useState('personal');
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [emiAmount, setEmiAmount] = useState('');
  const [startDate, setStartDate] = useState('');

  const loadLoans = async () => {
    try {
      const res = await fetch('/api/loans');
      if (!res.ok) throw new Error('Failed to fetch loans');
      const data = await res.json();
      setLoans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lenderName, type, principal, rate, emiAmount, startDate
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to add loan');
      }

      // Reset & Reload
      setIsAdding(false);
      setLenderName('');
      setType('personal');
      setPrincipal('');
      setRate('');
      setEmiAmount('');
      setStartDate('');
      loadLoans();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this loan record?')) return;
    try {
      const res = await fetch(`/api/loans/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete loan');
      loadLoans();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRecordPayment(id, emiAmount) {
    if (!confirm(`Record EMI payment of ${formatCurrency(emiAmount)}?`)) return;
    try {
      const res = await fetch(`/api/loans/${id}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'PAY_EMI' })
      });
      if (!res.ok) throw new Error('Failed to record payment');
      loadLoans();
    } catch (err) {
      setError(err.message);
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Loans & EMI Tracker</h1>
          <p className="text-gray-400 text-sm">Manage your debts and track your payoff progress</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-medium shadow-lg hover:scale-105 transition-all text-sm"
        >
          {isAdding ? 'Cancel' : '+ Add Loan'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleSubmit} className="p-6 bg-gray-900/50 border border-gray-800/50 rounded-2xl space-y-4 max-w-2xl">
          <h2 className="text-lg font-medium">Add New Loan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Lender / Bank Name *</label>
              <input type="text" required value={lenderName} onChange={e => setLenderName(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" 
                placeholder="e.g. SBI Bank" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Loan Type *</label>
              <select required value={type} onChange={e => setType(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500">
                <option value="personal">Personal Loan</option>
                <option value="education">Education Loan</option>
                <option value="vehicle">Auto / Vehicle Loan</option>
                <option value="home">Home Loan</option>
                <option value="gold">Gold Loan</option>
                <option value="bnpl">Buy Now Pay Later</option>
                <option value="hand">Hand Loan (Family/Friend)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Principal Amount *</label>
              <input type="number" required min="1" step="0.01" value={principal} onChange={e => setPrincipal(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Interest Rate (%)</label>
                <input type="number" step="0.01" min="0" value={rate} onChange={e => setRate(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" 
                  placeholder="e.g. 10.5" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Monthly EMI *</label>
                <input type="number" required min="1" step="0.01" value={emiAmount} onChange={e => setEmiAmount(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Start Date *</label>
              <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
              Save Loan
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-900/50 rounded-2xl" />
        </div>
      ) : loans.length === 0 && !isAdding ? (
        <div className="text-center py-20 bg-gray-900/20 border border-gray-800/30 rounded-2xl border-dashed">
          <div className="text-4xl mb-4">📉</div>
          <p className="text-gray-400 mb-4">No active loans being tracked</p>
          <button onClick={() => setIsAdding(true)} className="text-emerald-400 hover:text-emerald-300 font-medium text-sm">
            Add your first loan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {loans.map(loan => {
            const progress = ((loan.principal - loan.remainingPrincipal) / loan.principal) * 100;
            const isClosed = loan.status === 'closed';

            return (
              <div key={loan.id} className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5 hover:border-gray-700 transition-all flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {loan.lenderName}
                      {isClosed && <span className="text-[10px] px-2 py-0.5 bg-gray-800 text-emerald-400 rounded-full border border-emerald-500/20 uppercase tracking-wider">Closed</span>}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">{loan.type} Loan • {loan.rate}% Interest</p>
                  </div>
                  <button onClick={() => handleDelete(loan.id)} className="text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                
                <div className="flex-1 space-y-4 mb-4 border-b border-gray-800/50 pb-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Remaining</p>
                      <p className={`font-medium text-lg ${isClosed ? 'text-gray-400' : 'text-red-400'}`}>
                        {formatCurrency(loan.remainingPrincipal)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Original</p>
                      <p className="font-medium text-gray-300">{formatCurrency(loan.principal)}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Paid: {formatCurrency(loan.principal - loan.remainingPrincipal)}</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isClosed ? 'bg-emerald-500' : 'bg-gradient-to-r from-teal-500 to-emerald-500'}`}
                        style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-gray-500">EMI: </span>
                    <span className="font-medium text-white">{formatCurrency(loan.emiAmount)}</span>
                  </div>
                  {!isClosed && (
                    <button 
                      onClick={() => handleRecordPayment(loan.id, loan.emiAmount)}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-teal-400 rounded-lg transition-colors border border-gray-700 font-medium text-xs"
                    >
                      Record Payment
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
