import { NextResponse } from 'next/server';

import { PERMISSIONS } from '@org/shared';

import { getServerSessionUser } from '../../../../lib/auth/server-session';
import { getJob, requirePermission, simulateDelay } from '../../../../lib/mock-db/store';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const user = await getServerSessionUser();
    if (!requirePermission(user, PERMISSIONS.CLAIM_VIEW)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await simulateDelay();
    const job = getJob(id);
    if (!job) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
