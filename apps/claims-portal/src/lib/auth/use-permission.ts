'use client';

import { hasPermission, type Permission } from '@org/shared';

import { useAuthContext } from './auth-provider';

export function usePermission(permission: Permission): boolean {
  const { user } = useAuthContext();
  return hasPermission(user, permission);
}
