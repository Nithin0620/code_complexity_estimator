'use client';
import { useState, useEffect } from 'react';
import { getOrCreateUid } from '@/lib/auth';
import { User } from '@/types';

/**
 * Identity & Session Profile terminal.
 * Allows users to attribute a display name to their local UID session.
 */
export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch profile on session establishment
  useEffect(() => {
    const fetchProfile = async () => {
      const uid = getOrCreateUid();
      try {
        const res = await fetch(`/api/profile?uid=${uid}`);
        if (!res.ok) throw new Error('Identity retrieval failure');
        
        const data = await res.json();
        setUser(data);
        setName(data.name || '');
      } catch (err) {
        console.error('Profile fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (!user) return;
    setSaving(true);
    setSuccess(false);
    
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, name: name.trim() }),
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to commit profile changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1200 pb-20">
      
      {/* Page Header */}
      <header className="flex flex-col gap-2 border-l-4 border-cyan-500 pl-6 py-2">
        <h1 className="text-3xl font-black text-slate-100 tracking-tight flex items-center gap-4">
          Identity Profile
          <div className="flex gap-1.5">
             <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/40 animate-pulse"></span>
             <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/60 animate-pulse delay-75"></span>
             <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse delay-150"></span>
          </div>
        </h1>
        <p className="text-slate-500 font-mono text-xs tracking-[0.25em] uppercase opacity-70">Client-Side Session Configuration Environment</p>
      </header>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center glass rounded-3xl border border-slate-800 space-y-6">
           <div className="w-10 h-10 border-2 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
           <span className="text-slate-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">Mapping session parameters...</span>
        </div>
      ) : (
        <div className="glass p-12 rounded-[2.5rem] space-y-12 border border-slate-800/80 shadow-[0_0_50px_-12px_rgba(30,41,59,0.5)] relative overflow-hidden transition-all duration-700 hover:border-slate-700">
            
            {/* Visual Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
                 <svg className="w-40 h-40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                 </svg>
            </div>

            {/* UID Display */}
            <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center px-1">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] block">Static UID Mapping</label>
                    <span className="text-[9px] font-mono text-cyan-500/60 uppercase">Unique_Local_Identity</span>
                </div>
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-linear-to-r from-slate-800 to-slate-900 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative p-6 bg-slate-950/90 border border-slate-800 rounded-2xl flex items-center justify-between shadow-inner">
                        <code className="text-cyan-400 font-mono text-sm tracking-tighter truncate max-w-[70%] select-all">
                            {user?.uid}
                        </code>
                        <div className="flex items-center gap-2 group/tip">
                            <span className="text-[9px] font-bold text-slate-500 opacity-0 group-hover/tip:opacity-100 transition-opacity uppercase mr-1">Stored Locally</span>
                            <div className="h-5 w-5 rounded bg-slate-900 border border-slate-800 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Name Input */}
            <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center px-1">
                    <label className="text-slate-200 text-[11px] font-black uppercase tracking-[0.2em] block">Display Alias</label>
                    <span className="text-[8px] font-mono text-slate-600 uppercase">User_Attribution_Label</span>
                </div>
                <div className="relative group">
                    <div className="absolute -inset-1 bg-linear-to-r from-cyan-500/10 to-blue-500/10 rounded-[1.4rem] opacity-0 group-focus-within:opacity-100 transition-all duration-700 blur-sm"></div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Define your identifier alias..."
                        className="relative w-full p-7 bg-slate-900/90 border border-slate-800 rounded-2xl text-slate-100 font-bold focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner placeholder:text-slate-700 placeholder:font-medium text-lg tracking-tight"
                    />
                </div>
            </div>

            {/* Update Action */}
            <div className="space-y-4 relative z-10">
                <button
                    onClick={handleUpdate}
                    disabled={saving || !name.trim()}
                    className={`group w-full py-6 rounded-2xl font-black uppercase text-xs tracking-[0.4em] transition-all duration-500 shadow-2xl flex items-center justify-center gap-5 relative overflow-hidden active:scale-[0.98] ${
                        success 
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                        : 'bg-white text-slate-950 hover:bg-cyan-400 hover:shadow-cyan-400/20 active:bg-cyan-500'
                    }`}
                >
                    <span className="relative z-10 flex items-center gap-4">
                        {saving ? (
                            <>
                                <span className="h-4 w-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></span>
                                COMMITTING_CHANGES...
                            </>
                        ) : success ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                                REGISTRY_UPDATED
                            </>
                        ) : (
                            'UPDATE_SESSION_REGISTRY'
                        )}
                    </span>
                    {!saving && !success && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-2 transition-transform duration-500 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    )}
                </button>
                {success && (
                    <p className="text-center text-emerald-500 font-bold text-[10px] uppercase tracking-widest animate-in fade-in duration-500">Identity modifications successfully applied</p>
                )}
            </div>
        </div>
      )}

      {/* Security Advisory */}
      <div className="p-10 rounded-[2.5rem] border border-red-500/10 bg-red-500/5 flex flex-col md:flex-row gap-8 items-start backdrop-blur-sm">
          <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500 shadow-lg shadow-red-500/5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
          </div>
          <div className="space-y-3">
             <h3 className="text-red-400 text-sm font-black uppercase tracking-[0.2em]">Session Volatility Advisory</h3>
             <p className="text-slate-500 text-xs leading-relaxed font-medium">
                 This application operates without centralized authentication. Your identity is tethered to a 
                 <b> unique browser-generated UUID </b>. Flushing site data, utilizing Incognito mode, or switching 
                 browser environments will result in a loss of access to your historical profiling logs. 
                 We recommend periodically documenting your analysis if session continuity is required.
             </p>
          </div>
      </div>
    </div>
  );
}
