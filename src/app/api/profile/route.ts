import { NextResponse } from 'next/server';
import { getUser, updateUserName } from '@/lib/db';

/**
 * GET /api/profile?uid=...
 * Fetch user profile from the database.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get('uid');
  if (!uid) {
    return NextResponse.json({ error: 'UID is required' }, { status: 400 });
  }

  const user = getUser(uid);
  return NextResponse.json(user || { uid, name: null });
}

/**
 * PUT /api/profile
 * Body: { uid: string, name: string }
 * Update user's name in the database.
 */
export async function PUT(req: Request) {
  try {
    const { uid, name } = await req.json();
    if (!uid || !name) {
      return NextResponse.json({ error: 'UID and name are required' }, { status: 400 });
    }

    updateUserName(uid, name);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
