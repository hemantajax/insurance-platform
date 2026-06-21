import { render } from '@testing-library/react';

import { Button } from '../index';

describe('DesignSystem', () => {
  it('should render Button', () => {
    const { baseElement } = render(<Button>Test</Button>);
    expect(baseElement).toBeTruthy();
  });
});
