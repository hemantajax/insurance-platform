'use client';

import * as React from 'react';
import { Menu } from 'lucide-react';

import { Button, cn, ThemeToggle } from '@org/design-system';

export interface HeaderProps {
  title?: string;
  logo?: React.ReactNode;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  profile?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function Header({
  title = 'Claims Portal',
  logo,
  onMenuClick,
  showMenuButton = true,
  profile,
  actions,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'relative z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4 lg:px-6',
        className
      )}
    >
      {showMenuButton ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
      ) : null}

      <div className="flex min-w-0 flex-1 items-center gap-3">
        {logo}
        <span className="truncate text-sm font-semibold text-foreground">{title}</span>
      </div>

      <div className="flex items-center gap-2">
        {actions}
        <ThemeToggle />
        {profile}
      </div>
    </header>
  );
}
