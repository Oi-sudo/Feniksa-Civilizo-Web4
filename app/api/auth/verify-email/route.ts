import { NextRequest, NextResponse } from 'next/server';
import { withTransaction } from '@/lib/db';
import { hashToken } from '@/lib/auth/crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (typeof body.token !== 'string' || body.token.length < 20) return NextResponse.json({ error: '验证链接无效。' }, { status: 400 });
    const ok = await withTransaction(async client => {
      const found = await client.query<{ id:string; user_id:string }>(
        `SELECT id,user_id FROM email_verification_tokens WHERE token_hash=$1 AND consumed_at IS NULL AND expires_at > NOW() FOR UPDATE`,
        [hashToken(body.token)]
      );
      if (!found.rowCount) return false;
      const row = found.rows[0];
      await client.query(`UPDATE users SET email_verified_at=COALESCE(email_verified_at,NOW()) WHERE id=$1`, [row.user_id]);
      await client.query(`UPDATE email_verification_tokens SET consumed_at=NOW() WHERE id=$1`, [row.id]);
      return true;
    });
    if (!ok) return NextResponse.json({ error: '验证链接已失效或已经使用。' }, { status: 400 });
    return NextResponse.json({ ok: true, message: '邮箱验证完成，现在可以登录。' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '邮箱验证暂时失败，请稍后再试。' }, { status: 500 });
  }
}
