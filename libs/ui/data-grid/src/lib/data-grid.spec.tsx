import { render } from '@testing-library/react';

import OrgDataGrid from './data-grid';

describe('OrgDataGrid', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgDataGrid />);
    expect(baseElement).toBeTruthy();
  });
});
