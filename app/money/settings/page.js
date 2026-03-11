'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
          <select className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50">
            <option value="INR">₹ INR (Indian Rupee)</option>
            <option value="USD">$ USD (US Dollar)</option>
            <option value="EUR">€ EUR (Euro)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Salary Day</label>
          <input type="number" min="1" max="31" defaultValue="1"
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50" />
          <p className="text-xs text-gray-600 mt-1">Day of month when salary is credited</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Timezone</label>
          <select className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50">
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
        </div>

        <button type="submit"
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20">
          Save Changes
        </button>

        {saved && (
          <p className="text-emerald-400 text-sm flex items-center gap-2">✓ Settings saved</p>
        )}
      </form>
    </div>
  );
}
