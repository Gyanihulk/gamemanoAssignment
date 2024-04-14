// __tests__/root-layout.test.tsx

import React from 'react';
import { render } from '@testing-library/react';
import RootLayout from '../app/layout';


describe('RootLayout', () => {
  it('renders without crashing', async () => {
    // Render the RootLayout component with some child content
    const { findByText } = render(
      <RootLayout>
        <div>Test Child Content</div>
      </RootLayout>
    );

    // Wait for the "Test Child Content" text to appear in the document
    const childContent = await findByText('Test Child Content');
    
    // Check that the "Test Child Content" is in the document
    expect(childContent).toBeInTheDocument();
  });
});
