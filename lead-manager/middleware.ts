import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const isLeads = req.nextUrl.pathname.startsWith('/leads');
  if (!isLeads) return NextResponse.next();
  const authed = req.cookies.get('auth')?.value === 'true';
  if (!authed) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/leads/:path*'] };
