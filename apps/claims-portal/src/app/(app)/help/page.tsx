'use client';

import { EmptyState, HelpIcon } from '@org/layout';

export default function HelpPage() {
  return (
    <EmptyState
      icon={<HelpIcon className="h-6 w-6" />}
      title="Help"
      description="Support center and documentation — sample placeholder page."
    />
  );
}
