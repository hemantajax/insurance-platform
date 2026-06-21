import {
  PERMISSIONS,
  type AuthSession,
  type Permission,
  type SessionUser,
  type UserRole,
} from '../types';

export { PERMISSIONS };

export const SESSION_COOKIE = 'claims-session';

export const MOCK_USERS: Record<
  UserRole,
  { userId: string; name: string; role: UserRole }
> = {
  claim_processor: {
    userId: 'user-processor-1',
    name: 'Alex Processor',
    role: 'claim_processor',
  },
  supervisor: {
    userId: 'user-supervisor-1',
    name: 'Sam Supervisor',
    role: 'supervisor',
  },
  auditor: {
    userId: 'user-auditor-1',
    name: 'Jordan Auditor',
    role: 'auditor',
  },
};

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  claim_processor: [
    PERMISSIONS.CLAIM_VIEW,
    PERMISSIONS.CLAIM_EDIT,
    PERMISSIONS.COMMENT_CREATE,
    PERMISSIONS.COMMENT_EDIT,
  ],
  supervisor: [
    PERMISSIONS.CLAIM_VIEW,
    PERMISSIONS.CLAIM_EDIT,
    PERMISSIONS.CLAIM_DELETE,
    PERMISSIONS.CLAIM_ASSIGN,
    PERMISSIONS.CLAIM_APPROVE,
    PERMISSIONS.COMMENT_CREATE,
    PERMISSIONS.COMMENT_EDIT,
  ],
  auditor: [PERMISSIONS.CLAIM_VIEW],
};

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function buildSessionUser(role: UserRole): SessionUser {
  const preset = MOCK_USERS[role];
  return {
    ...preset,
    permissions: getPermissionsForRole(role),
  };
}

export function createSession(role: UserRole): AuthSession {
  return {
    user: buildSessionUser(role),
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
}

function encodeBase64(value: string): string {
  if (typeof btoa === 'function') {
    return btoa(value);
  }
  return Buffer.from(value, 'utf-8').toString('base64');
}

function decodeBase64(value: string): string {
  if (typeof atob === 'function') {
    return atob(value);
  }
  return Buffer.from(value, 'base64').toString('utf-8');
}

export function serializeSession(session: AuthSession): string {
  return encodeBase64(JSON.stringify(session));
}

export function parseSessionToken(token: string | undefined | null): AuthSession | null {
  if (!token) {
    return null;
  }

  try {
    const session = JSON.parse(decodeBase64(token)) as AuthSession;
    if (!session?.user?.role || session.expiresAt < Date.now()) {
      return null;
    }
    session.user.permissions = getPermissionsForRole(session.user.role);
    return session;
  } catch {
    return null;
  }
}

export function hasPermission(user: SessionUser | null, permission: Permission): boolean {
  return Boolean(user?.permissions.includes(permission));
}

export function isValidRole(value: unknown): value is UserRole {
  return (
    value === 'claim_processor' ||
    value === 'supervisor' ||
    value === 'auditor'
  );
}
