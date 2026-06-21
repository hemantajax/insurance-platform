'use client';

import { create } from 'zustand';

export interface UiState {
  sidebarOpen: boolean;
  selectedClaimId: string | null;
  commentsPanelOpen: boolean;
  annotationMode: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSelectedClaimId: (id: string | null) => void;
  setCommentsPanelOpen: (open: boolean) => void;
  setAnnotationMode: (enabled: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  selectedClaimId: null,
  commentsPanelOpen: false,
  annotationMode: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSelectedClaimId: (id) => set({ selectedClaimId: id }),
  setCommentsPanelOpen: (open) => set({ commentsPanelOpen: open }),
  setAnnotationMode: (enabled) => set({ annotationMode: enabled }),
}));
