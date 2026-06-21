import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { parseSessionToken, SESSION_COOKIE } from '@org/shared';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = parseSessionToken(token);
  return NextResponse.json({ user: session?.user ?? null });
}
