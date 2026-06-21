'use client';

import { cn, Skeleton } from '@org/design-system';

export interface PageLoaderProps {
  label?: string;
  className?: string;
}

export function PageLoader({
  label = 'Loading…',
  className,
}: PageLoaderProps) {
  return (
    <div
      className={cn('flex flex-1 flex-col gap-4 p-6 lg:p-8', className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{label}</span>
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
