import Link from 'next/link';
import { auth } from '@/lib/auth';

export default async function HubPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#05050A] text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-7000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center mb-20 w-full max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 shadow-2xl shadow-purple-500/10 hover:bg-white/10 transition-colors cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping absolute"></span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 relative"></span>
            <span className="text-xs font-semibold tracking-wide text-gray-300 uppercase ml-2">System Online</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              Envy Tag
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Your elite command center for mastering skills and conquering your finances. 
            Choose your protocol below to begin.
          </p>

          {/* Auth controls */}
          <div className="flex items-center justify-center gap-4 mt-10">
            {session ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 backdrop-blur-lg border border-white/10 px-6 py-3 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-black font-bold text-lg shadow-inner">
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Logged in as</p>
                    <p className="text-sm text-white font-medium">{session.user.name}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10 hidden sm:block mx-2"></div>
                <form action={async () => { 'use server'; const { logoutAction } = await import('@/lib/auth-actions'); await logoutAction(); }}>
                  <button className="text-sm font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-red-500/20 border border-transparent hover:border-red-500/50 px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Disconnect
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/login" className="text-base text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3.5 rounded-2xl transition-all font-semibold shadow-lg backdrop-blur-md">
                  Sign In
                </Link>
                <Link href="/signup" className="text-base text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 px-8 py-3.5 rounded-2xl transition-all font-bold shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] hover:-translate-y-0.5 transform duration-200">
                  Initialize Profile
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Track Cards */}
        <div className={`w-full grid gap-8 max-w-5xl ${session?.user?.email === 'srirubankumar@gmail.com' ? 'md:grid-cols-2' : 'max-w-3xl mx-auto'}`}>
          
          {/* Learning Track */}
          {session?.user?.email === 'srirubankumar@gmail.com' && (
            <Link href="/learn" className="group block h-full">
              <div className="relative overflow-hidden bg-black/40 border border-white/10 rounded-[2rem] p-8 md:p-10 backdrop-blur-xl hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:-translate-y-1 h-full flex flex-col">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/5 group-hover:to-transparent transition-all duration-500"></div>
                
                <div className="relative z-10 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] mb-8 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-500">
                    <div className="w-full h-full bg-gray-950 rounded-2xl flex items-center justify-center text-3xl">
                      🧠
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                    Cognitive Track
                  </h2>
                  <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                    Embark on the 240-day intensive. Master the architecture of Data Science, Machine Learning, and Engineering ecosystems.
                  </p>
                  
                  <div className="flex flex-wrap gap-2.5 mb-8">
                    {['Python', 'SQL', 'ML', 'Deep Learning', 'MLOps'].map((tag) => (
                      <span key={tag} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 backdrop-blur-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                  <span className="tracking-wide uppercase text-sm">Access mainframe</span>
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors group-hover:translate-x-1 duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Money Track */}
          <Link href="/money/dashboard" className="group block h-full">
            <div className={`relative overflow-hidden bg-black/40 border border-white/10 rounded-[2rem] p-8 md:p-10 backdrop-blur-xl transition-all duration-500 hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:-translate-y-1 h-full flex flex-col`}>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 via-teal-600/0 to-emerald-600/0 group-hover:from-emerald-600/10 group-hover:via-teal-600/5 group-hover:to-transparent transition-all duration-500"></div>
              
              <div className="relative z-10 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-[1px] mb-8 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-500">
                  <div className="w-full h-full bg-gray-950 rounded-2xl flex items-center justify-center text-3xl">
                    💎
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors duration-300">
                  Wealth Track
                </h2>
                <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                  Your absolute financial operating system. Unify accounts, optimize cash flow, monitor liabilities, and scale investments.
                </p>
                
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {['Accounts', 'Budgeting', 'Credit', 'Liabilities', 'Assets'].map((tag) => (
                    <span key={tag} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 backdrop-blur-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-emerald-400 font-semibold group-hover:text-emerald-300 transition-colors">
                <span className="tracking-wide uppercase text-sm">Access terminal</span>
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors group-hover:translate-x-1 duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <footer className="mt-24 pb-8 text-center w-full">
          <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>
          <p className="text-gray-600 text-sm font-medium tracking-widest uppercase">
            Designed for execution · Envy Tag
          </p>
        </footer>
      </div>
    </div>
  );
}
