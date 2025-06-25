import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import MarketTimelineExplorer from './app.jsx';

test('renders winners heading', () => {
  render(<MarketTimelineExplorer />);
  const heading = screen.getByText(/Winners/i);
  expect(heading).toBeDefined();
});
