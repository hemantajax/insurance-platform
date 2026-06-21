import { render, screen } from '@testing-library/react';

import {
  DocumentLoadError,
  DocumentLoadingState,
} from './document-loading-state';

describe('DocumentLoadingState', () => {
  it('renders the label and progress', () => {
    render(<DocumentLoadingState progress={42} label="Loading document…" />);
    expect(screen.getByText('Loading document…')).toBeTruthy();
    expect(screen.getByText('42%')).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe(
      '42'
    );
  });

  it('shows a cancel button when onCancel is provided', () => {
    render(
      <DocumentLoadingState
        progress={10}
        label="Preparing…"
        onCancel={() => undefined}
      />
    );
    expect(screen.getByRole('button', { name: /cancel/i })).toBeTruthy();
  });
});

describe('DocumentLoadError', () => {
  it('renders retry and back actions', () => {
    render(
      <DocumentLoadError
        message="Boom"
        onRetry={() => undefined}
        onBack={() => undefined}
      />
    );
    expect(screen.getByText('Boom')).toBeTruthy();
    expect(screen.getByRole('button', { name: /retry/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /back to grid/i })).toBeTruthy();
  });
});
