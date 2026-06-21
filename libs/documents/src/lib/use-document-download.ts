'use client';

import * as React from 'react';

import { documentDownloadUrl } from '@org/shared';

export type DownloadStatus =
  | 'idle'
  | 'downloading'
  | 'done'
  | 'error'
  | 'cancelled';

export interface DocumentDownloadResult {
  status: DownloadStatus;
  /** 0–100, or null when the server didn't report a total size. */
  progress: number | null;
  receivedBytes: number;
  totalBytes: number | null;
  error?: string;
  start: () => void;
  cancel: () => void;
}

/**
 * Streams the (mock) document via fetch + ReadableStream so the UI can show
 * real byte-level progress and abort mid-flight — the production pattern for
 * large files, never buffering the whole binary up front in app state.
 */
export function useDocumentDownload(
  documentId: string,
  fileName: string
): DocumentDownloadResult {
  const [status, setStatus] = React.useState<DownloadStatus>('idle');
  const [receivedBytes, setReceivedBytes] = React.useState(0);
  const [totalBytes, setTotalBytes] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const controllerRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  const start = React.useCallback(() => {
    if (status === 'downloading') {
      return;
    }
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus('downloading');
    setError(undefined);
    setReceivedBytes(0);
    setTotalBytes(null);

    void (async () => {
      try {
        const response = await fetch(documentDownloadUrl(documentId), {
          signal: controller.signal,
        });
        if (!response.ok || !response.body) {
          throw new Error(`Download failed (${response.status})`);
        }
        const lengthHeader = response.headers.get('Content-Length');
        const total = lengthHeader ? Number(lengthHeader) : null;
        setTotalBytes(total);

        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let received = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          if (value) {
            chunks.push(value);
            received += value.length;
            setReceivedBytes(received);
          }
        }

        const blob = new Blob(chunks as BlobPart[], {
          type: 'application/octet-stream',
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
        setStatus('done');
      } catch (caught) {
        if (controller.signal.aborted) {
          setStatus('cancelled');
          return;
        }
        setError(caught instanceof Error ? caught.message : 'Download failed');
        setStatus('error');
      } finally {
        controllerRef.current = null;
      }
    })();
  }, [documentId, fileName, status]);

  const cancel = React.useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  const progress =
    totalBytes && totalBytes > 0
      ? Math.min(100, Math.floor((receivedBytes / totalBytes) * 100))
      : null;

  return {
    status,
    progress,
    receivedBytes,
    totalBytes,
    error,
    start,
    cancel,
  };
}
