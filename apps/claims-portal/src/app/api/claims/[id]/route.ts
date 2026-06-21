import { NextResponse } from 'next/server';

import { PERMISSIONS } from '@org/shared';

import { getServerSessionUser } from '../../../../lib/auth/server-session';
import {
  deleteClaimRecord,
  getClaimById,
  requirePermission,
  simulateDelay,
  updateClaimRecord,
} from '../../../../lib/mock-db/store';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const url = new URL(request.url);

  try {
    const user = await getServerSessionUser();
    if (!requirePermission(user, PERMISSIONS.CLAIM_VIEW)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await simulateDelay(url.searchParams.get('simulateError'));
    const claim = getClaimById(id);
    if (!claim) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(claim);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const user = await getServerSessionUser();
    if (!requirePermission(user, PERMISSIONS.CLAIM_EDIT)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = (await request.json()) as Partial<
      Pick<import('@org/shared').Claim, 'status' | 'assignee' | 'assigneeId'>
    >;

    if (body.assigneeId && !requirePermission(user, PERMISSIONS.CLAIM_ASSIGN)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await simulateDelay();
    const updated = updateClaimRecord(id, body);
    if (!updated) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const user = await getServerSessionUser();
    if (!requirePermission(user, PERMISSIONS.CLAIM_DELETE)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await simulateDelay();
    const deleted = deleteClaimRecord(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
