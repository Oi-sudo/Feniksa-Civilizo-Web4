import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { normalizeEmail, verifyPassword } from '@/lib/auth/crypto';
import { createSession } from '@/lib/auth/session';
import { getLocale } from '@/lib/i18n';

type LoginUser = { id:string; password_hash:string|null; account_status:'active'|'suspended'|'closed'; email_verified_at:string|null };

export async function POST(req: NextRequest) {
  try {
    const eo=(await getLocale())==='eo';
    const body = await req.json();
    if (typeof body.email !== 'string' || typeof body.password !== 'string') {
      return NextResponse.json({ error: eo?'Bonvolu enigi retpoŝtadreson kaj pasvorton.':'请输入邮箱和密码。' }, { status: 400 });
    }
    const result = await query<LoginUser>(
      `SELECT id,password_hash,account_status,email_verified_at FROM users WHERE email=$1 AND deleted_at IS NULL LIMIT 1`,
      [normalizeEmail(body.email)]
    );
    const user = result.rows[0];
    if (!user?.password_hash || !(await verifyPassword(body.password, user.password_hash))) {
      return NextResponse.json({ error: eo?'La retpoŝtadreso aŭ pasvorto estas malĝusta.':'邮箱或密码不正确。' }, { status: 401 });
    }
    if (user.account_status !== 'active') return NextResponse.json({ error: eo?'Ĉi tiu konto nun ne povas ensaluti; bonvolu kontakti administranton.':'该账号目前不可登录，请联系管理员。' }, { status: 403 });
    if (!user.email_verified_at) return NextResponse.json({ error: eo?'Via retpoŝtadreso ankoraŭ ne estas konfirmita; bonvolu unue kompletigi la konfirmon.':'您的邮箱尚未验证，请先完成邮箱验证。' }, { status: 403 });
    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (await getLocale())==='eo'?'Provizore ne eblas ensaluti; bonvolu reprovi poste.':'暂时无法登录，请稍后再试。' }, { status: 500 });
  }
}
