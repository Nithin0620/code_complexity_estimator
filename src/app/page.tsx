'use client';
import { useState, useEffect } from 'react';
import { getOrCreateUid } from '@/lib/auth';
import { ComplexityResult } from '@/types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

/**
 * Enhanced analysis dashboard.
 * Provides a code editor, Big-O estimations, structural hotspots, and temporal growth visualization.
 */
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
      
      if (!res.ok) throw new Error('API Request Failed');
      
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Internal analysis error. Please try again or refine your snippet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      {/* Header */}
      <header className="text-center space-y-4 pt-8">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
          <span className="gradient-text">Algorithmic Profiler</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-3xl mx-auto font-medium leading-relaxed">
          Estimate time complexity, Big-O notation, and detect hotspot lines 
          using structural heuristics and local lexical analysis.
        </p>
      </header>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Input (5 Grid Units) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative group">
             <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
             
             <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste code structure here (e.g. nested for-loops or recursive functions)..."
              spellCheck={false}
              className="relative w-full h-[550px] bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 font-mono text-sm resize-none focus:outline-none focus:border-cyan-500/30 transition-all text-slate-300 shadow-2xl overflow-auto leading-relaxed"
            />
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
            className="w-full py-6 px-8 glass hover:bg-slate-800/80 disabled:opacity-20 disabled:cursor-not-allowed text-cyan-400 font-black uppercase text-xs tracking-[0.4em] rounded-3xl shadow-2xl transition-all active:scale-[0.98] border border-cyan-500/20 group flex items-center justify-center gap-4"
          >
            {loading ? 'CALCULATING PARAMETERS...' : 'ESTIMATE COMPLEXITY'}
            {!loading && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </button>
        </div>

        {/* Right: Output (7 Grid Units) */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Empty State */}
          {!result && !loading && (
            <div className="h-[550px] flex flex-col items-center justify-center glass rounded-3xl border border-dashed border-slate-800 text-slate-500 p-12 text-center">
               <div className="p-6 rounded-full bg-slate-900 border border-slate-800 mb-8 opacity-40 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
               </div>
              <h3 className="text-slate-300 font-black text-xl mb-3 uppercase tracking-widest">Awaiting Registry Input</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                No active session parameters found. Analyze a snippet to view Big-O growth and hotspot lines.
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
             <div className="h-[550px] flex flex-col items-center justify-center glass rounded-3xl border border-cyan-500/10">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-cyan-500 animate-spin opacity-40"></div>
                </div>
                <p className="mt-10 text-slate-400 animate-pulse font-black text-[10px] uppercase tracking-[0.4em]">Optimizing Analysis Matrix...</p>
             </div>
          )}

          {/* Results Result Display */}
          {result && !loading && (
            <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-10">
               
               {/* Metrics Card */}
               <div className="glass p-10 rounded-[3rem] border border-slate-800 relative z-10 overflow-hidden shadow-2xl">
                  
                  {/* Decorative Gradient Background */}
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <h4 className="text-9xl font-black tracking-tighter">{result.bigO}</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     
                     {/* Left Summary */}
                     <div className="space-y-8">
                        <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Estimated Notation</p>
                            <h2 className="text-7xl font-black text-white italic tracking-tighter drop-shadow-sm">{result.bigO}</h2>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Complexity Level</p>
                                <span className={`text-xs font-bold uppercase ${
                                    result.level === 'High' ? 'text-red-400' : 
                                    result.level === 'Medium' ? 'text-amber-400' : 
                                    'text-emerald-400'
                                }`}>{result.level} LEVEL</span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 rounded-full border border-slate-800 overflow-hidden shadow-inner">
                                <div
                                    className={`h-full transition-all duration-1000 ease-out ${
                                        result.level === 'High' ? 'bg-red-500 shadow-[0_0_15px_-2px_rgba(239,68,68,0.5)]' : 
                                        result.level === 'Medium' ? 'bg-amber-500 shadow-[0_0_15px_-2px_rgba(245,158,11,0.5)]' : 
                                        'bg-emerald-500 shadow-[0_0_15px_-2px_rgba(16,185,129,0.5)]'
                                    }`}
                                    style={{ width: `${Math.min(result.score * 2.5, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-6">
                            <h3 className="text-slate-300 font-bold text-xs uppercase tracking-widest flex items-center gap-3">
                               <span className="h-px w-6 bg-slate-700"></span> Reasons
                            </h3>
                            <ul className="space-y-4">
                                {result.reasons.map((reason, i) => (
                                    <li key={i} className="flex gap-4 text-slate-400 text-sm font-medium">
                                        <span className="text-cyan-500 font-mono">/</span>
                                        {reason}
                                    </li>
                                ))}
                            </ul>
                        </div>
                     </div>

                     {/* Right Snippets (Hotspots) */}
                     <div className="space-y-6">
                        <h3 className="text-slate-300 font-bold text-xs uppercase tracking-widest flex items-center gap-3">
                            <span className="h-px w-6 bg-slate-700"></span> Identified Hotspots
                        </h3>
                        <div className="bg-slate-950/50 rounded-2xl border border-slate-800/80 p-2 divide-y divide-slate-800/40">
                             {result.snippets.length === 0 ? (
                                 <p className="p-6 text-slate-500 text-xs italic">No structural hotspots detected.</p>
                             ) : (
                                 result.snippets.map((snip, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                                        <div className="flex items-center gap-4 truncate">
                                            <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-950 px-1.5 py-1 rounded">L{snip.line}</span>
                                            <code className="text-xs text-slate-400 truncate opacity-80">{snip.code}</code>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                            snip.type === 'nested-loop' ? 'text-red-400 bg-red-400/5' : 
                                            snip.type === 'recursion' ? 'text-cyan-400 bg-cyan-400/5' : 
                                            'text-slate-300 bg-slate-700/20'
                                        }`}>
                                            {snip.type.replace('-', ' ')}
                                        </span>
                                    </div>
                                 ))
                             )}
                        </div>
                        <p className="text-[10px] text-slate-500 italic px-2">HINT: Optimized structures focus on O(n) or O(1) complexities.</p>
                     </div>
                  </div>
               </div>

               {/* Graph Section */}
               <div className="glass p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl relative">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                     <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-200 uppercase tracking-widest">Complexity Growth Curve</h3>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-tighter">Temporal expansion visualization (N=1 to 10)</p>
                     </div>
                     <div className="px-5 py-2 glass bg-cyan-500/5 border-cyan-500/20 rounded-2xl">
                         <span className="text-xs font-black text-cyan-400 italic">FUNCTION: {result.bigO} approximation</span>
                     </div>
                  </div>

                  <div className="h-[280px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={result.graphData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis 
                            dataKey="n" 
                            stroke="#475569" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            tick={{ dy: 10 }}
                        />
                        <YAxis 
                            stroke="#475569" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            hide 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#0f172a', 
                            border: '1px solid #1e293b',
                            borderRadius: '16px',
                            fontSize: '12px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#22d3ee" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                          animationDuration={2000}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-8 flex justify-between items-center px-4">
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Input Size (N)</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Calculated Complexity Cost</p>
                  </div>
               </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
