// src/lib/apiAuth.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

const ADMIN_ROLES = new Set(['HEAD', 'ADMIN', 'STAFF']);

export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || !role || !ADMIN_ROLES.has(role)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  return null;
}
