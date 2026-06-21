'use client';

import { EmptyState, PromoteIcon } from '@org/layout';

export default function PromotePage() {
  return (
    <EmptyState
      icon={<PromoteIcon className="h-6 w-6" />}
      title="Promote"
      description="Campaigns and promotions — sample placeholder page."
    />
  );
}
