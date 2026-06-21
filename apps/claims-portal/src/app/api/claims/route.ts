import { NextResponse } from 'next/server';

import type { ClaimStatus } from '@org/shared';
import { PERMISSIONS } from '@org/shared';

import { getServerSessionUser } from '../../../lib/auth/server-session';
import {
  queryClaims,
  requirePermission,
  simulateDelay,
} from '../../../lib/mock-db/store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const simulateError = url.searchParams.get('simulateError');

  try {
    const user = await getServerSessionUser();
    if (!requirePermission(user, PERMISSIONS.CLAIM_VIEW)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await simulateDelay(simulateError);

    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('pageSize') ?? '50');
    const sort = url.searchParams.get('sort') ?? undefined;
    const order = (url.searchParams.get('order') as 'asc' | 'desc' | null) ?? undefined;
    const status = (url.searchParams.get('status') as ClaimStatus | null) ?? undefined;
    const assignee = url.searchParams.get('assignee') ?? undefined;
    const q = url.searchParams.get('q') ?? undefined;

    const result = queryClaims({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 50,
      sort,
      order,
      status: status || undefined,
      assignee: assignee || undefined,
      q: q || undefined,
    });

    return NextResponse.json({
      ...result,
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 50,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
