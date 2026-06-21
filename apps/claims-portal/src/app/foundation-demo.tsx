'use client';

import {
  Button,
  Input,
  Skeleton,
  ThemeToggle,
} from '@org/design-system';
import { toast } from 'sonner';

export function FoundationDemo() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Claims Portal
          </h1>
          <p className="mt-2 text-muted-foreground">
            Foundation Phase 0 — design tokens, Tailwind v4, shadcn/ui
          </p>
        </div>
        <ThemeToggle />
      </div>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-medium">Components</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button
            variant="ghost"
            onClick={() => toast.success('Toast is working')}
          >
            Show toast
          </Button>
        </div>
        <Input placeholder="Search claims..." aria-label="Search claims" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-md bg-primary p-4 text-center text-xs text-primary-foreground">
          Primary
        </div>
        <div className="rounded-md bg-secondary p-4 text-center text-xs text-secondary-foreground">
          Secondary
        </div>
        <div className="rounded-md bg-success p-4 text-center text-xs text-success-foreground">
          Success
        </div>
        <div className="rounded-md bg-warning p-4 text-center text-xs text-warning-foreground">
          Warning
        </div>
      </section>
    </main>
  );
}
