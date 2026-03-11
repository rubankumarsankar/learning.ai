'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [type, setType] = useState('mf');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [maturityDate, setMaturityDate] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');

  const loadData = async () => {
    try {
      const res = await fetch('/api/investments');
      if (!res.ok) throw new Error('Failed to fetch investments');
      const data = await res.json();
      setInvestments(data);
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
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, provider, type, amount, startDate, maturityDate, expectedReturn
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to add investment');
      }

      setIsAdding(false);
      setName(''); setProvider(''); setType('mf'); setAmount(''); setStartDate(''); setMaturityDate(''); setExpectedReturn('');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this investment record?')) return;
    try {
      const res = await fetch(`/api/investments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleStatusToggle(id, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'matured' : 'active';
    try {
      const res = await fetch(`/api/investments/${id}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getTypeName = (val) => {
    const types = { sip: 'SIP', fd: 'Fixed Deposit', rd: 'Recurring Deposit', mf: 'Mutual Fund', stock: 'Stocks', ppf: 'PPF', crypto: 'Crypto' };
    return types[val] || val.toUpperCase();
  };

  // Compute portfolio allocation
  const activeInvestments = investments.filter(i => i.status === 'active');
  const totalPortfolio = activeInvestments.reduce((sum, i) => sum + i.amount, 0);

  const allocationMap = activeInvestments.reduce((acc, i) => {
    acc[i.type] = (acc[i.type] || 0) + i.amount;
    return acc;
  }, {});

  const chartData = Object.entries(allocationMap).map(([type, value]) => ({
    name: getTypeName(type),
    value
  })).sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-800 p-3 rounded-xl shadow-xl text-sm font-medium">
          <p className="text-gray-300 mb-1">{payload[0].name}</p>
          <p style={{ color: payload[0].color }}>{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Investments & Auto-save</h1>
          <p className="text-gray-400 text-sm">Track your portfolio growth and savings vehicles</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-medium shadow-lg hover:scale-105 transition-all text-sm"
        >
          {isAdding ? 'Cancel' : '+ Add Investment'}
        </button>
      </div>

      {error && <div className="p-4 bg-red-500/10 text-red-400 rounded-xl text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/80 rounded-2xl p-6 flex flex-col justify-center">
          <p className="text-sm text-gray-400 mb-2">Total Active Portfolio</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {formatCurrency(totalPortfolio)}
          </p>
          <div className="mt-8 space-y-3">
            {chartData.slice(0, 4).map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-gray-300">{entry.name}</span>
                </div>
                <span className="font-medium text-white">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Asset Allocation</h2>
          {chartData.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-800 rounded-xl">
              No active allocations to display
            </div>
          ) : (
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="p-6 bg-gray-900/50 border border-gray-800/50 rounded-2xl space-y-4 max-w-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg font-medium">Add Investment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Investment Name *</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" placeholder="e.g. Nifty 50 Index" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Provider / Platform</label>
              <input type="text" value={provider} onChange={e => setProvider(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" placeholder="e.g. Zerodha, Groww" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Asset Type *</label>
              <select required value={type} onChange={e => setType(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500">
                <option value="mf">Mutual Fund</option>
                <option value="stock">Stocks / Equity</option>
                <option value="fd">Fixed Deposit</option>
                <option value="rd">Recurring Deposit</option>
                <option value="sip">SIP / Auto-Invest</option>
                <option value="ppf">PPF / Govt Bonds</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Invested Amount *</label>
              <input type="number" required min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Start Date *</label>
              <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Maturity Date (Optional)</label>
              <input type="date" value={maturityDate} onChange={e => setMaturityDate(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Expected Return % (Optional)</label>
              <input type="number" step="0.1" value={expectedReturn} onChange={e => setExpectedReturn(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none" placeholder="12.5" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">Save Investment</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-gray-900/50 rounded-2xl" />
        </div>
      ) : investments.length === 0 && !isAdding ? (
        <div className="text-center py-20 bg-gray-900/20 border border-gray-800/30 rounded-2xl border-dashed">
          <div className="text-4xl mb-4">📈</div>
          <p className="text-gray-400 mb-4">No investments found</p>
          <button onClick={() => setIsAdding(true)} className="text-emerald-400 hover:text-emerald-300 font-medium text-sm">
            Start tracking your wealth
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {investments.map(inv => {
            const isMatured = inv.status !== 'active';
            return (
              <div key={inv.id} className={`bg-gray-900/50 border rounded-2xl p-5 group flex items-start justify-between transition-all ${
                isMatured ? 'border-gray-800/50 opacity-60' : 'border-gray-800/80 hover:border-gray-700'
              }`}>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold px-2 py-1 bg-gray-800 text-gray-300 rounded-md uppercase">
                      {getTypeName(inv.type)}
                    </span>
                    {isMatured && <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">Matured</span>}
                  </div>
                  <h3 className="font-bold text-lg text-white mt-2">{inv.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{inv.provider || 'No provider specified'}</p>
                  
                  <div className="flex items-center gap-6 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Invested</p>
                      <p className="font-semibold text-gray-200">{formatCurrency(inv.amount)}</p>
                    </div>
                    {inv.expectedReturn && (
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Est. Return</p>
                        <p className="font-semibold text-emerald-400">{inv.expectedReturn}%</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 h-full justify-between">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleStatusToggle(inv.id, inv.status)}
                      title={isMatured ? "Mark Active" : "Mark Matured"}
                      className="text-gray-400 hover:text-emerald-400 p-1 bg-gray-800 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(inv.id)}
                      className="text-red-400/70 hover:text-red-400 p-1 bg-gray-800 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>Started: {new Date(inv.startDate).toLocaleDateString()}</p>
                    {inv.maturityDate && <p className="mt-1">Maturity: {new Date(inv.maturityDate).toLocaleDateString()}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
