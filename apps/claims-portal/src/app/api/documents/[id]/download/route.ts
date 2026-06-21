import { NextResponse } from 'next/server';

import { PERMISSIONS } from '@org/shared';

import { getServerSessionUser } from '../../../../../lib/auth/server-session';
import {
  getDocumentMetadata,
  requirePermission,
} from '../../../../../lib/mock-db/store';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// We never stream the full 150 MB–1 GB document for a case-study mock. Instead
// we stream a bounded sample with an accurate Content-Length and chunked
// delays so the client can show real download progress and exercise cancel.
const SAMPLE_BYTES = 5_000_000;
const CHUNK_SIZE = 64 * 1024;
const CHUNK_DELAY_MS = 35;

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const user = await getServerSessionUser();
  if (!requirePermission(user, PERMISSIONS.CLAIM_VIEW)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const metadata = getDocumentMetadata(id);
  if (!metadata) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  let sent = 0;
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (cancelled) {
        controller.close();
        return;
      }
      const remaining = SAMPLE_BYTES - sent;
      if (remaining <= 0) {
        controller.close();
        return;
      }
      const size = Math.min(CHUNK_SIZE, remaining);
      controller.enqueue(new Uint8Array(size));
      sent += size;
      if (CHUNK_DELAY_MS > 0) {
        await new Promise((resolve) => setTimeout(resolve, CHUNK_DELAY_MS));
      }
    },
    cancel() {
      cancelled = true;
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(SAMPLE_BYTES),
      'Content-Disposition': `attachment; filename="${metadata.fileName}"`,
      'Cache-Control': 'no-store',
    },
  });
}
