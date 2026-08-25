import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import App from './App';

vi.mock('d3', () => {
  const makeSelection = () => {
    const selection = {};
    selection.selectAll = () => makeSelection();
    selection.append = () => makeSelection();
    selection.filter = () => makeSelection();
    selection.node = () => ({ focus: vi.fn() });
    selection.attr = () => selection;
    selection.style = () => selection;
    selection.text = () => selection;
    selection.data = () => selection;
    selection.join = () => selection;
    selection.call = () => selection;
    selection.on = () => selection;
    selection.classed = () => selection;
    selection.remove = () => selection;
    return selection;
  };

  const chain = () => {
    const value = {};
    value.id = () => value;
    value.distance = () => value;
    value.strength = () => value;
    value.radius = () => value;
    return value;
  };

  const zoom = () => {
    const behavior = () => {};
    behavior.scaleExtent = () => behavior;
    behavior.filter = () => behavior;
    behavior.on = () => behavior;
    behavior.transform = vi.fn();
    behavior.scaleBy = vi.fn();
    return behavior;
  };

  const drag = () => {
    const behavior = () => {};
    behavior.on = () => behavior;
    return behavior;
  };

  const zoomIdentity = {
    translate: () => zoomIdentity,
    scale: () => zoomIdentity
  };

  return {
    select: () => makeSelection(),
    zoom,
    drag,
    zoomIdentity,
    randomLcg: () => () => 0.42,
    forceLink: chain,
    forceManyBody: chain,
    forceCenter: chain,
    forceX: chain,
    forceY: chain,
    forceCollide: chain,
    forceSimulation: nodes => {
      nodes.forEach((node, index) => {
        node.x = 80 + (index % 8) * 90;
        node.y = 70 + Math.floor(index / 8) * 70;
      });
      const simulation = {
        randomSource: () => simulation,
        force: () => simulation,
        stop: () => simulation,
        tick: () => simulation
      };
      return simulation;
    },
    min: (values, accessor) => Math.min(...values.map(accessor)),
    max: (values, accessor) => Math.max(...values.map(accessor))
  };
});

afterEach(() => cleanup());

describe('Project Controls Knowledge Graph', () => {
  test('renders the complete default view and real category controls', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Project Controls Knowledge Graph' })).toBeInTheDocument();
    expect(screen.getByText(/Showing 56 of 56 concepts across all categories/)).toBeInTheDocument();

    const projectManagementFilter = screen.getByRole('button', { name: /Project Management Core/ });
    expect(projectManagementFilter).toHaveAttribute('aria-pressed', 'true');

    await user.click(projectManagementFilter);
    expect(projectManagementFilter).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText(/Showing 46 of 56 concepts across 5 categories/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show all' }));
    expect(screen.getByText(/Showing 56 of 56 concepts across all categories/)).toBeInTheDocument();
  });

  test('search composes with category filters and Clear exposes an empty state', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Find a concept' }), 'forecasting');
    expect(screen.getByText(/Showing 2 of 56 concepts/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Documents & Deliverables/ }));
    expect(screen.getByText(/Showing 1 of 56 concepts/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByText(/Showing 0 of 56 concepts across no categories/)).toBeInTheDocument();
    expect(screen.getByText('No concepts match this view.')).toBeInTheDocument();
  });

  test('opens concept details with typed relationships and clears a hidden selection', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Cost Control' }));
    expect(screen.getByRole('heading', { name: 'Cost Control' })).toBeInTheDocument();
    expect(screen.getByText('informs')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Performance Measurement' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Project Controls Core/ }));
    expect(screen.queryByRole('heading', { name: 'Cost Control' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Browse concepts' })).toBeInTheDocument();
  });

  test('runs the explicit guided path from Project Manager to Project Controller', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Start PM/ }));
    expect(screen.getByText('Step 1 of 8')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Project Manager' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next step' }));
    expect(screen.getByText('Step 2 of 8')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Project Planning' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /8 Project Controller/ }));
    expect(screen.getByText('Step 8 of 8')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Project Controller' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Finish path' }));
    expect(screen.getByRole('heading', { name: 'Browse concepts' })).toBeInTheDocument();
  });

  test('uses an accessible About dialog, Escape close and focus return', async () => {
    const user = userEvent.setup();
    render(<App />);

    const aboutButton = screen.getByRole('button', { name: 'About this graph' });
    aboutButton.focus();
    await user.click(aboutButton);

    expect(screen.getByRole('dialog', { name: 'About this knowledge graph' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close About' })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(aboutButton).toHaveFocus();
  });

  test('exposes visible graph view controls without relying on the mouse wheel', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Zoom in' }));
    await user.click(screen.getByRole('button', { name: 'Zoom out' }));
    await user.click(screen.getByRole('button', { name: 'Fit graph' }));
    await user.click(screen.getByRole('button', { name: 'Reset layout' }));

    expect(screen.getByRole('button', { name: 'Fit graph' })).toBeEnabled();
  });
});
