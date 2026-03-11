"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { handleAsk } from '@/lib/ask';

export default function AskPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I am your AI Study Assistant. Ask me a question like 'How do I learn SQL?' or 'What is a Neural Network?' and I will search the curriculum to find what you should study." }
  ]);
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function submit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    const userMsg = { role: 'user', content: query.trim() };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);
    const results = await handleAsk(userMsg.content);
    let aiResponse = results.length === 0
      ? "I couldn't find any specific modules matching your question. Try keywords like 'Python', 'TensorFlow', 'DataFrames', or 'SQL'!"
      : `Found ${results.length} relevant modules:`;
    setMessages(prev => [...prev, { role: 'ai', content: aiResponse, results }]);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-mono flex flex-col h-screen">
      <header className="mb-4 border-b border-gray-800 pb-5 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <Link href="/learn" className="text-blue-500 hover:text-blue-400 mb-2 inline-block font-bold">← BACK TO TRACKER</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-green-500 mt-2 flex items-center gap-3"><span>🧠</span> AI STUDY ASSISTANT</h1>
          <p className="text-gray-400 mt-2">Offline semantic search for 260+ curriculum files and resources.</p>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto mb-4 bg-gray-900 rounded-xl border border-gray-800 p-4 md:p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col max-w-3xl ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
            <div className={`p-4 rounded-xl text-base md:text-lg leading-relaxed ${msg.role === 'user' ? 'bg-blue-900 border border-blue-700 text-blue-100 rounded-br-none' : 'bg-black border border-gray-700 text-gray-300 rounded-bl-none'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'ai' && msg.results && msg.results.length > 0 && (
              <div className="mt-4 flex flex-col gap-3 w-full">
                {msg.results.map((r, rIdx) => (
                  <Link key={rIdx} href={r.url} className="group block bg-black border border-gray-800 hover:border-green-600 p-4 rounded-lg transition-colors w-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-green-400 font-bold text-lg group-hover:text-green-300 transition-colors">{r.title}</h3>
                      <span className="text-xs font-bold px-2 py-1 bg-gray-800 text-gray-500 rounded uppercase">{r.type} • Match Score: {r.score}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{r.excerpt}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="mr-auto items-start flex flex-col max-w-3xl">
            <div className="p-4 rounded-xl bg-black border border-gray-700 text-gray-400 italic rounded-bl-none animate-pulse">Analyzing local curriculum databases...</div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </main>

      <footer className="shrink-0 bg-gray-900 p-4 rounded-xl border border-gray-800">
        <form onSubmit={submit} className="flex gap-3">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} disabled={loading} placeholder="What would you like to learn about?"
            className="flex-grow bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 font-sans" />
          <button type="submit" disabled={loading || !query.trim()} className="bg-green-700 hover:bg-green-600 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">ASK ↗</button>
        </form>
      </footer>
    </div>
  );
}
