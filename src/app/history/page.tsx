'use client';
import { useState, useEffect } from 'react';
import { getOrCreateUid } from '@/lib/auth';
import { HistoryItemParsed } from '@/types';

/**
 * Historical analysis records terminal.
 * Features a chronological list of past scans with structural summaries.
 */
export default function History() {
  const [history, setHistory] = useState<HistoryItemParsed[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    const uid = getOrCreateUid();
    try {
      const res = await fetch(`/api/history?uid=${uid}`);
      if (!res.ok) throw new Error('Failed to fetch registry');
      
      const data = await res.json();
      // Map results from JSON string back to object
      const parsedData = data.map((item: any) => ({
        ...item,
        result: JSON.parse(item.result),
      }));
      setHistory(parsedData);
    } catch (err) {
      console.error('History fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('This structural record will be permanently purged. Proceed?')) return;
    try {
      const res = await fetch(`/api/history?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-1000 pb-20">
      {/* Header section with terminal aesthetic */}
      <header className="flex flex-col gap-2 border-l-4 border-cyan-500 pl-6 py-2">
        <h1 className="text-3xl font-black text-slate-100 tracking-tight flex items-center gap-3">
          Analysis History
          <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded lowercase">v1.1.stable</span>
        </h1>
        <p className="text-slate-500 font-mono text-xs tracking-[0.2em] uppercase">Persistent structural logs retrieved from local encrypted database</p>
      </header>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center glass rounded-3xl border border-slate-800">
           <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
           </div>
           <p className="mt-8 text-slate-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">Syncing local records...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="py-40 flex flex-col items-center justify-center glass rounded-3xl border border-dashed border-slate-800 bg-slate-900/20">
           <div className="p-5 rounded-full bg-slate-900 border border-slate-800 mb-6 opacity-30">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
           </div>
           <p className="text-slate-400 text-lg font-medium">Registry empty.</p>
           <p className="text-slate-500 text-sm mt-2">No historical profiles found for your current session.</p>
        </div>
      ) : (
        <div className="grid gap-6">
           {history.map((item) => (
             <div key={item.id} className="glass p-8 rounded-3xl group flex flex-col md:flex-row gap-10 items-center justify-between border-slate-800/80 hover:border-slate-700 transition-all duration-500 shadow-2xl">
                
                {/* Information Cluster */}
                <div className="grow w-full md:w-auto space-y-6">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg ${
                            item.result.level === 'High' ? 'bg-red-500 text-white shadow-red-900/20' : 
                            item.result.level === 'Medium' ? 'bg-amber-500 text-slate-950 shadow-amber-900/20' : 
                            'bg-emerald-500 text-slate-950 shadow-emerald-900/20'
                        }`}>
                            {item.result.level} COMPLEXITY
                        </div>
                        {item.result.bigO && (
                             <div className="px-3 py-1.5 glass bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-xs font-black text-cyan-400 italic">
                                {item.result.bigO}
                             </div>
                        )}
                        <div className="flex items-center gap-2 text-slate-500 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span className="font-mono text-[10px] tracking-tighter uppercase whitespace-nowrap">
                                {new Date(item.createdAt).toLocaleString(undefined, {
                                    year: 'numeric', month: 'short', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800 rounded-full opacity-50"></div>
                        <div className="pl-6 pt-2 pb-1">
                             <p className="text-slate-300 font-mono text-xs leading-relaxed line-clamp-3 overflow-hidden bg-slate-950/60 p-5 rounded-2xl border border-slate-800 shadow-inner group-hover:border-slate-700/50 transition-colors">
                                {item.code.replace(/\n\s*\n/g, '\n').trim().substring(0, 300)}
                                {item.code.length > 300 && '...'}
                             </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pl-6">
                         {item.result.reasons.slice(0, 3).map((reason, ri) => (
                             <span key={ri} className="text-[10px] bg-slate-800/50 text-slate-500 px-2 py-0.5 rounded border border-slate-700/30 font-medium">
                                 {reason.split('(+')[0].split(' (Score')[0].trim()}
                             </span>
                         ))}
                    </div>
                </div>

                {/* Score & Actions Section */}
                <div className="flex items-center gap-10 shrink-0 self-center md:self-stretch pt-4 md:pt-0">
                    <div className="h-full w-px bg-slate-800 hidden md:block opacity-30"></div>
                    
                    <div className="flex flex-col items-center md:items-end gap-6 justify-center">
                        <div className="text-center md:text-right">
                             <p className="text-slate-500 text-[9px] uppercase font-bold tracking-[0.25em] mb-2 opacity-80">Metrics Output</p>
                             <div className="flex items-baseline gap-1">
                                <span className="text-6xl font-black text-white tracking-tighter group-hover:text-cyan-400 transition-colors duration-500">{item.result.score}</span>
                                <span className="text-slate-600 text-sm font-bold">pts</span>
                             </div>
                        </div>
                        
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="group/btn flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/30 transition-all hover:scale-105 active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="text-xs font-black uppercase tracking-widest group-hover/btn:opacity-100 opacity-0 md:opacity-0 transition-opacity">Purge</span>
                        </button>
                    </div>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
