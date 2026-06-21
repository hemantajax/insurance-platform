import { render } from '@testing-library/react';

import OrgLayout from './layout';

describe('OrgLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgLayout />);
    expect(baseElement).toBeTruthy();
  });
});
