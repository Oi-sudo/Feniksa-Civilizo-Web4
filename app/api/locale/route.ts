import { NextRequest, NextResponse } from 'next/server';

const allowed = new Set(['zh','eo','en']);

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') || 'zh';
  const next = request.nextUrl.searchParams.get('next') || '/';
  const safeNext = next.startsWith('/') ? next : '/';
  const response = NextResponse.redirect(new URL(safeNext, request.url));
  response.cookies.set('feniksa_locale', allowed.has(locale) ? locale : 'zh', {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365
  });
  return response;
}
