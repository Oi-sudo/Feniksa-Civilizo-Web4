import { redirect } from 'next/navigation';
import { getCurrentUser, type CurrentUser } from '@/lib/auth/session';

export const ROLE = {
  VISITOR: 'visitor',
  LEARNER: 'learner',
  MEMBER: 'member',
  PROJECT_STAFF: 'project_staff',
  ADMIN: 'admin',
  CURATOR: 'curator',
  MUSEUM_REVIEWER: 'museum_reviewer'
} as const;

export type RoleCode = typeof ROLE[keyof typeof ROLE];

const IMPLIED_ROLES: Record<RoleCode, RoleCode[]> = {
  visitor: ['visitor'],
  learner: ['visitor', 'learner'],
  member: ['visitor', 'learner', 'member'],
  project_staff: ['visitor', 'learner', 'member', 'project_staff'],
  admin: ['visitor', 'learner', 'member', 'project_staff', 'admin'],
  curator: ['visitor', 'learner', 'member', 'curator'],
  museum_reviewer: ['visitor', 'learner', 'member', 'museum_reviewer']
};

export function effectiveRoles(user: CurrentUser | null): Set<RoleCode> {
  if (!user) return new Set<RoleCode>(['visitor']);
  const out = new Set<RoleCode>();
  for (const role of user.roles) {
    if (role in IMPLIED_ROLES) {
      for (const implied of IMPLIED_ROLES[role as RoleCode]) out.add(implied);
    }
  }
  if (out.size === 0) out.add('visitor');
  return out;
}

export function hasRole(user: CurrentUser | null, required: RoleCode): boolean {
  return effectiveRoles(user).has(required);
}

export function hasAnyRole(user: CurrentUser | null, required: RoleCode[]): boolean {
  const roles = effectiveRoles(user);
  return required.some(role => roles.has(role));
}

export function canAccessMemberArea(user: CurrentUser | null) {
  return hasRole(user, 'member');
}

export function canAccessProjectStaffArea(user: CurrentUser | null) {
  return hasRole(user, 'project_staff');
}

export function canAccessAdminArea(user: CurrentUser | null) {
  return hasRole(user, 'admin');
}

export async function requireSignedIn(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.account_status !== 'active') redirect('/forbidden?reason=inactive');
  return user;
}

export async function requireRole(required: RoleCode): Promise<CurrentUser> {
  const user = await requireSignedIn();
  if (!hasRole(user, required)) redirect('/forbidden?reason=permission');
  return user;
}

export async function requireAnyRole(required: RoleCode[]): Promise<CurrentUser> {
  const user = await requireSignedIn();
  if (!hasAnyRole(user, required)) redirect('/forbidden?reason=permission');
  return user;
}
