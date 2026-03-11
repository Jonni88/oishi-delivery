import { cookies } from 'next/headers';

const COOKIE_NAME = 'oishi_admin_session';

export function isValidAdmin(login: string, password: string) {
  return login === process.env.ADMIN_LOGIN && password === process.env.ADMIN_PASSWORD;
}

export function setAdminCookie() {
  cookies().set(COOKIE_NAME, 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12
  });
}

export function clearAdminCookie() {
  cookies().delete(COOKIE_NAME);
}

export function isAdminCookiePresent() {
  return cookies().get(COOKIE_NAME)?.value === 'ok';
}
