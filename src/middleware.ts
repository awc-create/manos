import { NextRequest, NextResponse } from 'next/server';

const LOCK_ENABLED = process.env.SITE_LOCK_ENABLED === 'true';
const LOCK_COOKIE = process.env.SITE_LOCK_COOKIE || 'site_lock_passed';

function isPublicPath(pathname: string) {
  return (
    pathname === '/coming-soon' ||
    pathname === '/coming-soon/' ||
    pathname.startsWith('/api/gate/unlock') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/api/uploadthing')
  );
}

export function middleware(req: NextRequest) {
  if (!LOCK_ENABLED) return NextResponse.next();

  const { pathname, search } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const unlocked = req.cookies.get(LOCK_COOKIE)?.value === 'true';

  if (unlocked) {
    return NextResponse.next();
  }

  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = '/coming-soon';

  const from = `${pathname}${search}`;
  redirectUrl.searchParams.set('from', from);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)'],
};
