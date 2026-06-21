import { NextResponse } from 'next/server';

import { PERMISSIONS } from '@org/shared';

import { getServerSessionUser } from '../../../lib/auth/server-session';
import {
  addComment,
  listComments,
  requirePermission,
  simulateDelay,
} from '../../../lib/mock-db/store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const documentId = url.searchParams.get('documentId');
  const page = url.searchParams.get('page');

  if (!documentId) {
    return NextResponse.json({ message: 'documentId required' }, { status: 400 });
  }

  try {
    const user = await getServerSessionUser();
    if (!requirePermission(user, PERMISSIONS.CLAIM_VIEW)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await simulateDelay();
    const comments = listComments(
      documentId,
      page ? Number(page) : undefined
    );
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getServerSessionUser();
    if (!requirePermission(user, PERMISSIONS.COMMENT_CREATE)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = (await request.json()) as {
      documentId?: string;
      page?: number;
      body?: string;
    };

    if (!body.documentId || body.page === undefined || !body.body) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    await simulateDelay();
    const comment = addComment({
      documentId: body.documentId,
      page: body.page,
      body: body.body,
      author: user!,
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
