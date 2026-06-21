import { act, renderHook } from '@testing-library/react';

import { useUiStore } from './ui-store';

describe('useUiStore', () => {
  beforeEach(() => {
    act(() => {
      useUiStore.setState({
        sidebarOpen: false,
        sidebarCollapsed: false,
        selectedClaimId: null,
        commentsPanelOpen: false,
        annotationMode: false,
      });
    });
  });

  it('toggles desktop sidebar collapsed state', () => {
    const { result } = renderHook(() => useUiStore());

    expect(result.current.sidebarCollapsed).toBe(false);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarCollapsed).toBe(true);
  });

  it('toggles mobile sidebar open state', () => {
    const { result } = renderHook(() => useUiStore());

    expect(result.current.sidebarOpen).toBe(false);

    act(() => {
      result.current.toggleMobileSidebar();
    });

    expect(result.current.sidebarOpen).toBe(true);

    act(() => {
      result.current.toggleMobileSidebar();
    });

    expect(result.current.sidebarOpen).toBe(false);
  });

  it('tracks selected claim and workspace panel state', () => {
    const { result } = renderHook(() => useUiStore());

    act(() => {
      result.current.setSelectedClaimId('claim-123');
      result.current.setCommentsPanelOpen(true);
      result.current.setAnnotationMode(true);
    });

    expect(result.current.selectedClaimId).toBe('claim-123');
    expect(result.current.commentsPanelOpen).toBe(true);
    expect(result.current.annotationMode).toBe(true);
  });
});
