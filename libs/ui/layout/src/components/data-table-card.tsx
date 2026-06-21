'use client';

import * as React from 'react';

import {
  Badge,
  cn,
  SearchInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@org/design-system';

export interface TableToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  sortLabel?: string;
  sortValue?: string;
  sortOptions?: Array<{ value: string; label: string }>;
  onSortChange?: (value: string) => void;
  className?: string;
}

export function TableToolbar({
  searchPlaceholder = 'Search',
  searchValue,
  onSearchChange,
  sortLabel = 'Sort by',
  sortValue,
  sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ],
  onSortChange,
  className,
}: TableToolbarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <SearchInput
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(event) => onSearchChange?.(event.target.value)}
        containerClassName="w-52"
        className="h-[38px] bg-background"
        aria-label={searchPlaceholder}
      />
      <Select value={sortValue} onValueChange={onSortChange}>
        <SelectTrigger className="h-[38px] w-40 bg-background">
          <SelectValue placeholder={`${sortLabel} : Newest`} />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {sortLabel} : {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

function getVisiblePages(
  page: number,
  totalPages: number
): Array<number | 'ellipsis'> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (page <= 3) {
    return [1, 2, 3, 'ellipsis', totalPages];
  }
  if (page >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, 'ellipsis', page, 'ellipsis', totalPages];
}

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationControlsProps) {
  const pages = getVisiblePages(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center gap-1', className)}
    >
      <PaginationButton
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
      >
        &lt;
      </PaginationButton>
      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-xs text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <PaginationButton
            key={item}
            active={item === page}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange?.(item)}
          >
            {item}
          </PaginationButton>
        )
      )}
      <PaginationButton
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange?.(page + 1)}
      >
        &gt;
      </PaginationButton>
    </nav>
  );
}

function PaginationButton({
  active = false,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-6 min-w-6 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface DataTableCardProps {
  title: string;
  subtitle?: string;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  pagination?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DataTableCard({
  title,
  subtitle,
  toolbar,
  footer,
  pagination,
  children,
  className,
}: DataTableCardProps) {
  return (
    <section
      className={cn('rounded-[30px] bg-card px-8 py-7 shadow-sm', className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {toolbar}
      </div>
      <div className="mt-6">{children}</div>
      {(footer || pagination) && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          {footer ? (
            <p className="text-sm text-muted-foreground">{footer}</p>
          ) : (
            <span />
          )}
          {pagination}
        </div>
      )}
    </section>
  );
}

export interface StatusBadgeProps {
  status: 'active' | 'inactive';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant={status === 'active' ? 'success' : 'inactive'}
      className={cn('min-w-[80px] justify-center rounded-md px-3 py-1', className)}
    >
      {status === 'active' ? 'Active' : 'Inactive'}
    </Badge>
  );
}
