'use client';
import { useState, useEffect } from 'react';
import { getOrCreateUid } from '@/lib/auth';
import { ComplexityResult, Snippet } from '@/types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

/** Color for the complexity level */
function levelColor(level: string) {
  if (level === 'High') return 'text-red-400';
  if (level === 'Medium') return 'text-amber-400';
  return 'text-emerald-400';
}
function levelBg(level: string) {
  if (level === 'High') return 'bg-red-500 text-white';
  if (level === 'Medium') return 'bg-amber-500 text-slate-950';
  return 'bg-emerald-500 text-slate-950';
}
function levelBar(level: string) {
  if (level === 'High') return 'bg-red-500';
  if (level === 'Medium') return 'bg-amber-500';
  return 'bg-emerald-500';
}
function snippetBadge(type: Snippet['type']) {
  if (type === 'nested-loop') return 'text-red-400 bg-red-400/10 border-red-400/20';
  if (type === 'recursion') return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
  if (type === 'space-allocation') return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
  return 'text-slate-400 bg-slate-700/10 border-slate-700/20';
}

export default function Home() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<ComplexityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState('');

  useEffect(() => {
    setUid(getOrCreateUid());
  }, []);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, uid }),
      });
      if (!res.ok) throw new Error('API Failed');
      setResult(await res.json());
    } catch {
      alert('Analysis error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <header className="text-center space-y-3 pt-2">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight gradient-text">
          Complexity Engine V2
        </h1>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto uppercase tracking-widest">
          Time (T) &amp; Space (S) Structural Profiling
        </p>
      </header>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* LEFT: Code Input */}
        <div className="flex flex-col gap-4">
          <label className="text-slate-500 text-xs font-bold uppercase tracking-widest px-1">Code Input</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste any code snippet here…&#10;// e.g. nested loops, recursion, collections"
            spellCheck={false}
            className="w-full h-80 bg-slate-900 border border-slate-800 focus:border-cyan-500/50 rounded-2xl p-5 font-mono text-sm resize-y text-slate-300 leading-relaxed outline-none transition-colors"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
            className="w-full py-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 font-bold text-sm uppercase tracking-[0.2em] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
                Analyzing…
              </>
            ) : (
              'Run Analysis'
            )}
          </button>
        </div>

        {/* RIGHT: Result Output */}
        <div>
          {/* Empty state */}
          {!result && !loading && (
            <div className="h-80 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 flex flex-col items-center justify-center gap-4 text-center p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <p className="text-slate-500 text-sm font-medium">Results will appear here after analysis</p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="h-80 rounded-2xl border border-slate-800 bg-slate-900/30 flex flex-col items-center justify-center gap-6">
              <div className="h-12 w-12 rounded-full border-2 border-slate-800 border-t-cyan-500 animate-spin" />
              <p className="text-slate-500 text-xs uppercase tracking-widest animate-pulse">Parsing code structure…</p>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

              {/* ── Complexity Summary ── */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                {/* Level + Score row */}
                <div className="flex items-center justify-between">
                  <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${levelBg(result.level)}`}>
                    {result.level} Complexity
                  </span>
                  <span className="text-3xl font-black text-white tabular-nums">{result.score}<span className="text-slate-500 text-sm font-medium ml-1">pts</span></span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${levelBar(result.level)}`}
                    style={{ width: `${Math.min(result.score * 2.2, 100)}%` }}
                  />
                </div>

                {/* Big-O + Space-O badges */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Time</span>
                    <span className="text-cyan-400 font-black text-lg italic">{result.bigO}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Space</span>
                    <span className="text-blue-400 font-black text-lg italic">{result.spaceO}</span>
                  </div>
                </div>

                {/* Reasons */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  {result.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                      {r}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Hotspot Lines ── */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-slate-300 text-xs font-bold uppercase tracking-widest">Hotspot Lines</h3>
                {result.snippets.length === 0 ? (
                  <p className="text-slate-600 text-xs italic">No structural hotspots detected.</p>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {result.snippets.map((snip, i) => (
                      <div key={i} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-[10px] font-mono font-bold text-slate-600 shrink-0">L{snip.line}</span>
                          <code className="text-xs text-slate-400 truncate">{snip.code}</code>
                        </div>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border shrink-0 ${snippetBadge(snip.type)}`}>
                          {snip.type.replace('-', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Growth Curve (full-width, only when result exists) ── */}
      {result && !loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-slate-200 font-bold text-sm uppercase tracking-wide">Complexity Growth Curve</h3>
              <p className="text-slate-500 text-xs mt-0.5">Operations over input size N = 1 to 10</p>
            </div>
            <span className="px-3 py-1.5 text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-xl italic">{result.bigO}</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.graphData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="n" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tick={{ dy: 8 }} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} width={35} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                  formatter={(v) => [v ?? 0, 'Operations']}
                  labelFormatter={(l) => `n = ${l}`}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  fill="url(#areaGrad)"
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
