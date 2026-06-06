import { User } from 'oidc-client-ts';
import { env } from './env';

export function getUserGroups(user: User | null): string[] {
  if (!user?.profile) return [];
  const claim = user.profile[env.VITE_JWT_GROUPS_CLAIM];
  if (Array.isArray(claim)) return claim as string[];
  if (typeof claim === 'string') return [claim];
  return [];
}

export function hasGroup(user: User | null, group: string): boolean {
  return getUserGroups(user).includes(group);
}

export function hasAnyGroup(user: User | null, groups: string[]): boolean {
  const userGroups = getUserGroups(user);
  return groups.some((g) => userGroups.includes(g));
}
