import { render, screen } from '@testing-library/react';

import { AppShell } from './app-shell';
import { Breadcrumb } from './breadcrumb';
import { EmptyState } from './empty-state';

describe('AppShell', () => {
  it('renders sidebar and main content', () => {
    render(
      <AppShell sidebar={<aside data-testid="sidebar">Nav</aside>}>
        <div>Content</div>
      </AppShell>
    );

    expect(screen.getByTestId('sidebar')).toBeTruthy();
    expect(screen.getByText('Content')).toBeTruthy();
  });
});

describe('Breadcrumb', () => {
  it('renders trail with current page', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Claims' },
        ]}
      />
    );

    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Claims')).toBeTruthy();
  });
});

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(
      <EmptyState
        title="No claims"
        description="Try adjusting your filters."
      />
    );

    expect(screen.getByText('No claims')).toBeTruthy();
    expect(screen.getByText('Try adjusting your filters.')).toBeTruthy();
  });
});
