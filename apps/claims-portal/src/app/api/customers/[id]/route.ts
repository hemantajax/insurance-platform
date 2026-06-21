import { NextResponse } from 'next/server';

import { getServerSessionUser } from '../../../../lib/auth/server-session';
import { getCustomerById, simulateDelay } from '../../../../lib/mock-db/store';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const url = new URL(request.url);

  try {
    const user = await getServerSessionUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await simulateDelay(url.searchParams.get('simulateError'));

    const customer = getCustomerById(id);
    if (!customer) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
