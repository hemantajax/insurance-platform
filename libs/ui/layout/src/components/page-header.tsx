'use client';

import * as React from 'react';

import { Button, cn, SearchInput } from '@org/design-system';
import { Menu } from 'lucide-react';

export interface PageHeaderProps {
  title: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  searchPlaceholder = 'Search',
  searchValue,
  onSearchChange,
  onMenuClick,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 px-8 pt-10',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {onMenuClick ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        ) : null}
        <h1 className="text-[30px] font-medium tracking-tight text-foreground">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          containerClassName="w-52"
          className="h-[38px] bg-card"
          aria-label={searchPlaceholder}
        />
      </div>
    </header>
  );
}
