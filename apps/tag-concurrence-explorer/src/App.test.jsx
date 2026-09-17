import React from 'react';
import { expect, test, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App, { elementsFromData } from './App';
const mocked = vi.hoisted(() => ({ lastProps: null, png: vi.fn(() => 'data:image/png;base64,test') }));
vi.mock('react-cytoscapejs', async () => {
  const { useEffect } = await import('react');
  const collection = { removeClass() {}, difference() { return { addClass() {} }; } };
  const cy = { on() {}, elements: () => collection, getElementById: () => ({ length: 0 }), png: mocked.png };
  return { default: props => { mocked.lastProps = props; useEffect(() => { props.cy(cy); }, []); return <div data-testid="cy" />; } };
});
const graph = { nodes: [{ id: 'risk', weight: 3 }, { id: 'decision', weight: 2 }, { id: 'solo', weight: 1 }], edges: [{ source: 'risk', target: 'decision', weight: 2 }] };
const metadata = { sourceAppCount: 19, nodeCount: 3, edgeCount: 1, refreshedAt: '2026-09-17T00:00:00Z' };
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(file => Promise.resolve({ ok: true, json: () => Promise.resolve(file.includes('metadata') ? metadata : graph) })));
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });
const loaded = () => screen.findByRole('link', { name: '19-app React catalogue' });
test('loads provenance, retains all tags at zero and provides all three layouts', async () => {
  render(<App />); await loaded(); expect(screen.getByLabelText('Layout')).toHaveValue('grid'); expect(screen.getByText('Showing 3 tags and 1 connections.')).toBeInTheDocument();
  for (const layout of ['cose', 'concentric', 'grid']) { fireEvent.change(screen.getByLabelText('Layout'), { target: { value: layout } }); expect(mocked.lastProps.layout.name).toBe(layout); }
  expect(mocked.lastProps.stylesheet[0].style.width).toBe('mapData(weight, 1, 3, 24, 64)');
});
test('inspect a tag, filter its visible neighbours and clear a filtered-out selection', async () => {
  render(<App />); await loaded(); fireEvent.change(screen.getByLabelText('Inspect a tag'), { target: { value: 'risk' } });
  expect(screen.getByText('Appears in 3 apps.')).toBeInTheDocument(); expect(screen.getByText('decision: 2 shared apps')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/Min edge weight/), { target: { value: '2' } }); expect(screen.getByText('Showing 2 tags and 1 connections.')).toBeInTheDocument(); expect(screen.queryByRole('option', { name: 'solo' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Clear selection' })); expect(screen.queryByText('Appears in 3 apps.')).not.toBeInTheDocument();
});
test('label toggle and PNG export operate on the rendered graph', async () => {
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  render(<App />); await loaded(); fireEvent.click(screen.getByRole('button', { name: 'Hide Labels' })); expect(mocked.lastProps.stylesheet[0].style.label).toBe('');
  fireEvent.click(screen.getByRole('button', { name: 'Download PNG' })); expect(mocked.png).toHaveBeenCalledWith({ full: true, bg: 'white' }); expect(click).toHaveBeenCalledOnce();
});
test('network failure is visible and retry can restore the graph', async () => {
  fetch.mockRejectedValueOnce(new Error('offline')); render(<App />); expect(await screen.findByRole('alert')).toHaveTextContent('could not be loaded');
  fireEvent.click(screen.getByRole('button', { name: 'Retry loading' })); await loaded(); await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
});
test('weight filtering preserves isolated tags only in the all-tags view', () => {
  expect(elementsFromData(graph, 0).filter(element => !element.data.source)).toHaveLength(3);
  expect(elementsFromData(graph, 2).map(element => element.data.id)).toEqual(['risk', 'decision', 'risk-decision']);
  expect(elementsFromData(graph, 3)).toEqual([]);
});
