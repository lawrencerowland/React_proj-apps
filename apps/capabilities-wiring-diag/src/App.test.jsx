import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import AICapabilitiesDiagram from './app.jsx';

test('renders diagram heading', () => {
  render(<AICapabilitiesDiagram />);
  const heading = screen.getByText(/AI Models Capabilities Wiring Diagram/i);
  expect(heading).toBeDefined();
});
