'use client';

import { EmptyState, IncomeIcon } from '@org/layout';

export default function IncomePage() {
  return (
    <EmptyState
      icon={<IncomeIcon className="h-6 w-6" />}
      title="Income"
      description="Revenue and payout reporting — sample placeholder page."
    />
  );
}
