import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('react-force-graph-2d', () => ({
  default: () => <canvas data-testid="graph" />
}))

test('renders graph heading', () => {
  render(<App />);
  const heading = screen.getByText(/Interactive Stakeholder Graph/i);
  expect(heading).toBeDefined();
});

test('shows instruction toggle button', () => {
  render(<App />);
  const btn = screen.getByRole('button', { name: /show instructions/i });
  expect(btn).toBeDefined();
});

