import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders graph heading', () => {
  render(<App />);
  const heading = screen.getByText(/Interactive Stakeholder Graph/i);
  expect(heading).toBeDefined();
});

