'use client';

import * as React from 'react';

export interface MobileSidebarContextValue {
  toggleMobileSidebar: () => void;
}

const MobileSidebarContext =
  React.createContext<MobileSidebarContextValue | null>(null);

export function MobileSidebarProvider({
  value,
  children,
}: {
  value: MobileSidebarContextValue;
  children: React.ReactNode;
}) {
  return (
    <MobileSidebarContext.Provider value={value}>
      {children}
    </MobileSidebarContext.Provider>
  );
}

export function useMobileSidebarToggle(): (() => void) | undefined {
  return React.useContext(MobileSidebarContext)?.toggleMobileSidebar;
}
