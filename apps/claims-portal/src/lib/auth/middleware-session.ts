import type { AuthSession } from '@org/shared';
import { getPermissionsForRole } from '@org/shared';

export function parseSessionCookie(token: string | undefined): AuthSession | null {
  if (!token) {
    return null;
  }

  try {
    const session = JSON.parse(atob(token)) as AuthSession;
    if (!session?.user?.role || session.expiresAt < Date.now()) {
      return null;
    }
    session.user.permissions = getPermissionsForRole(session.user.role);
    return session;
  } catch {
    return null;
  }
}

export function isProtectedPath(pathname: string): boolean {
  return (
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/demo') &&
    !pathname.startsWith('/_next')
  );
}
