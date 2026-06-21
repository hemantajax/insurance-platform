'use client';

import { Button, Skeleton, cn } from '@org/design-system';

function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export interface DocumentLoadingStateProps {
  progress: number;
  label: string;
  fileName?: string;
  onCancel?: () => void;
  className?: string;
}

/**
 * Skeleton toolbar + skeleton page placeholder with a progress bar and a
 * cancel affordance — shown while the document metadata and first chunk load.
 */
export function DocumentLoadingState({
  progress,
  label,
  fileName,
  onCancel,
  className,
}: DocumentLoadingStateProps) {
  return (
    <div className={cn('flex flex-1 flex-col gap-6', className)}>
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center gap-8 rounded-xl border bg-card p-8">
        <div className="w-full max-w-md space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{label}</span>
            <span className="tabular-nums text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <ProgressBar value={progress} />
          {fileName ? (
            <p className="truncate text-xs text-muted-foreground">{fileName}</p>
          ) : null}
          {onCancel ? (
            <div className="pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex w-full max-w-2xl flex-col items-center gap-4">
          <Skeleton className="aspect-[1/1.3] w-full max-w-md rounded-lg" />
          <div className="flex w-full max-w-md justify-center gap-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

export interface DocumentLoadErrorProps {
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  className?: string;
}

export function DocumentLoadError({
  message,
  onRetry,
  onBack,
  className,
}: DocumentLoadErrorProps) {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border bg-card p-10 text-center',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          Could not open document
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {message ?? 'Something went wrong while loading this document.'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onBack ? (
          <Button type="button" variant="outline" onClick={onBack}>
            Back to grid
          </Button>
        ) : null}
        {onRetry ? (
          <Button type="button" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </div>
    </div>
  );
}
