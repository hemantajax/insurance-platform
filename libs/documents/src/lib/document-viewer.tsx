'use client';

import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { Button, Input, Skeleton, cn } from '@org/design-system';
import { documentPageUrl, type DocumentMetadata } from '@org/shared';

import { useDocumentDownload } from './use-document-download';

const BASE_PAGE_WIDTH = 760;
const PAGE_ASPECT = 1132 / 800;
const PAGE_GAP = 24;
const MIN_ZOOM = 0.6;
const MAX_ZOOM = 1.6;

function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(2)} GB`;
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${Math.round(bytes / 1_000)} KB`;
  return `${bytes} B`;
}

/** A single lazily-loaded page: skeleton until its image streams in. */
function DocumentPage({
  src,
  pageNumber,
  width,
  height,
}: {
  src: string;
  pageNumber: number;
  width: number;
  height: number;
}) {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <div
      className="relative overflow-hidden rounded-lg border bg-card shadow-sm"
      style={{ width, height }}
    >
      {!loaded ? (
        <Skeleton className="absolute inset-0 h-full w-full rounded-lg" />
      ) : null}
      <img
        src={src}
        alt={`Page ${pageNumber}`}
        loading="lazy"
        width={width}
        height={height}
        onLoad={() => setLoaded(true)}
        className={cn(
          'h-full w-full object-contain transition-opacity duration-200',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
}

function IconDownload() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

export interface DocumentViewerProps {
  metadata: DocumentMetadata;
  className?: string;
}

export function DocumentViewer({ metadata, className }: DocumentViewerProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = React.useState(1);
  const [jumpValue, setJumpValue] = React.useState('1');

  const pageWidth = Math.round(BASE_PAGE_WIDTH * zoom);
  const pageHeight = Math.round(pageWidth * PAGE_ASPECT);

  const virtualizer = useVirtualizer({
    count: metadata.pageCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => pageHeight + PAGE_GAP,
    overscan: 2,
  });

  React.useEffect(() => {
    virtualizer.measure();
  }, [pageHeight, virtualizer]);

  const virtualItems = virtualizer.getVirtualItems();
  const currentPage = (virtualItems[0]?.index ?? 0) + 1;

  React.useEffect(() => {
    setJumpValue(String(currentPage));
  }, [currentPage]);

  const goToPage = React.useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(metadata.pageCount, page));
      virtualizer.scrollToIndex(clamped - 1, { align: 'start' });
    },
    [metadata.pageCount, virtualizer]
  );

  const download = useDocumentDownload(metadata.id, metadata.fileName);

  return (
    <div className={cn('flex flex-1 flex-col gap-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {metadata.fileName}
          </p>
          <p className="text-xs text-muted-foreground">
            {metadata.pageCount.toLocaleString()} pages ·{' '}
            {formatBytes(metadata.sizeBytes)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            Prev
          </Button>
          <form
            className="flex items-center gap-1"
            onSubmit={(event) => {
              event.preventDefault();
              const next = Number(jumpValue);
              if (Number.isFinite(next)) {
                goToPage(next);
              }
            }}
          >
            <Input
              value={jumpValue}
              onChange={(event) => setJumpValue(event.target.value)}
              inputMode="numeric"
              aria-label="Jump to page"
              className="h-8 w-16 text-center"
            />
            <span className="whitespace-nowrap text-xs text-muted-foreground">
              / {metadata.pageCount.toLocaleString()}
            </span>
          </form>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= metadata.pageCount}
            aria-label="Next page"
          >
            Next
          </Button>

          <div className="mx-1 flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.2))}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
            >
              –
            </Button>
            <span className="w-12 text-center text-xs tabular-nums text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.2))}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
            >
              +
            </Button>
          </div>

          {download.status === 'downloading' ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={download.cancel}
            >
              Cancel {download.progress ?? 0}%
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={download.start}
              className="[&_svg]:size-4"
            >
              <IconDownload />
              {download.status === 'done' ? 'Downloaded' : 'Download'}
            </Button>
          )}
        </div>
      </div>

      {download.status === 'error' ? (
        <p className="px-1 text-xs text-destructive">
          {download.error ?? 'Download failed.'}
        </p>
      ) : null}

      <div
        ref={scrollRef}
        className="h-[calc(100dvh-15rem)] min-h-[320px] overflow-auto rounded-xl border bg-muted/30"
      >
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((item) => {
            const page = item.index + 1;
            return (
              <div
                key={item.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${item.start}px)`,
                }}
                className="flex justify-center py-3"
              >
                <DocumentPage
                  src={documentPageUrl(metadata.rangeUrlTemplate, page)}
                  pageNumber={page}
                  width={pageWidth}
                  height={pageHeight}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
