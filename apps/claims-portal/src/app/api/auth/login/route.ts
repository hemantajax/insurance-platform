import { NextResponse } from 'next/server';

import {
  createSession,
  isValidRole,
  serializeSession,
  SESSION_COOKIE,
} from '@org/shared';

export async function POST(request: Request) {
  const body = (await request.json()) as { role?: string };
  if (!isValidRole(body.role)) {
    return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
  }

  const session = createSession(body.role);
  const response = NextResponse.json({ success: true, user: session.user });
  response.cookies.set(SESSION_COOKIE, serializeSession(session), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
