// src/middleware.ts
import type { JWT } from 'next-auth/jwt';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// ─────────────────────────────────────────
// Config
// ─────────────────────────────────────────

type Role = 'HEAD' | 'ADMIN' | 'STAFF' | 'CLIENT';
type Token = (JWT & { role?: Role }) | null;

const LOCK_ENABLED = process.env.SITE_LOCK_ENABLED === 'true';
const LOCK_COOKIE = process.env.SITE_LOCK_COOKIE || 'site_lock_passed';
const ADMIN_ROOT = '/admin';

const PUBLIC_HOSTS = new Set([
  'everything-visual.co.uk',
  'www.everything-visual.co.uk',
  'localhost',
  '127.0.0.1',
]);

const ADMIN_HOSTS = new Set([
  'admin.everything-visual.co.uk',
  'admin.localhost',
  'admin.127.0.0.1',
]);

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

function getHost(req: NextRequest) {
  const raw =
    req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? req.nextUrl.hostname ?? '';
  return raw.split(',')[0]!.trim().replace(/:\d+$/, '');
}

const isLoginPath = (p: string) =>
  p === '/login' || p === '/login/' || p === '/admin/login' || p === '/admin/login/';

const isFile = (p: string) => /\.[a-zA-Z0-9]+$/.test(p);

const isBypass = (pathname: string) =>
  pathname.startsWith('/_next') ||
  pathname.startsWith('/api/auth') ||
  pathname.startsWith('/api/healthz') ||
  pathname.startsWith('/api/gate/unlock') ||
  pathname.startsWith('/api/uploadthing') ||
  pathname.startsWith('/assets') ||
  pathname.startsWith('/images') ||
  pathname.startsWith('/icons') ||
  pathname.startsWith('/uploads') ||
  pathname === '/favicon.ico' ||
  pathname === '/robots.txt' ||
  pathname === '/sitemap.xml' ||
  isFile(pathname) ||
  isLoginPath(pathname);

function redirectToLogin(req: NextRequest, callbackUrl: string) {
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.search = '';
  url.searchParams.set('callbackUrl', callbackUrl);
  return NextResponse.redirect(url);
}

function redirectToAdminLogin(req: NextRequest, callbackUrl: string) {
  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = '';
  url.searchParams.set('callbackUrl', callbackUrl);
  return NextResponse.redirect(url);
}

// ─────────────────────────────────────────
// Site lock check
// ─────────────────────────────────────────

function checkSiteLock(req: NextRequest) {
  if (!LOCK_ENABLED) return null;

  const { pathname, search } = req.nextUrl;

  const isLockPublic = pathname === '/coming-soon' || pathname === '/coming-soon/';

  if (isLockPublic) return null;

  const unlocked = req.cookies.get(LOCK_COOKIE)?.value === 'true';
  if (unlocked) return null;

  const url = req.nextUrl.clone();
  url.pathname = '/coming-soon';
  url.search = '';
  url.searchParams.set('from', `${pathname}${search}`);
  return NextResponse.redirect(url);
}

// ─────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const host = getHost(req);

  // 1) Always bypass framework/static/auth/upload paths
  if (isBypass(pathname)) return NextResponse.next();

  // 2) Site lock (runs before auth — locks entire site if enabled)
  const lockResponse = checkSiteLock(req);
  if (lockResponse) return lockResponse;

  // ── Public host ──────────────────────────────────────────────
  if (PUBLIC_HOSTS.has(host)) {
    // Block /admin on public host — redirect to home
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      url.search = '';
      return NextResponse.redirect(url);
    }

    // Protect /account pages
    if (pathname === '/account' || pathname.startsWith('/account/')) {
      const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET })) as Token;
      if (!token) return redirectToLogin(req, `${pathname}${search}` || '/account');
    }

    return NextResponse.next();
  }

  // ── Admin host ───────────────────────────────────────────────
  if (ADMIN_HOSTS.has(host)) {
    // Redirect bare root to /admin
    if (pathname === '/' || pathname === '') {
      const url = req.nextUrl.clone();
      url.pathname = ADMIN_ROOT;
      url.search = '';
      return NextResponse.redirect(url);
    }

    // Gate the admin area — HEAD and ADMIN roles only
    if (pathname === ADMIN_ROOT || pathname.startsWith(`${ADMIN_ROOT}/`)) {
      const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET })) as Token;
      const role = token?.role;
      const authorised = !!token && (role === 'HEAD' || role === 'ADMIN' || role === 'STAFF');

      if (!authorised) {
        const cb = isLoginPath(pathname) ? ADMIN_ROOT : `${pathname}${search}` || ADMIN_ROOT;
        return redirectToAdminLogin(req, cb);
      }
    }

    return NextResponse.next();
  }

  // ── Fallback (preview / unknown host) ───────────────────────
  if (pathname === '/account' || pathname.startsWith('/account/')) {
    const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET })) as Token;
    if (!token) return redirectToLogin(req, `${pathname}${search}` || '/account');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/|api/|assets/|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
