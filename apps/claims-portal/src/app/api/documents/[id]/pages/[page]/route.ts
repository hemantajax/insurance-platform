import { NextResponse } from 'next/server';

import { PERMISSIONS } from '@org/shared';

import { getServerSessionUser } from '../../../../../../lib/auth/server-session';
import {
  renderPlaceholderPage,
  requirePermission,
} from '../../../../../../lib/mock-db/store';

interface RouteContext {
  params: Promise<{ id: string; page: string }>;
}

// Per-page latency so the viewer's lazy load + skeleton placeholders are
// visible while scrolling a large document.
const PAGE_DELAY_MS = { min: 120, max: 420 };

export async function GET(_request: Request, context: RouteContext) {
  const { id, page } = await context.params;

  const user = await getServerSessionUser();
  if (!requirePermission(user, PERMISSIONS.CLAIM_VIEW)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const pageNumber = Number(page);
  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    return NextResponse.json({ message: 'Invalid page' }, { status: 400 });
  }

  const delay =
    PAGE_DELAY_MS.min +
    Math.floor(Math.random() * (PAGE_DELAY_MS.max - PAGE_DELAY_MS.min));
  await new Promise((resolve) => setTimeout(resolve, delay));

  const svg = renderPlaceholderPage(id, pageNumber);
  if (!svg) {
    return NextResponse.json({ message: 'Page not found' }, { status: 404 });
  }

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'private, max-age=120',
    },
  });
}
