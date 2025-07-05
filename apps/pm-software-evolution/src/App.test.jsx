import { expect, test, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import PMSoftwareEvolution from './App.jsx';

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => ({
    clearRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    bezierCurveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    setLineDash: () => {},
  });
});

test('renders main heading', () => {
  render(<PMSoftwareEvolution />);
  const heading = screen.getByText(/Software Evolution/i);
  expect(heading).toBeDefined();
});
