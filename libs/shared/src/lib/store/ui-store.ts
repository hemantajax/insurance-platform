'use client';

import { create } from 'zustand';

export interface UiState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  selectedClaimId: string | null;
  commentsPanelOpen: boolean;
  annotationMode: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedClaimId: (id: string | null) => void;
  setCommentsPanelOpen: (open: boolean) => void;
  setAnnotationMode: (enabled: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  selectedClaimId: null,
  commentsPanelOpen: false,
  annotationMode: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSelectedClaimId: (id) => set({ selectedClaimId: id }),
  setCommentsPanelOpen: (open) => set({ commentsPanelOpen: open }),
  setAnnotationMode: (enabled) => set({ annotationMode: enabled }),
}));
