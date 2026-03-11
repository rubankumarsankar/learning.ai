import { createEntry, toggleStatus, resetTracker, setStartDate, getLearningTasks, deleteTask, isLearningAllowed } from '@/lib/actions';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const PHASE_CONFIG = [
  { name: "Coding Foundations", start: 1, end: 40, emoji: "🐍", gradient: "from-blue-600 to-cyan-500", border: "border-blue-500/30", bg: "bg-blue-500/5" },
  { name: "Data Handling & SQL", start: 41, end: 80, emoji: "🗃️", gradient: "from-emerald-600 to-teal-500", border: "border-emerald-500/30", bg: "bg-emerald-500/5" },
  { name: "Machine Learning Core", start: 81, end: 130, emoji: "🤖", gradient: "from-purple-600 to-pink-500", border: "border-purple-500/30", bg: "bg-purple-500/5" },
  { name: "Deep Learning & AI", start: 131, end: 165, emoji: "🧠", gradient: "from-orange-500 to-amber-500", border: "border-orange-500/30", bg: "bg-orange-500/5" },
  { name: "Backend & AI Eng", start: 166, end: 195, emoji: "⚙️", gradient: "from-red-600 to-rose-500", border: "border-red-500/30", bg: "bg-red-500/5" },
  { name: "Deployment & MLOps", start: 196, end: 215, emoji: "🚀", gradient: "from-indigo-600 to-violet-500", border: "border-indigo-500/30", bg: "bg-indigo-500/5" },
  { name: "Portfolio Projects", start: 216, end: 235, emoji: "📁", gradient: "from-yellow-500 to-orange-500", border: "border-yellow-500/30", bg: "bg-yellow-500/5" },
  { name: "Interview & Launch", start: 236, end: 240, emoji: "🎯", gradient: "from-green-500 to-emerald-500", border: "border-green-500/30", bg: "bg-green-500/5" },
];

