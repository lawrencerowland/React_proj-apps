import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import OlafDeliveryDashboard from './App';

test('renders heading', () => {
  render(<OlafDeliveryDashboard />);
  const heading = screen.getByText(/Olaf Delivery Dashboard/i);
  expect(heading).toBeDefined();
});
