import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import DeliveryDashboard from './App';

test("renders Olaf's dashboard heading", () => {
  render(<DeliveryDashboard />);
  const heading = screen.getByText(/Olaf's Delivery Dashboard/i);
  expect(heading).toBeDefined();
});
