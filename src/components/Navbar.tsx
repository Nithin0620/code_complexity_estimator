'use client';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tight bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Complexity Estimator
        </Link>
        <div className="flex gap-8 text-sm font-medium text-slate-400">
          <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          <Link href="/history" className="hover:text-cyan-400 transition-colors">History</Link>
          <Link href="/profile" className="hover:text-cyan-400 transition-colors">Profile</Link>
        </div>
      </div>
    </nav>
  );
}
