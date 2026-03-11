import { NextRequest, NextResponse } from 'next/server';
import { isValidAdmin } from '@/lib/auth';
import { loginSchema } from '@/lib/schemas';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'local';
  const rl = rateLimit(`login:${ip}`, 10, 60_000);
  if (!rl.ok) return NextResponse.json({ code: 'RATE_LIMIT', message: 'Too many requests' }, { status: 429 });

  const form = await req.formData();
  const parsed = loginSchema.safeParse({ login: form.get('login'), password: form.get('password') });
  if (!parsed.success) return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid credentials format' }, { status: 400 });

  if (!isValidAdmin(parsed.data.login, parsed.data.password)) {
    return NextResponse.json({ code: 'UNAUTHORIZED', message: 'Wrong login or password' }, { status: 401 });
  }

  const res = NextResponse.redirect(new URL('/admin', req.url));
  res.cookies.set('oishi_admin_session', 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12
  });
  return res;
}
