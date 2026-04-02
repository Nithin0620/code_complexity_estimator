'use client';
import { useState, useEffect } from 'react';
import { getOrCreateUid } from '@/lib/auth';
import { HistoryItemParsed } from '@/types';

export default function History() {
  const [history, setHistory] = useState<HistoryItemParsed[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    const uid = getOrCreateUid();
    try {
      const res = await fetch(`/api/history?uid=${uid}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setHistory(data.map((item: any) => ({ ...item, result: JSON.parse(item.result) })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this history entry?')) return;
    try {
      const res = await fetch(`/api/history?id=${id}`, { method: 'DELETE' });
      if (res.ok) setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  function levelBg(level: string) {
    if (level === 'High') return 'bg-red-500 text-white';
    if (level === 'Medium') return 'bg-amber-500 text-slate-950';
    return 'bg-emerald-500 text-slate-950';
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <header className="border-l-4 border-cyan-500 pl-4 py-1">
        <h1 className="text-2xl font-black text-slate-100">Analysis History</h1>
        <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest">Past complexity analyses for your session</p>
      </header>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24 gap-4">
          <div className="h-6 w-6 rounded-full border-2 border-slate-800 border-t-cyan-500 animate-spin" />
          <span className="text-slate-500 text-sm">Loading records…</span>
        </div>
      )}

      {/* Empty */}
      {!loading && history.length === 0 && (
        <div className="py-24 text-center space-y-3 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-400 font-medium">No history found</p>
          <p className="text-slate-600 text-sm">Analyze some code on the Home page to see records here.</p>
        </div>
      )}

      {/* History List */}
      {!loading && history.length > 0 && (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                
                {/* Main Info */}
                <div className="flex-grow min-w-0 space-y-3">
                  {/* Badges row */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${levelBg(item.result.level)}`}>
                      {item.result.level}
                    </span>
                    {item.result.bigO && (
                      <span className="px-2.5 py-1 text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-lg italic">
                        T: {item.result.bigO}
                      </span>
                    )}
                    {item.result.spaceO && (
                      <span className="px-2.5 py-1 text-[11px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg italic">
                        S: {item.result.spaceO}
                      </span>
                    )}
                    <span className="text-slate-600 text-[11px] ml-auto">
                      {new Date(item.createdAt).toLocaleString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Code preview */}
                  <pre className="text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-28 overflow-y-auto">
                    {item.code.trim().substring(0, 400)}{item.code.length > 400 ? '…' : ''}
                  </pre>

                  {/* Reasons */}
                  <div className="flex flex-wrap gap-2">
                    {item.result.reasons.slice(0, 4).map((r, ri) => (
                      <span key={ri} className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md">
                        {r.split('(')[0].trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score + Delete */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-4 shrink-0">
                  <div className="text-center sm:text-right">
                    <p className="text-slate-600 text-[10px] uppercase tracking-widest">Score</p>
                    <p className="text-3xl font-black text-white">{item.result.score}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Delete this record"
                    className="p-2.5 rounded-xl border border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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
