import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Cytoscape component and network fetch to avoid DOM/canvas issues
vi.mock('react-cytoscapejs', () => ({
  __esModule: true,
  default: () => <div data-testid="cy" />,
}));

beforeEach(() => {
  global.fetch = vi.fn(() => Promise.resolve({
    json: () => Promise.resolve({ nodes: [], edges: [] })
  }));
});

test('renders min edge weight label', () => {
  render(<App />);
  const label = screen.getByText(/Min edge weight/i);
  expect(label).toBeDefined();
});

test('defaults to grid layout', () => {
  render(<App />);
  const select = screen.getByRole('combobox');
  expect(select.value).toBe('grid');
});
