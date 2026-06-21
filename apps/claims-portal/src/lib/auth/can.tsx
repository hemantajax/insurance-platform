'use client';

import * as React from 'react';

import type { Permission } from '@org/shared';

import { usePermission } from './use-permission';

export interface CanProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ permission, children, fallback = null }: CanProps) {
  const allowed = usePermission(permission);
  if (!allowed) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
