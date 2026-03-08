import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const resourcePath = path.join(process.cwd(), 'data', 'resources', `${slug}.json`);
  
  let title = `Resource | Learning & Tracking`;
  let desc = `Deep dive documentation and learning materials for ${slug}.`;

  try {
    const file = await fs.readFile(resourcePath, 'utf8');
    const resource = JSON.parse(file);
    title = `${resource.title} Reference | Learning & Tracking`;
    
    if (resource.content) {
      let cleanDesc = resource.content.replace(/[#*`\n\\]/g, ' ').substring(0, 150).trim();
      desc = `${cleanDesc}...`;
    }
  } catch (e) {
    // Fallback gracefully
  }

  return {
    title,
    description: desc,
  };
}

export default async function ResourceSlugPage({ params }) {
  const { slug } = await params;
  
  const resourcePath = path.join(process.cwd(), 'data', 'resources', `${slug}.json`);
  let resource = null;
  
  try {
    const file = await fs.readFile(resourcePath, 'utf8');
    resource = JSON.parse(file);
  } catch (e) {
    return (
      <div className="min-h-screen bg-black text-white p-10 font-mono flex flex-col items-center justify-center">
        <h1 className="text-4xl text-red-500 font-bold mb-4">RESOURCE NOT FOUND</h1>
        <p className="text-gray-400 mb-8">The requested module "{slug}" does not exist in the local database.</p>
        <Link href="/resources" className="bg-gray-800 border border-gray-600 px-6 py-2 rounded font-bold hover:bg-gray-700">
          ← BACK TO LIBRARY
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-mono">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <Link href="/resources" className="text-gray-400 hover:text-gray-200 font-bold">
          ← BACK TO LIBRARY
        </Link>
        <div className="flex gap-3">
          <Link href="/ask" className="text-green-400 hover:text-green-200 font-bold text-sm bg-gray-900 border border-green-800 px-3 py-1 rounded transition-colors">
            ASK AI 🧠 ↗
          </Link>
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400 font-bold text-sm bg-gray-900 border border-blue-900 px-3 py-1 rounded transition-colors"
          >
            OFFICIAL DOCS ↗
          </a>
        </div>
      </div>
      
      <header className="mb-6 md:mb-10 border-b border-gray-800 pb-6 md:pb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-100 leading-tight">{resource.title}</h1>
        {resource.keywords && resource.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {resource.keywords.map((kw, i) => (
              <span key={i} className="bg-blue-900 text-blue-200 border border-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {kw}
              </span>
            ))}
          </div>
        )}
      </header>

      <main className="grid gap-6 md:gap-8">
        {resource.keyTakeaways && resource.keyTakeaways.length > 0 && (
          <section className="bg-gray-800 p-5 md:p-8 rounded-xl border border-blue-600 shadow-lg shadow-blue-900/20">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2">
              <span>⚡</span> TL;DR / KEY TAKEAWAYS
            </h2>
            <ul className="space-y-3">
              {resource.keyTakeaways.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-200 leading-relaxed text-base md:text-lg">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="bg-gray-900 p-5 md:p-8 rounded-xl border border-gray-800">
           <div className="text-gray-300 leading-relaxed text-base md:text-lg overflow-x-auto">
            <ReactMarkdown 
              components={{
                h3: ({node, ...props}) => <h3 className="text-2xl font-bold mt-6 mb-3 text-white" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-blue-300" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 my-4" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 my-4" {...props} />,
                p: ({node, ...props}) => <p className="mb-4" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline ? 
                  <code className="bg-black text-pink-400 px-1 py-0.5 rounded text-sm" {...props} /> :
                  <code className="block bg-black p-4 rounded text-sm my-4 overflow-x-auto text-blue-300" {...props} />
              }}
            >
              {resource.content}
            </ReactMarkdown>
          </div>
        </section>

        {resource.codeExample && (
          <section className="bg-gray-900 p-5 md:p-8 rounded-xl border border-gray-800">
            <div className="bg-black p-4 md:p-6 rounded-lg overflow-x-auto border border-gray-700">
              <ReactMarkdown 
                components={{
                  h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3 text-white" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-3 text-white" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-md font-bold mb-2 text-white" {...props} />,
                  p: ({node, ...props}) => <p className="text-blue-300 font-mono text-xs md:text-sm leading-loose whitespace-pre-wrap sm:whitespace-pre mb-2" {...props} />,
                  code: ({node, inline, ...props}) => 
                    <code className="text-blue-300 font-mono text-xs md:text-sm leading-loose" {...props} />
                }}
              >
                {resource.codeExample}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {resource.practiceQuestions && resource.practiceQuestions.length > 0 && (
          <section className="bg-gray-900 p-5 md:p-8 rounded-xl border border-gray-800 mt-4">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-purple-400">PRACTICE QUESTIONS</h2>
            <ul className="list-decimal list-inside text-gray-300 space-y-3 md:space-y-4 text-base md:text-lg">
              {resource.practiceQuestions.map((q, idx) => (
                <li key={idx} className="leading-relaxed bg-black p-3 md:p-4 rounded-lg border border-gray-800 break-words">{q}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
