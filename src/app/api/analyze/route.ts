import { NextResponse } from 'next/server';
import { analyzeComplexity } from '@/lib/complexity/analyzeComplexity';
import { saveHistory } from '@/lib/db';

/**
 * Enhanced POST /api/analyze
 * Body: { code: string, uid: string }
 * Returns: { score: number, level: string, bigO: string, reasons: string[], snippets: [], graphData: [] }
 */
export async function POST(req: Request) {
  try {
    const { code, uid } = await req.json();
    if (!code || !uid) {
      return NextResponse.json({ error: 'Code and UID are required' }, { status: 400 });
    }
    
    // Use modular analysis logic
    const result = analyzeComplexity(code);
    
    // Persist result in DB (stores result as JSON string)
    saveHistory(uid, code, JSON.stringify(result));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze code snippet' }, { status: 500 });
  }
}
