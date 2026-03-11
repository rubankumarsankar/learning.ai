'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/learn', label: 'Dashboard', icon: '📊' },
  { href: '/learn/ask', label: 'Ask AI', icon: '🧠' },
  { href: '/learn/resources', label: 'Resources', icon: '📚' },
];

export default function LearnLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#05050A] text-white flex selection:bg-blue-500/30">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#0a0a0f]/90 border-r border-white/5 backdrop-blur-2xl flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0 shadow-2xl shadow-blue-500/10' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300 p-[1px]">
               <div className="w-full h-full bg-gray-950 rounded-2xl flex items-center justify-center">
                 L
               </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">Envy Tag</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium mt-0.5">Cognitive Track</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4 px-2">Menu</div>
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/learn'
              ? pathname === '/learn'
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 relative group ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-100'
                }`}
              >
                {/* Active Background Glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/10 rounded-2xl border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]"></div>
                )}
                
                {/* Hover Background */}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                )}

                <span className="text-xl relative z-10 grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100">
                  {item.icon}
                </span>
                <span className="relative z-10">{item.label}</span>
                
                {isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Link href="/money/dashboard" className="group flex items-center justify-between px-4 py-3 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity">💰</span>
              <span className="text-sm font-medium text-emerald-500 group-hover:text-emerald-400 transition-colors">Wealth Track</span>
            </div>
            <svg className="w-4 h-4 text-emerald-600 group-hover:text-emerald-400 transition-colors group-hover:translate-x-1 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-300 group">
            <svg className="w-5 h-5 opacity-70 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Hub
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden relative">
        {/* Subtle background glow for main area */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-[#05050A]/80 backdrop-blur-xl border-b border-white/5 lg:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px]">
                <div className="w-full h-full bg-gray-950 rounded-lg flex items-center justify-center text-sm font-bold">
                  L
                </div>
              </div>
              <span className="font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Envy Tag</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-2 -mr-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              aria-label="Open Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 xl:p-10 overflow-y-auto relative z-10 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
