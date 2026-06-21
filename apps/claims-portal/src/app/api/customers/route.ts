import { NextResponse } from 'next/server';

import type { CustomerStatus } from '@org/shared';

import { getServerSessionUser } from '../../../lib/auth/server-session';
import {
  getCustomerStats,
  queryCustomers,
  simulateDelay,
} from '../../../lib/mock-db/store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const simulateError = url.searchParams.get('simulateError');

  try {
    const user = await getServerSessionUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await simulateDelay(simulateError);

    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('pageSize') ?? '8');
    const sort =
      (url.searchParams.get('sort') as
        | 'newest'
        | 'oldest'
        | 'name'
        | 'company'
        | null) ?? undefined;
    const status = (url.searchParams.get('status') as CustomerStatus | null) ?? undefined;
    const q = url.searchParams.get('q') ?? undefined;

    const result = queryCustomers({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 8,
      sort: sort || undefined,
      status: status || undefined,
      q: q || undefined,
    });

    return NextResponse.json({
      ...result,
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 8,
      stats: getCustomerStats(),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
