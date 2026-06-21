'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@org/design-system';
import { MOCK_USERS, type UserRole } from '@org/shared';

import { useAuth } from '../../lib/auth';

const ROLES: Array<{ role: UserRole; label: string; description: string }> = [
  {
    role: 'claim_processor',
    label: 'Claim Processor',
    description: 'View and edit claims, manage comments',
  },
  {
    role: 'supervisor',
    label: 'Supervisor',
    description: 'Full access including delete, assign, and approve',
  },
  {
    role: 'auditor',
    label: 'Auditor',
    description: 'Read-only access to claims',
  },
];

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, isLoading, user } = useAuth();
  const [pendingRole, setPendingRole] = React.useState<UserRole | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      router.replace(searchParams.get('redirect') ?? '/dashboard');
    }
  }, [user, router, searchParams]);

  const handleLogin = async (role: UserRole) => {
    setPendingRole(role);
    setError(null);
    try {
      await signIn(role);
      router.replace(searchParams.get('redirect') ?? '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setPendingRole(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>ABC Insurance — Claims Portal</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select a mock user role to continue.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {ROLES.map(({ role, label, description }) => (
            <Button
              key={role}
              type="button"
              variant="outline"
              className="h-auto w-full flex-col items-start gap-1 px-4 py-3 text-left"
              disabled={isLoading || pendingRole !== null}
              onClick={() => handleLogin(role)}
            >
              <span className="font-medium">{label}</span>
              <span className="text-xs text-muted-foreground">
                {MOCK_USERS[role].name} — {description}
              </span>
            </Button>
          ))}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
