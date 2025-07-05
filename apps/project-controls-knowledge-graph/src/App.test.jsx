import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

vi.mock('react', async () => {
  const React = await vi.importActual('react');
  return { ...React, useEffect: () => {} };
});

import React from 'react';
import App from './App';

// Mock d3 to avoid DOM-related issues during tests
vi.mock('d3', () => ({
  __esModule: true,
  select: () => {
    const dummy = {};
    dummy.selectAll = () => ({ remove: () => {} });
    dummy.append = () => dummy;
    dummy.attr = () => dummy;
    dummy.call = () => dummy;
    return dummy;
  },
  forceSimulation: () => {
    const sim = { force: () => sim, on: () => sim, stop: () => {} };
    return sim;
  },
  forceLink: () => {
    const link = {};
    link.id = () => link;
    link.distance = () => link;
    return link;
  },
  forceManyBody: () => ({ strength: () => ({}) }),
  forceCenter: () => ({}),
  forceCollide: () => ({ radius: () => ({}) }),
  zoom: () => ({ scaleExtent: () => ({ on: () => {} }) })
}));

test('renders graph heading', () => {
  render(<App />);
  const heading = screen.getByText(/Project Controls Knowledge Graph/i);
  expect(heading).toBeDefined();
});



