'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/money/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/money/accounts', label: 'Accounts', icon: '🏦' },
  { href: '/money/transactions', label: 'Transactions', icon: '💳' },
  { href: '/money/recurring', label: 'Recurring', icon: '🔄' },
  { href: '/money/credit-cards', label: 'Credit Cards', icon: '💳' },
  { href: '/money/loans', label: 'Loans & EMI', icon: '📉' },
  { href: '/money/groups', label: 'Group Splits', icon: '👥' },
  { href: '/money/borrow-lend', label: 'Borrow/Lend', icon: '🤝' },
  { href: '/money/investments', label: 'Investments', icon: '📈' },
  { href: '/money/reports', label: 'Reports', icon: '📈' },
  { href: '/money/settings', label: 'Settings', icon: '⚙️' },
];

export default function MoneyLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-gray-950/80 border-r border-gray-800/50 backdrop-blur-xl flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-800/50">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              💰
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">MoneyFlow</h1>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest">Finance OS</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/5'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-800/50">
          <Link href="/learn" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-500 hover:text-blue-400 rounded-xl hover:bg-blue-500/5 transition-all">
            <span className="text-lg">🧠</span>
            Learning Track
          </Link>
          <Link href="/" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-400 rounded-xl hover:bg-gray-800/30 transition-all mt-1">
            <span className="text-lg">←</span>
            Back to Hub
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-gray-800/30">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
