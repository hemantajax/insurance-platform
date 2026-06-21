'use client';

import * as React from 'react';

import { cn } from '@org/design-system';

export interface AppShellProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ sidebar, children, className }: AppShellProps) {
  return (
    <div className={cn('flex min-h-screen bg-background', className)}>
      {sidebar}
      <main className="flex min-h-screen flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
