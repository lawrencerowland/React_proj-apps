import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

test('renders heading and allows toggling labels', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /Concepts in the apps/i });
  expect(heading).toBeDefined();
  const button = screen.getByRole('button', { name: /show labels/i });
  fireEvent.click(button);
  expect(button.textContent.toLowerCase()).toContain('hide');
});
