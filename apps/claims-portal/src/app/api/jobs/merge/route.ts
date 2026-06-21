import { NextResponse } from 'next/server';

import { PERMISSIONS } from '@org/shared';

import { getServerSessionUser } from '../../../../lib/auth/server-session';
import { createJob, requirePermission, simulateDelay } from '../../../../lib/mock-db/store';

export async function POST(request: Request) {
  try {
    const user = await getServerSessionUser();
    if (!requirePermission(user, PERMISSIONS.CLAIM_EDIT)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await request.json();
    await simulateDelay();
    const job = createJob('merge');
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
