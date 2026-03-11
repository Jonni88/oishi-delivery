import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
     const ok = req.cookies.get('oishi_admin_session')?.value === 'ok';
     if (!ok) {
       const url = req.nextUrl.clone();
       url.pathname = '/admin/login';
       return NextResponse.redirect(url);
     }
   }

  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth/login') && !pathname.startsWith('/api/admin/auth/logout')) {
    const ok = req.cookies.get('oishi_admin_session')?.value === 'ok';
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
