import { render } from '@testing-library/react';

import OrgDocuments from './documents';

describe('OrgDocuments', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgDocuments />);
    expect(baseElement).toBeTruthy();
  });
});
