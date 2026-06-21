'use client';

import { EmptyState, ProductIcon } from '@org/layout';

export default function ProductPage() {
  return (
    <EmptyState
      icon={<ProductIcon className="h-6 w-6" />}
      title="Product"
      description="Product catalog and plan management — sample placeholder page."
    />
  );
}
