import Link from 'next/link';
import { auth } from '@/lib/auth';

export default async function HubPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-emerald-600/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/6 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-purple-500/20">
              ET
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Envy Tag
              </span>
              <span className="text-gray-500 font-normal ml-2 text-lg md:text-xl">Tracker</span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Your personal command center for mastering skills and managing money.
            Choose your track below.
          </p>

          {/* Auth buttons */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  Welcome, <span className="text-emerald-400 font-medium">{session.user.name}</span>
                </span>
                <form action={async () => { 'use server'; const { logoutAction } = await import('@/lib/auth-actions'); await logoutAction(); }}>
                  <button className="text-xs text-gray-500 hover:text-red-400 border border-gray-800 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-all">
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" className="text-sm text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 px-4 py-2 rounded-xl hover:bg-emerald-500/10 transition-all font-medium">
                  Sign In
                </Link>
                <Link href="/signup" className="text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all font-medium shadow-lg shadow-emerald-500/20">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Track Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Learning Track - only for srirubankumar@gmail.com */}
          {session?.user?.email === 'srirubankumar@gmail.com' && (
            <Link href="/learn" className="group">
              <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl mb-5 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  🧠
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  Learning Track
                </h2>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Track your 240-day AI/ML journey. Master data science, machine learning,
                  deep learning, and software engineering with daily progress tracking.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'SQL', 'ML', 'Deep Learning', 'MLOps'].map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-center text-blue-400 text-sm font-medium group-hover:gap-3 gap-2 transition-all">
                  Open Dashboard <span className="text-lg">→</span>
                </div>
              </div>
            </Link>
          )}

          {/* Money Track */}
          <Link href="/money/dashboard" className="group">
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl mb-5 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                💰
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                Money Track
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your smart personal finance operating system. Manage accounts, track expenses,
                monitor credit cards, EMIs, investments, and optimize your cash flow.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Accounts', 'Budget', 'Cards', 'EMI', 'Investments'].map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center text-emerald-400 text-sm font-medium group-hover:gap-3 gap-2 transition-all">
                Open Dashboard <span className="text-lg">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center pt-16">
          <p className="text-gray-700 text-sm">
            Built with 🔥 · Learning + Earning
          </p>
        </footer>
      </div>
    </div>
  );
}
