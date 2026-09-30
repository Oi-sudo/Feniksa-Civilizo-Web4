import { NextRequest, NextResponse } from 'next/server';
import { withTransaction } from '@/lib/db';
import { hashPassword, hashToken, newOpaqueToken, normalizeEmail } from '@/lib/auth/crypto';
import { sendVerificationEmail } from '@/lib/email';

function validate(displayName: unknown, email: unknown, password: unknown, language: unknown) {
  if (typeof displayName !== 'string' || displayName.trim().length < 2 || displayName.trim().length > 80) return '显示名需为2—80个字符。';
  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) return '请输入有效邮箱。';
  if (typeof password !== 'string' || password.length < 10) return '密码至少需要10个字符。';
  if (!['zh', 'eo', 'en'].includes(String(language))) return '语言选项无效。';
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const error = validate(body.displayName, body.email, body.password, body.language);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const email = normalizeEmail(body.email);
    const displayName = body.displayName.trim();
    const passwordHash = await hashPassword(body.password);
    const token = newOpaqueToken();
    const tokenHash = hashToken(token);

    const user = await withTransaction(async client => {
      const existing = await client.query(`SELECT 1 FROM users WHERE email = $1 AND deleted_at IS NULL`, [email]);
      if (existing.rowCount) throw new Error('EMAIL_EXISTS');
      const inserted = await client.query<{ id: string }>(
        `INSERT INTO users (display_name,email,password_hash,preferred_language) VALUES ($1,$2,$3,$4) RETURNING id`,
        [displayName, email, passwordHash, body.language]
      );
      const userId = inserted.rows[0].id;
      await client.query(`INSERT INTO user_roles (user_id, role_id) SELECT $1, id FROM roles WHERE code = 'learner'`, [userId]);
      await client.query(`INSERT INTO learning_passports (user_id) VALUES ($1)`, [userId]);
      await client.query(`INSERT INTO email_verification_tokens (user_id, token_hash, expires_at) VALUES ($1,$2,NOW() + INTERVAL '24 hours')`, [userId, tokenHash]);
      return { id: userId };
    });

    const appUrl = process.env.APP_URL || 'https://feniksa-web4-alpha.onrender.com';
    const verificationUrl = `${appUrl}/verify-email?token=${encodeURIComponent(token)}`;
    await sendVerificationEmail(email, verificationUrl);

    const alphaConsoleMode = !process.env.EMAIL_PROVIDER || process.env.EMAIL_PROVIDER === 'console' || process.env.EMAIL_FROM === 'noreply@example.invalid';
    return NextResponse.json({
      ok: true,
      userId: user.id,
      message: alphaConsoleMode ? '学习身份已建立。Alpha阶段请点击下方验证链接后登录。' : '学习身份已建立。请完成邮箱验证后登录。',
      ...(alphaConsoleMode ? { verificationUrl } : {})
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_EXISTS') return NextResponse.json({ error: '这个邮箱已经注册。' }, { status: 409 });
    console.error(error);
    return NextResponse.json({ error: '暂时无法创建账号，请稍后再试。' }, { status: 500 });
  }
}
