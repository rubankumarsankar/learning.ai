'use client';

import { useState, useEffect } from 'react';

export default function CreditCardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [billingDay, setBillingDay] = useState('');
  const [dueDay, setDueDay] = useState('');

  async function loadCards() {
    try {
      const res = await fetch('/api/credit-cards');
      if (!res.ok) throw new Error('Failed to fetch cards');
      const data = await res.json();
      setCards(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Effect is safe because we only call fetch and then setState on mount
  useEffect(() => {
    let mounted = true;
    fetch('/api/credit-cards')
      .then(res => res.json())
      .then(data => {
        if (mounted) {
          setCards(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => mounted = false;
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/credit-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          issuer,
          creditLimit,
          billingDay,
          dueDay
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to create credit card');
      }

      // Reset & Reload
      setIsAdding(false);
      setName('');
      setIssuer('');
      setCreditLimit('');
      setBillingDay('');
      setDueDay('');
      loadCards();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this credit card?')) return;
    try {
      const res = await fetch(`/api/credit-cards/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete credit card');
      loadCards();
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
          <h1 className="text-2xl font-bold">Credit Cards</h1>
          <p className="text-gray-400 text-sm">Manage your credit cards, limits, and due dates</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-medium shadow-lg hover:scale-105 transition-all text-sm"
        >
          {isAdding ? 'Cancel' : '+ Add Card'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleSubmit} className="p-6 bg-gray-900/50 border border-gray-800/50 rounded-2xl space-y-4 max-w-2xl">
          <h2 className="text-lg font-medium">Add New Credit Card</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Card Name / Alias *</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" 
                placeholder="e.g. HDFC Millennia" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Bank / Issuer</label>
              <input type="text" value={issuer} onChange={e => setIssuer(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" 
                placeholder="e.g. HDFC Bank" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Credit Limit *</label>
              <input type="number" required min="0" step="1000" value={creditLimit} onChange={e => setCreditLimit(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Billing Day *</label>
                <input type="number" required min="1" max="31" value={billingDay} onChange={e => setBillingDay(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" 
                  placeholder="e.g. 15" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Due Day *</label>
                <input type="number" required min="1" max="31" value={dueDay} onChange={e => setDueDay(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" 
                  placeholder="e.g. 5" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
              Save Card
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-900/50 rounded-2xl" />
          <div className="h-32 bg-gray-900/50 rounded-2xl" />
        </div>
      ) : cards.length === 0 && !isAdding ? (
        <div className="text-center py-20 bg-gray-900/20 border border-gray-800/30 rounded-2xl border-dashed">
          <div className="text-4xl mb-4">💳</div>
          <p className="text-gray-400 mb-4">No credit cards added yet</p>
          <button onClick={() => setIsAdding(true)} className="text-emerald-400 hover:text-emerald-300 font-medium text-sm">
            Add your first card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map(card => (
            <div key={card.id} className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5 hover:border-gray-700 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{card.name}</h3>
                    <p className="text-xs text-gray-500">{card.issuer}</p>
                  </div>
                  <button onClick={() => handleDelete(card.id)} className="text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Outstanding</span>
                    <span className="font-medium text-red-400">{formatCurrency(card.outstandingBalance)}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${card.utilizationPercent > 70 ? 'bg-red-500' : card.utilizationPercent > 30 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(card.utilizationPercent, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-gray-500">
                    <span>{card.utilizationPercent}% utilized</span>
                    <span>Limit: {formatCurrency(card.creditLimit)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-800/50 mt-2">
                <div>Billing: <span className="text-gray-300">{card.billingDay}th</span></div>
                <div>Due: <span className="text-pink-400">{card.dueDay}th</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
