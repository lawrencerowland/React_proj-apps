import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import DataMaturityAssessment from './App';

test('renders data maturity heading', () => {
  render(<DataMaturityAssessment />);
  const heading = screen.getByText(/Data Maturity Assessment Framework/i);
  expect(heading).toBeDefined();
});
