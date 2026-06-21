import { render } from '@testing-library/react';

import OrgClaims from './claims';

describe('OrgClaims', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgClaims />);
    expect(baseElement).toBeTruthy();
  });
});
