import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { vi } from "vitest";
import App from './App';

// Mock ReactFlow to avoid canvas issues in tests
vi.mock('reactflow', () => ({
  __esModule: true,
  default: ({ children }) => <div className="react-flow">{children}</div>,
  Background: () => <div />,
  Controls: () => <div />,
}));

test('renders heading', () => {
  render(<App />);
  const heading = screen.getByText(/Scope to Benefits Tree/i);
  expect(heading).toBeDefined();
});

test('shows flow container', () => {
  render(<App />);
  const flow = document.querySelector('.tree-flow');
  expect(flow).toBeDefined();
});
