'use client';

import * as React from 'react';

export interface PermissionShellProps {
  children: React.ReactNode;
  /** RBAC permission key — wired in auth-rbac spec */
  permission?: string;
  /** When false, children are hidden (auth spec will enforce via usePermission) */
  allowed?: boolean;
  fallback?: React.ReactNode;
}

export function PermissionShell({
  children,
  allowed = true,
  fallback = null,
}: PermissionShellProps) {
  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
