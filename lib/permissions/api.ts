import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasAnyRole, hasRole, type RoleCode } from './rbac';

export async function requireApiRole(required: RoleCode) {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, response: NextResponse.json({ error: 'authentication_required' }, { status: 401 }) };
  }
  if (user.account_status !== 'active') {
    return { user: null, response: NextResponse.json({ error: 'account_inactive' }, { status: 403 }) };
  }
  if (!hasRole(user, required)) {
    return { user: null, response: NextResponse.json({ error: 'permission_denied' }, { status: 403 }) };
  }
  return { user, response: null };
}

export async function requireApiAnyRole(required: RoleCode[]) {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, response: NextResponse.json({ error: 'authentication_required' }, { status: 401 }) };
  }
  if (user.account_status !== 'active') {
    return { user: null, response: NextResponse.json({ error: 'account_inactive' }, { status: 403 }) };
  }
  if (!hasAnyRole(user, required)) {
    return { user: null, response: NextResponse.json({ error: 'permission_denied' }, { status: 403 }) };
  }
  return { user, response: null };
}
