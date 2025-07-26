import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders min edge weight label', () => {
  render(<App />);
  const label = screen.getByText(/Min edge weight/i);
  expect(label).toBeDefined();
});
