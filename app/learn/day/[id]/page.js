import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getLearningTasks } from '@/lib/actions';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const lessonPath = path.join(process.cwd(), 'data', 'lessons', `${id}.json`);
  let title = `Day ${id} | Learning & Tracking`;
  let desc = `Comprehensive material for Day ${id}.`;
  try {
    const file = await fs.readFile(lessonPath, 'utf8');
    const lesson = JSON.parse(file);
    title = `${lesson.title} | Learning & Tracking`;
    if (lesson.content) {
      desc = lesson.content.replace(/[#*`\n\\]/g, ' ').substring(0, 150).trim() + '...';
    }
  } catch (e) {}
  return { title, description: desc };
}

export default async function DayPage({ params }) {
  const { id } = await params;
  const lessonPath = path.join(process.cwd(), 'data', 'lessons', `${id}.json`);
  let lesson = null;
  try {
    const file = await fs.readFile(lessonPath, 'utf8');
    lesson = JSON.parse(file);
  } catch (e) {
    if (e.code === 'ENOENT') {
      const masteryList = await getLearningTasks();
      const dbItem = masteryList.find(item => item.lessonId.toString() === id);
      lesson = {
        title: dbItem ? dbItem.topic : "Topic Not Found",
        content: "Content for this module is coming soon!",
        codeExample: null,
        practiceQuestions: null
      };
    } else { throw e; }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-mono">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <Link href="/learn" className="text-blue-500 hover:text-blue-400 font-bold">
          ← BACK TO LEARNING & TRACKING
        </Link>
        <div className="flex gap-3">
          <Link href="/learn/ask" className="text-green-400 hover:text-green-200 font-bold text-sm bg-gray-900 border border-green-800 px-3 py-1 rounded transition-colors">
            ASK AI 🧠 ↗
          </Link>
        </div>
      </div>

      <header className="mb-6 md:mb-10 border-b border-gray-800 pb-6 md:pb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-blue-500 leading-tight">{lesson.title}</h1>
        {lesson.keywords && lesson.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {lesson.keywords.map((kw, i) => (
              <span key={i} className="bg-blue-900 text-blue-200 border border-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{kw}</span>
            ))}
          </div>
        )}
      </header>

      <main className="grid gap-6 md:gap-8">
        {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
          <section className="bg-gray-800 p-5 md:p-8 rounded-xl border border-blue-600 shadow-lg shadow-blue-900/20">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2"><span>⚡</span> TL;DR / KEY TAKEAWAYS</h2>
            <ul className="space-y-3">
              {lesson.keyTakeaways.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-200 leading-relaxed text-base md:text-lg">
                  <span className="text-blue-500 mt-1">✓</span><span>{pt}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="bg-gray-900 p-5 md:p-8 rounded-xl border border-gray-800">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-green-400">TUTORIAL</h2>
          <div className="text-gray-300 leading-relaxed text-base md:text-lg overflow-x-auto">
            <ReactMarkdown
              components={{
                h3: ({ node, ...props }) => <h3 className="text-2xl font-bold mt-6 mb-3 text-white" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold text-blue-300" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 my-4" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 my-4" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                code: ({ node, inline, ...props }) =>
                  inline ?
                    <code className="bg-black text-pink-400 px-1 py-0.5 rounded text-sm" {...props} /> :
                    <code className="block bg-black p-4 rounded text-sm my-4 overflow-x-auto text-blue-300" {...props} />
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>
        </section>

        {lesson.codeExample && (
          <section className="mt-8 md:mt-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-yellow-400 flex items-center gap-2"><span>💻</span> WORKING EXAMPLE</h2>
            <div className="rounded-xl overflow-hidden border border-gray-700 shadow-2xl bg-[#0d1117]">
              <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700 select-none">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <div className="ml-4 text-xs font-mono text-gray-400 flex-1 text-center pr-12">code_editor</div>
              </div>
              <div className="p-4 md:p-6 overflow-x-auto text-sm md:text-base">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 text-purple-400 font-sans" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-3 text-purple-400 font-sans" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-md font-bold mb-2 text-purple-400 font-sans" {...props} />,
                    p: ({ node, ...props }) => <div className="text-green-300 font-mono leading-loose whitespace-pre-wrap sm:whitespace-pre" {...props} />,
                    code: ({ node, inline, ...props }) => <code className="text-pink-400 font-mono" {...props} />
                  }}
                >
                  {lesson.codeExample}
                </ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {lesson.practiceQuestions && lesson.practiceQuestions.length > 0 && (
          <section className="bg-gray-900 p-5 md:p-8 rounded-xl border border-gray-800">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-purple-400">PRACTICE QUESTIONS</h2>
            <ul className="list-decimal list-inside text-gray-300 space-y-3 md:space-y-4 text-base md:text-lg">
              {lesson.practiceQuestions.map((q, idx) => (
                <li key={idx} className="leading-relaxed bg-black p-3 md:p-4 rounded-lg border border-gray-800 break-words">{q}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
