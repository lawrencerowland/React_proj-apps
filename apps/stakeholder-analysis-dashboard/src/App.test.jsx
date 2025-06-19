import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard heading', () => {
  render(<App />);
  const heading = screen.getByText(/Stakeholder Analysis Dashboard/i);
  expect(heading).toBeDefined();
});
