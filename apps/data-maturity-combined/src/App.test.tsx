import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import DataMaturityCombined from './App';

test('renders heading', () => {
  render(<DataMaturityCombined />);
  const heading = screen.getByText(/Data Maturity Combined/i);
  expect(heading).toBeDefined();
});
