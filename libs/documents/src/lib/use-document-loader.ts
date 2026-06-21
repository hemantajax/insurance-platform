'use client';

import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { documentPageUrl, fetchDocument, type DocumentMetadata } from '@org/shared';

export type DocumentLoadPhase =
  | 'loading-metadata'
  | 'loading-pages'
  | 'ready'
  | 'error';

export const documentQueryKey = (id: string | null) =>
  ['document', id] as const;

const firstPageQueryKey = (id: string | null) =>
  ['document-first-page', id] as const;

export interface DocumentLoaderResult {
  phase: DocumentLoadPhase;
  /** Combined perceived progress, 0–100. */
  progress: number;
  metadata?: DocumentMetadata;
  error?: string;
  /** True when metadata was already cached (e.g. prefetched on row hover). */
  prefetched: boolean;
  /** Aborts the in-flight fetches and invokes `onCancel`. */
  cancel: () => void;
  retry: () => void;
}

export interface UseDocumentLoaderOptions {
  onCancel?: () => void;
}

/**
 * Two real network phases gate "ready":
 *   1. document metadata  (0–50%)
 *   2. first page content (50–100%)
 * so the progress bar reflects actual loading, and the workspace only renders
 * the viewer once genuine content has arrived. A small creep within each band
 * keeps the bar moving for perceived performance.
 */
export function useDocumentLoader(
  documentId: string | null,
  options: UseDocumentLoaderOptions = {}
): DocumentLoaderResult {
  const queryClient = useQueryClient();
  const { onCancel } = options;

  const prefetchedRef = React.useRef(
    Boolean(documentId) &&
      queryClient.getQueryData(documentQueryKey(documentId)) !== undefined
  );

  const metadataQuery = useQuery({
    queryKey: documentQueryKey(documentId),
    queryFn: ({ signal }) => fetchDocument(documentId as string, signal),
    enabled: Boolean(documentId),
    retry: false,
    staleTime: 60_000,
  });

  const metadata = metadataQuery.data;
  const firstPageUrl = metadata
    ? documentPageUrl(metadata.rangeUrlTemplate, 1)
    : null;

  const firstPageQuery = useQuery({
    queryKey: firstPageQueryKey(documentId),
    queryFn: async ({ signal }) => {
      const response = await fetch(firstPageUrl as string, { signal });
      if (!response.ok) {
        throw new Error('Failed to load the first page');
      }
      await response.blob();
      return true;
    },
    enabled: Boolean(firstPageUrl),
    retry: false,
    staleTime: 60_000,
  });

  const isError = metadataQuery.isError || firstPageQuery.isError;
  let stage: 'metadata' | 'pages' | 'ready' | 'error';
  if (isError) {
    stage = 'error';
  } else if (!metadata) {
    stage = 'metadata';
  } else if (!firstPageQuery.data) {
    stage = 'pages';
  } else {
    stage = 'ready';
  }

  const [progress, setProgress] = React.useState(
    prefetchedRef.current ? 50 : 0
  );

  React.useEffect(() => {
    if (stage === 'ready') {
      setProgress(100);
      return;
    }
    if (stage === 'error') {
      return;
    }
    const band: [number, number] = stage === 'metadata' ? [5, 45] : [55, 92];
    setProgress((prev) => Math.max(prev, band[0]));
    const interval = window.setInterval(() => {
      setProgress((prev) => Math.min(band[1], prev + Math.random() * 5 + 2));
    }, 160);
    return () => window.clearInterval(interval);
  }, [stage]);

  const cancel = React.useCallback(() => {
    if (documentId) {
      void queryClient.cancelQueries({
        queryKey: documentQueryKey(documentId),
      });
      void queryClient.cancelQueries({
        queryKey: firstPageQueryKey(documentId),
      });
    }
    onCancel?.();
  }, [documentId, onCancel, queryClient]);

  const retry = React.useCallback(() => {
    prefetchedRef.current = false;
    setProgress(0);
    void metadataQuery.refetch();
    void firstPageQuery.refetch();
  }, [metadataQuery, firstPageQuery]);

  const phase: DocumentLoadPhase =
    stage === 'error'
      ? 'error'
      : stage === 'metadata'
        ? 'loading-metadata'
        : stage === 'pages'
          ? 'loading-pages'
          : 'ready';

  const error =
    metadataQuery.error instanceof Error
      ? metadataQuery.error.message
      : firstPageQuery.error instanceof Error
        ? firstPageQuery.error.message
        : isError
          ? 'Failed to load document'
          : undefined;

  return {
    phase,
    progress: Math.floor(progress),
    metadata,
    error,
    prefetched: prefetchedRef.current,
    cancel,
    retry,
  };
}
