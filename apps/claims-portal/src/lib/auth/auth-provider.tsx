'use client';

import * as React from 'react';

import {
  fetchSession,
  loginRequest,
  logoutRequest,
  type SessionUser,
  type UserRole,
} from '@org/shared';

interface AuthContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  signIn: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshSession = React.useCallback(async () => {
    const { user: nextUser } = await fetchSession();
    setUser(nextUser);
  }, []);

  React.useEffect(() => {
    refreshSession()
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, [refreshSession]);

  const signIn = React.useCallback(
    async (role: UserRole) => {
      await loginRequest(role);
      await refreshSession();
    },
    [refreshSession]
  );

  const signOut = React.useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({ user, isLoading, signIn, signOut, refreshSession }),
    [user, isLoading, signIn, signOut, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

export function useSession() {
  const { user, isLoading } = useAuthContext();
  return { user, isLoading, isAuthenticated: Boolean(user) };
}

export function useAuth() {
  const { user, isLoading, signIn, signOut, refreshSession } = useAuthContext();
  return { user, isLoading, signIn, signOut, refreshSession };
}
