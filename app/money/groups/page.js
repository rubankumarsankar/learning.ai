'use client';

import { useState, useEffect } from 'react';

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  
  // Group Form
  const [groupName, setGroupName] = useState('');
  const [membersInput, setMembersInput] = useState('Me, ');

  // Expense Form
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');

  const loadGroups = async () => {
    try {
      const res = await fetch('/api/groups');
      if (!res.ok) throw new Error('Failed to fetch groups');
      const data = await res.json();
      setGroups(data);
      
      // Update selected group if it exists
      if (selectedGroup) {
        const updated = data.find(g => g.id === selectedGroup.id);
        if (updated) setSelectedGroup(updated);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []); // Custom dependency hook ignoring loadGroups change

  async function handleCreateGroup(e) {
    e.preventDefault();
    setError('');
    
    // Parse members
    const membersList = membersInput.split(',').map(m => m.trim()).filter(m => m);
    if (membersList.length < 2) {
      setError('You need at least 2 members for a group (e.g. Me, Friend)');
      return;
    }

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupName, members: membersList })
      });

      if (!res.ok) throw new Error('Failed to create group');

      setIsAddingGroup(false);
      setGroupName('');
      setMembersInput('Me, ');
      loadGroups();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddExpense(e) {
    e.preventDefault();
    setError('');
    if (!selectedGroup) return;

    try {
      const res = await fetch(`/api/groups/${selectedGroup.id}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, 
          totalAmount: amount, 
          paidByMemberId: paidBy || selectedGroup.members[0].id // default first member
        })
      });

      if (!res.ok) throw new Error('Failed to add expense');

      setIsAddingExpense(false);
      setTitle('');
      setAmount('');
      setPaidBy('');
      loadGroups();
    } catch (err) {
      setError(err.message);
    }
  }

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Group Expenses</h1>
          <p className="text-gray-400 text-sm">Split bills and track shared expenses with friends</p>
        </div>
        {!selectedGroup && (
          <button 
            onClick={() => setIsAddingGroup(!isAddingGroup)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-medium shadow-lg hover:scale-105 transition-all text-sm"
          >
            {isAddingGroup ? 'Cancel' : '+ New Group'}
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* CREATE GROUP FORM */}
      {isAddingGroup && !selectedGroup && (
        <form onSubmit={handleCreateGroup} className="p-6 bg-gray-900/50 border border-gray-800/50 rounded-2xl max-w-xl space-y-4">
          <h2 className="text-lg font-medium mb-4">Create New Group</h2>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Group Name</label>
            <input type="text" required value={groupName} onChange={e => setGroupName(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" 
              placeholder="e.g. Goa Trip 🏖️" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Members (comma separated)</label>
            <input type="text" required value={membersInput} onChange={e => setMembersInput(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" 
              placeholder="e.g. Me, Rahul, Priya" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsAddingGroup(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">Create Group</button>
          </div>
        </form>
      )}

      {/* GROUP DETAILS VIEW */}
      {selectedGroup && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button onClick={() => setSelectedGroup(null)} className="text-sm text-gray-400 hover:text-white flex items-center gap-2">
            <span>←</span> Back to all groups
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
              <p className="text-sm text-gray-400">{selectedGroup.members.length} members • {formatCurrency(selectedGroup.totalExpenses)} total expenses</p>
            </div>
            <button 
              onClick={() => setIsAddingExpense(!isAddingExpense)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-medium shadow-lg hover:scale-105 transition-all text-sm"
            >
              {isAddingExpense ? 'Cancel' : '+ Add Expense'}
            </button>
          </div>

          {/* ADD EXPENSE FORM */}
          {isAddingExpense && (
            <form onSubmit={handleAddExpense} className="p-6 bg-gray-900/50 border border-gray-800/50 rounded-2xl max-w-xl space-y-4">
              <h3 className="text-lg font-medium">Add Shared Expense</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">What was this for?</label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none" placeholder="e.g. Dinner at XYZ" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Amount</label>
                  <input type="number" required min="1" value={amount} onChange={e => setAmount(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Who paid?</label>
                  <select required value={paidBy} onChange={e => setPaidBy(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none">
                    <option value="" disabled>Select member</option>
                    {selectedGroup.members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 pt-2 border-t border-gray-800">
                This expense will be split equally ({formatCurrency((amount || 0) / selectedGroup.members.length)} each)
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600">Save Expense</button>
              </div>
            </form>
          )}

          {/* RECENT EXPENSES */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800/50 bg-gray-900">
              <h3 className="font-medium text-gray-200">Recent Group Expenses</h3>
            </div>
            {selectedGroup.expenses.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No expenses added yet.</div>
            ) : (
              <div className="divide-y divide-gray-800 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-900/80 text-gray-400">
                    <tr>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Description</th>
                      <th className="px-6 py-3 font-medium">Paid By</th>
                      <th className="px-6 py-3 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedGroup.expenses.map(exp => (
                      <tr key={exp.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(exp.expenseDate).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-6 py-4 font-medium">{exp.title}</td>
                        <td className="px-6 py-4">{exp.paidByMember.name}</td>
                        <td className="px-6 py-4 text-right font-medium text-white">
                          {formatCurrency(exp.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GROUPS LIST VIEW */}
      {!selectedGroup && (
        loading ? (
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-40 bg-gray-900/50 rounded-2xl" />
            <div className="h-40 bg-gray-900/50 rounded-2xl" />
          </div>
        ) : groups.length === 0 && !isAddingGroup ? (
          <div className="text-center py-20 bg-gray-900/20 border border-gray-800/30 rounded-2xl border-dashed">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-gray-400 mb-4">No groups created yet</p>
            <button onClick={() => setIsAddingGroup(true)} className="text-emerald-400 hover:text-emerald-300 font-medium text-sm">
              Create a group to start splitting
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => (
              <div 
                key={group.id} 
                onClick={() => setSelectedGroup(group)}
                className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-emerald-900/10 transition-all cursor-pointer group flex flex-col justify-between h-full"
              >
                <div>
                  <h3 className="font-bold text-xl mb-1 text-white group-hover:text-emerald-400 transition-colors">{group.name}</h3>
                  <p className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
                    {group.members.slice(0, 3).map(m => m.name).join(', ')}
                    {group.members.length > 3 && <span className="text-gray-600">+{group.members.length - 3} more</span>}
                  </p>
                </div>
                <div className="flex justify-between items-end border-t border-gray-800/50 pt-4 mt-auto">
                  <div>
                    <p className="text-xs text-gray-500">Total Group Spending</p>
                    <p className="font-semibold text-lg text-gray-200">{formatCurrency(group.totalExpenses)}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
