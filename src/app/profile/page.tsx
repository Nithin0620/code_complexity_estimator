'use client';
import { useState, useEffect } from 'react';
import { getOrCreateUid } from '@/lib/auth';
import { User } from '@/types';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const uid = getOrCreateUid();
      try {
        const res = await fetch(`/api/profile?uid=${uid}`);
        if (!res.ok) throw new Error('Profile fetch failed');
        const data = await res.json();
        setUser(data);
        setName(data.name || '');
      } catch (err) {
        console.error(err);
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
      console.error(err);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <header className="border-l-4 border-cyan-500 pl-4 py-1">
        <h1 className="text-2xl font-black text-slate-100">Your Profile</h1>
        <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest">Session identity &amp; preferences</p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-24 gap-4">
          <div className="h-6 w-6 rounded-full border-2 border-slate-800 border-t-cyan-500 animate-spin" />
          <span className="text-slate-500 text-sm">Loading profile…</span>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">

          {/* UID field */}
          <div className="space-y-2">
            <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Session UID <span className="text-slate-600 font-normal">(read-only)</span></label>
            <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <code className="text-cyan-400 font-mono text-sm truncate select-all flex-grow">{user?.uid}</code>
            </div>
            <p className="text-slate-600 text-xs">Stored in your browser&apos;s localStorage. Unique per device &amp; browser.</p>
          </div>

          {/* Name field */}
          <div className="space-y-2">
            <label htmlFor="display-name" className="text-slate-300 text-xs font-bold uppercase tracking-wider block">Display Name</label>
            <input
              id="display-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
              placeholder="Enter your name…"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-xl text-slate-100 text-sm outline-none transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleUpdate}
            disabled={saving || !name.trim()}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              success
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-white text-slate-950 hover:bg-cyan-400 active:scale-[0.98]'
            }`}
          >
            {saving ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-slate-950/20 border-t-slate-950 animate-spin" />
                Saving…
              </>
            ) : success ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Name Updated!
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      )}

      {/* Advisory notice */}
      <div className="flex gap-4 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
        <div className="shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-amber-400 text-xs font-bold uppercase tracking-wider">Session Notice</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            This app uses no backend authentication. Your UID and history are tied to your browser&apos;s localStorage.
            Clearing site data or switching browsers will reset your session.
          </p>
        </div>
      </div>
    </div>
  );
}
