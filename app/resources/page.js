import Link from 'next/link';

export const metadata = {
  title: "AI & ML Resources | Learning & Tracking",
  description: "Curated library of essential documentation, tutorials, and practice platforms for Data Science, Machine Learning, and Engineering.",
};

const resources = [
  {
    category: "Interview Preparation",
    icon: "🚀",
    links: [
      { name: "Python Developer Prep", url: "/resources/python-interview-prep", desc: "Memory management, mutability, and core mechanics" },
      { name: "SQL Database Prep", url: "/resources/sql-interview-prep", desc: "Indexes, Execution Plans, and Joins" },
      { name: "Pandas & Data Science Prep", url: "/resources/pandas-interview-prep", desc: "Vectorization, Imputation, and Data Wrangling" },
      { name: "Machine Learning Prep", url: "/resources/ml-interview-prep", desc: "Bias-Variance Tradeoff, Precision vs Recall" },
      { name: "Deep Learning Prep", url: "/resources/deeplearning-interview-prep", desc: "Backpropagation, ReLU, and Architecture" },
      { name: "System Design & MLOps Prep", url: "/resources/systemdesign-interview-prep", desc: "Docker, Scaling APIs, and Load Balancing" }
    ]
  }
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-mono">
      <header className="mb-6 md:mb-10 border-b border-gray-800 pb-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex gap-4">
            <Link href="/" className="text-blue-500 hover:text-blue-400 mb-2 inline-block font-bold">
              ← BACK TO TRACKER
            </Link>
            <Link href="/ask" className="text-green-500 hover:text-green-400 mb-2 inline-block font-bold">
              ASK AI 🧠 ↗
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mt-2">CRACK THE INTERVIEW</h1>
          <p className="text-gray-400 mt-2">High-yield preparation modules for Data Science and Engineering interviews.</p>
        </div>
      </header>
      
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((section, idx) => (
          <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl p-6 transition hover:border-gray-600 flex flex-col h-full">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-3 flex items-center gap-2">
              <span>{section.icon}</span> {section.category}
            </h2>
            <div className="flex flex-col gap-4 flex-grow">
              {section.links.map((link, lIdx) => (
                <Link 
                  key={lIdx} 
                  href={link.url}
                  className="group block"
                >
                  <p className="text-blue-400 font-bold group-hover:text-blue-300 transition-colors flex items-center gap-2">
                    {link.name} <span className="text-xs opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                  </p>
                  <p className="text-gray-400 text-sm mt-1">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