export default async function LearnPage() {
  const allowed = await isLearningAllowed();
  if (!allowed) redirect('/');

  const masteryList = await getLearningTasks();

  const totalTasks = masteryList.length;
  const completed = masteryList.filter(item => item.status === "✅ Done").length;
  const inProgress = masteryList.filter(item => item.status === "🚀 In Progress").length;
  const review = masteryList.filter(item => item.status === "🚩 Review Needed").length;
  const todo = masteryList.filter(item => item.status === "⬜ To-Do").length;
  const progressPercent = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;
  const hasStartDate = masteryList.length > 0 && !!masteryList[0].date;

  const phaseGroups = PHASE_CONFIG.map(phase => {
    const items = masteryList.filter(item => {
      const id = item.lessonId;
      return id >= phase.start && id <= phase.end;
    });
    const done = items.filter(i => i.status === "✅ Done").length;
    return { ...phase, items, done, total: items.length };
  });

  let streak = 0;
  const sortedDone = masteryList
    .filter(i => i.status === "✅ Done")
    .sort((a, b) => b.lessonId - a.lessonId);
  if (sortedDone.length > 0) {
    const maxId = sortedDone[0].lessonId;
    for (let i = maxId; i >= 1; i--) {
      const item = masteryList.find(m => m.lessonId === i);
      if (item && item.status === "✅ Done") streak++;
      else break;
    }
  }

  const daysLeft = totalTasks - completed;
  const estimatedWeeks = Math.ceil(daysLeft / 7);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Overview</h2>
          <p className="text-gray-500 text-sm">Track your progress through the 240-day AI/ML curriculum.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {!hasStartDate && (
            <form action={setStartDate}>
              <button className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold hover:bg-purple-500/20 transition-all text-xs sm:text-sm">
                <span>📅</span> Start Plan
              </button>
            </form>
          )}
          <form action={resetTracker}>
            <button className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold hover:bg-red-500/20 transition-all text-xs sm:text-sm">
              <span>🔄</span> Reset
            </button>
          </form>
        </div>
      </div>

      {totalTasks > 0 && (
          <section className="mb-8 md:mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              <div className="col-span-2 sm:col-span-1 lg:row-span-2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col items-center justify-center backdrop-blur-sm">
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-2 sm:mb-3">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="url(#progressGrad)" strokeWidth="10"
                      strokeDasharray={`${progressPercent * 3.14} ${314 - progressPercent * 3.14}`}
                      strokeLinecap="round" className="transition-all duration-1000" />
                    <defs>
                      <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{progressPercent}%</span>
                    <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">Complete</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs text-center">{completed} of {totalTasks} days</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-3 sm:p-4 md:p-5 backdrop-blur-sm hover:border-green-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 text-sm">✅</div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Done</span>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">{completed}</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-3 sm:p-4 md:p-5 backdrop-blur-sm hover:border-yellow-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 text-sm">🚀</div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Active</span>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400">{inProgress}</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-3 sm:p-4 md:p-5 backdrop-blur-sm hover:border-red-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 text-sm">🚩</div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Review</span>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-400">{review}</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-3 sm:p-4 md:p-5 backdrop-blur-sm hover:border-gray-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-500/10 flex items-center justify-center text-gray-400 text-sm">⏳</div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Remaining</span>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-400">{todo}</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-3 sm:p-4 md:p-5 backdrop-blur-sm hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 text-sm">🔥</div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Streak</span>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-400">{streak}</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-3 sm:p-4 md:p-5 backdrop-blur-sm hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-sm">📊</div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">ETA</span>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400">{estimatedWeeks}<span className="text-sm font-normal text-gray-500 ml-1">wk</span></p>
              </div>
            </div>
          </section>
        )}

        <form action={createEntry} className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row gap-3 bg-gray-900/30 border border-gray-800/50 rounded-2xl p-3 backdrop-blur-sm">
            <input
              name="topic"
              placeholder="✏️  What are we mastering today?"
              className="bg-gray-800/50 border border-gray-700/50 p-3 sm:p-3.5 md:p-4 rounded-xl flex-1 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none placeholder-gray-600 text-gray-200 transition-all text-sm sm:text-base"
              required
            />
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 md:py-4 rounded-xl font-bold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 text-sm uppercase tracking-wider">
              Log Task
            </button>
          </div>
        </form>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">ROADMAP</span>
            <span className="text-gray-600">/ 8 Phases</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-8 sm:mb-10">
            {phaseGroups.map((phase, idx) => {
              const pct = phase.total > 0 ? Math.round((phase.done / phase.total) * 100) : 0;
              return (
                <a key={idx} href={`#phase-${idx}`} className={`${phase.bg} border ${phase.border} rounded-2xl p-3 sm:p-4 hover:scale-[1.02] transition-all cursor-pointer group overflow-hidden`}>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <span className="text-base sm:text-xl shrink-0">{phase.emoji}</span>
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider leading-tight">{phase.name}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xl font-bold text-white">{pct}%</p>
                      <p className="text-[10px] text-gray-500">{phase.done}/{phase.total} days</p>
                    </div>
                    <div className="w-12 h-12">
                      <svg viewBox="0 0 40 40" className="w-full h-full transform -rotate-90">
                        <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                        <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor"
                          className={`text-${phase.gradient.split('-')[1]}-500 transition-all`}
                          strokeWidth="4" strokeDasharray={`${pct * 0.94} ${94 - pct * 0.94}`}
                          strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {phaseGroups.map((phase, phaseIdx) => (
            <div key={phaseIdx} id={`phase-${phaseIdx}`} className="mb-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 sticky top-0 bg-[#0a0a0f]/90 backdrop-blur-md py-2.5 sm:py-3 z-20 border-b border-gray-800/30">
                <span className="text-base sm:text-xl shrink-0">{phase.emoji}</span>
                <h3 className={`text-sm sm:text-lg font-bold bg-gradient-to-r ${phase.gradient} bg-clip-text text-transparent truncate`}>
                  {phase.name}
                </h3>
                <span className="text-[10px] sm:text-xs text-gray-600 ml-auto shrink-0 hidden sm:inline">Days {phase.start}–{phase.end}</span>
                <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 shrink-0">{phase.done}/{phase.total}</span>
              </div>

              <div className="grid gap-2">
                {phase.items.map((item) => {
                  const dayId = item.lessonId || item.id;
                  const statusStyles = {
                    "⬜ To-Do": "border-gray-800/50 hover:border-gray-600/50",
                    "🚀 In Progress": "border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/40",
                    "🚩 Review Needed": "border-red-500/20 bg-red-500/5 hover:border-red-500/40",
                    "✅ Done": "border-green-500/20 bg-green-500/5 hover:border-green-500/30",
                  };
                  const btnStyles = {
                    "⬜ To-Do": "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:bg-gray-700/50",
                    "🚀 In Progress": "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20",
                    "🚩 Review Needed": "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20",
                    "✅ Done": "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20",
                  };

                  return (
                    <div key={item.id} className={`bg-gray-900/30 backdrop-blur-sm rounded-xl border ${statusStyles[item.status] || statusStyles["⬜ To-Do"]} flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 md:p-4 transition-all group overflow-hidden`}>
                      <span className={`text-[10px] sm:text-xs font-mono px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-gray-800/80 text-gray-500 shrink-0 ${item.status === "✅ Done" ? "text-green-500" : ""}`}>
                        {String(dayId).padStart(3, '0')}
                      </span>
                      <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-gray-800/60 text-gray-600 shrink-0">
                        #{item.id}
                      </span>
                      <div className="min-w-0 flex-1">
                        <Link href={`/learn/day/${dayId}`} className="hover:text-blue-300 transition-colors block">
                          <p className={`text-sm sm:text-base font-medium truncate ${item.status === "✅ Done" ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                            {item.topic}
                          </p>
                        </Link>
                        {item.date && (
                          <p className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5">{item.date}</p>
                        )}
                      </div>
                      <form action={toggleStatus.bind(null, item.id)} className="shrink-0">
                        <button className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap ${btnStyles[item.status] || btnStyles["⬜ To-Do"]}`}>
                          {item.status}
                        </button>
                      </form>
                      <form action={deleteTask.bind(null, item.id)} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-1.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-[10px] sm:text-xs transition-all" title="Delete task">
                          🗑️
                        </button>
                      </form>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <footer className="text-center py-8 border-t border-gray-800/30">
          <p className="text-gray-600 text-sm">
            Built with 🔥 for the 240-Day AI/ML Journey
          </p>
        </footer>
    </>
  );
}
