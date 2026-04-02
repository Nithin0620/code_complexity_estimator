import { NextResponse } from 'next/server';
import { getHistory, deleteHistory } from '@/lib/db';

/**
 * GET /api/history?uid=...
 * Fetch all past complexity analyses for a specific user ID.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get('uid');
  if (!uid) {
    return NextResponse.json({ error: 'UID is required' }, { status: 400 });
  }

  const history = getHistory(uid);
  return NextResponse.json(history);
}

/**
 * DELETE /api/history?id=...
 * Deletes a single history record based on ID.
 */
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'History ID is required' }, { status: 400 });
  }

  deleteHistory(parseInt(id));
  return NextResponse.json({ success: true });
}
