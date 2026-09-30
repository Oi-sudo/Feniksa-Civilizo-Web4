import { cookies, headers } from 'next/headers';
import { createHash } from 'node:crypto';
import { query } from '@/lib/db';
import { hashToken, newOpaqueToken } from './crypto';

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'feniksa_session';
const DAYS = Number(process.env.SESSION_DAYS || 30);

export type CurrentUser = {
  id: string;
  display_name: string;
  email: string;
  preferred_language: 'zh' | 'eo' | 'en';
  account_status: 'active' | 'suspended' | 'closed';
  email_verified_at: string | null;
  roles: string[];
};

function expiresAt(): Date {
  const date = new Date();
  date.setDate(date.getDate() + DAYS);
  return date;
}

async function requestFingerprint() {
  const h = await headers();
  const userAgent = h.get('user-agent');
  const forwarded = h.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
  const ipHash = forwarded ? createHash('sha256').update(forwarded).digest('hex') : null;
  return { userAgent, ipHash };
}

export async function createSession(userId: string) {
  const raw = newOpaqueToken();
  const tokenHash = hashToken(raw);
  const expiry = expiresAt();
  const { userAgent, ipHash } = await requestFingerprint();

  await query(
    `INSERT INTO auth_sessions (user_id, token_hash, expires_at, user_agent, ip_hash)
     VALUES ($1,$2,$3,$4,$5)`,
    [userId, tokenHash, expiry, userAgent, ipHash]
  );

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, raw, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiry
  });
}

export async function revokeCurrentSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (raw) {
    await query(`UPDATE auth_sessions SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL`, [hashToken(raw)]);
  }
  cookieStore.set(COOKIE_NAME, '', { httpOnly: true, sameSite: 'lax', path: '/', expires: new Date(0) });
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const result = await query<CurrentUser & { role_code: string | null }>(
    `SELECT u.id, u.display_name, u.email, u.preferred_language, u.account_status,
            u.email_verified_at, r.code AS role_code
       FROM auth_sessions s
       JOIN users u ON u.id = s.user_id
       LEFT JOIN user_roles ur ON ur.user_id = u.id
            AND ur.status = 'active'
            AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
       LEFT JOIN roles r ON r.id = ur.role_id
      WHERE s.token_hash = $1
        AND s.revoked_at IS NULL
        AND s.expires_at > NOW()
        AND u.deleted_at IS NULL`,
    [hashToken(raw)]
  );

  if (result.rowCount === 0) return null;
  const first = result.rows[0];
  await query(`UPDATE auth_sessions SET last_seen_at = NOW() WHERE token_hash = $1`, [hashToken(raw)]);

  return {
    id: first.id,
    display_name: first.display_name,
    email: first.email,
    preferred_language: first.preferred_language,
    account_status: first.account_status,
    email_verified_at: first.email_verified_at,
    roles: result.rows.map(r => r.role_code).filter((x): x is string => Boolean(x))
  };
}
