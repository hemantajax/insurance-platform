import { render } from '@testing-library/react';

import OrgDesignSystem from './design-system';

describe('OrgDesignSystem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgDesignSystem />);
    expect(baseElement).toBeTruthy();
  });
});
