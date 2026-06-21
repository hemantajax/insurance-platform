// Server-rendered route transition skeleton. Kept dependency-free (no client
// components) so it can render instantly during navigation before the client
// workspace page hydrates and takes over the real progress UI.
export default function CustomerWorkspaceLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-8 pb-8 pt-6">
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-md bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 animate-pulse rounded-md bg-muted" />
          <div className="h-9 w-9 animate-pulse rounded-md bg-muted" />
          <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center gap-8 rounded-xl border bg-card p-8">
        <div className="w-full max-w-md space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Opening workspace…</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[8%] rounded-full bg-primary" />
          </div>
        </div>
        <div className="aspect-[1/1.3] w-full max-w-md animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}
