import { cookies } from 'next/headers';

import { parseSessionToken, SESSION_COOKIE, type SessionUser } from '@org/shared';

export async function getServerSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = parseSessionToken(token);
  return session?.user ?? null;
}
