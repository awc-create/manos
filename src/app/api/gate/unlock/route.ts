import { NextRequest, NextResponse } from 'next/server';

const SITE_LOCK_PASSWORD = process.env.SITE_LOCK_PASSWORD;
const SITE_LOCK_COOKIE = process.env.SITE_LOCK_COOKIE || 'site_lock_passed';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { password?: string };
    const password = (body.password ?? '').trim();

    if (!SITE_LOCK_PASSWORD) {
      return NextResponse.json(
        { ok: false, error: 'Site lock password is not configured.' },
        { status: 500 }
      );
    }

    if (password !== SITE_LOCK_PASSWORD) {
      return NextResponse.json({ ok: false, error: 'Incorrect password.' }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });

    res.cookies.set({
      name: SITE_LOCK_COOKIE,
      value: 'true',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12, // 12 hours
    });

    return res;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }
}
