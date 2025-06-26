import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('renders initial question', () => {
  render(<App />);
  const q = screen.getByText(/What type of decision are you making?/i);
  expect(q).toBeDefined();
});

test('shows the graph container', () => {
  render(<App />);
  const graph = document.querySelector('.react-flow');
  expect(graph).toBeDefined();
});
