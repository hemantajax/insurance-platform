'use client';

import { ThemeProvider, Toaster } from '@org/design-system';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
      <Toaster richColors closeButton />
    </ThemeProvider>
  );
}
