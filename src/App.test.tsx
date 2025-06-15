import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders simulation heading', () => {
  render(<App />);
  const heading = screen.getByText(/Project Management Simulation with Active Inference/i);
  expect(heading).toBeDefined();
});
