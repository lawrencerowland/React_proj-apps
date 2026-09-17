import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import './App.css';

export function elementsFromData(data, threshold) {
  const filteredEdges = data.edges.filter(edge => edge.weight >= threshold);
  const connectedIds = new Set(filteredEdges.flatMap(edge => [edge.source, edge.target]));
  const nodes = data.nodes.filter(node => threshold === 0 || connectedIds.has(node.id)).map(node => ({ data: { id: node.id, weight: node.weight } }));
  const edges = filteredEdges.map(edge => ({ data: { id: `${edge.source}-${edge.target}`, ...edge } }));
  return [...nodes, ...edges];
}
export default function App() {
  const [threshold, setThreshold] = useState(0);
  const [layout, setLayout] = useState('grid');
  const [data, setData] = useState({ nodes: [], edges: [] });
  const [metadata, setMetadata] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  const cyRef = useRef(null);
  const handleCy = useCallback(cy => {
    if (cyRef.current === cy) return;
    cyRef.current = cy;
    setReady(true);
    cy.on('mouseover', 'node', event => {
      const { x, y } = event.renderedPosition || event.position;
      setTooltip({ label: event.target.data('id'), x, y });
    });
    cy.on('mouseout', 'node', () => setTooltip(null));
    cy.on('mousemove', 'node', event => {
      const { x, y } = event.renderedPosition || event.position;
      setTooltip(value => value ? { ...value, x, y } : value);
    });
    cy.on('tap', 'node', event => setSelectedId(event.target.id()));
  }, []);
  useEffect(() => {
    let cancelled = false;
    setError('');
    const read = async file => {
      const response = await fetch(`./${file}`);
      if (!response.ok) throw new Error(`Unable to load ${file}.`);
      return response.json();
    };
    Promise.all([read('tag_concurrence_graph.json'), read('tag_concurrence_metadata.json')]).then(([graph, provenance]) => {
      if (!cancelled) { setData(graph); setMetadata(provenance); }
    }).catch(() => { if (!cancelled) setError('The catalogue graph could not be loaded. Try again.'); });
    return () => { cancelled = true; };
  }, [attempt]);
  const elements = useMemo(() => elementsFromData(data, threshold), [data, threshold]);
  const visibleNodes = elements.filter(element => !('source' in element.data));
  const selected = data.nodes.find(node => node.id === selectedId);
  const neighbours = data.edges.filter(edge => edge.weight >= threshold && (edge.source === selectedId || edge.target === selectedId));
  const maxWeight = Math.max(1, ...data.nodes.map(node => node.weight));
  const stylesheet = useMemo(() => [
    { selector: 'node', style: { label: showLabels ? 'data(id)' : '', width: maxWeight > 1 ? `mapData(weight, 1, ${maxWeight}, 24, 64)` : 28, height: maxWeight > 1 ? `mapData(weight, 1, ${maxWeight}, 24, 64)` : 28, 'background-color': '#397f73', 'font-size': 11, 'text-wrap': 'wrap', 'text-max-width': 100 } },
    { selector: 'edge', style: { width: 1.5, 'line-color': '#95aea8', 'curve-style': 'bezier' } },
    { selector: '.dim', style: { opacity: 0.16 } },
    { selector: '.highlight', style: { 'border-width': 3, 'border-color': '#aa541b', 'line-color': '#aa541b' } },
  ], [showLabels, maxWeight]);
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().removeClass('dim highlight');
    if (selectedId) {
      const node = cy.getElementById(selectedId);
      if (node.length) { const neighbourhood = node.closedNeighborhood(); neighbourhood.addClass('highlight'); cy.elements().difference(neighbourhood).addClass('dim'); }
    }
  }, [selectedId, elements, ready]);
  useEffect(() => {
    if (selectedId && !visibleNodes.some(node => node.data.id === selectedId)) setSelectedId('');
  }, [selectedId, elements]);
  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = cyRef.current.png({ full: true, bg: 'white' });
      link.download = 'tag-concurrence.png'; link.click();
    } catch { setError('PNG export failed. Try again after the graph has finished laying out.'); }
  };
  return <main className="tag-explorer">
    <h1>Concepts in the apps: a catalogue tag map</h1>
    <p>Tags become nodes; an edge counts apps that use both tags. Larger nodes appear in more apps. This shows co-occurrence, not causation, a typed ontology or detected communities.</p>
    {metadata ? <p className="provenance">Source: <a href="../../app-index.csv">{metadata.sourceAppCount}-app React catalogue</a> · {metadata.nodeCount} tags · {metadata.edgeCount} tag pairs · Refreshed {metadata.refreshedAt.slice(0, 10)}. <a href="./tag_concurrence_metadata.json">Source and refresh metadata</a></p> : !error && <p role="status">Loading catalogue…</p>}
    {error && <div role="alert">{error} <button onClick={() => setAttempt(value => value + 1)}>Retry loading</button></div>}
    <div className="tag-controls">
      <label htmlFor="weight">Min edge weight: {threshold}<input id="weight" type="range" min="0" max={Math.max(1, ...data.edges.map(edge => edge.weight))} value={threshold} onChange={event => setThreshold(+event.target.value)} /></label>
      <label htmlFor="layout">Layout<select id="layout" value={layout} onChange={event => setLayout(event.target.value)}><option value="cose">Cose</option><option value="concentric">Concentric</option><option value="grid">Grid</option></select></label>
      <button onClick={() => setShowLabels(value => !value)}>{showLabels ? 'Hide Labels' : 'Show Labels'}</button>
      <button disabled={!ready || !visibleNodes.length} onClick={handleDownload}>Download PNG</button>
    </div>
    <p>Drag to pan; scroll to zoom. Select a node or use the tag list to inspect its visible connections. Weight 0 shows all tags; higher thresholds hide tags without a remaining edge.</p>
    <p aria-live="polite">Showing {visibleNodes.length} tags and {elements.length - visibleNodes.length} connections.</p>
    <div className="cy-container"><CytoscapeComponent cy={handleCy} elements={elements} stylesheet={stylesheet} style={{ width: '100%', height: '100%' }} layout={{ name: layout }} />{tooltip && <div className="cy-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>{tooltip.label}</div>}</div>
    <section className="tag-inspector"><label htmlFor="tag-select">Inspect a tag<select id="tag-select" value={selectedId} onChange={event => setSelectedId(event.target.value)}><option value="">Choose a tag</option>{visibleNodes.map(node => <option key={node.data.id} value={node.data.id}>{node.data.id}</option>)}</select></label>
      {selected && <><h2>{selected.id}</h2><p>Appears in {selected.weight} app{selected.weight === 1 ? '' : 's'}.</p><ul>{neighbours.map(edge => { const other = edge.source === selectedId ? edge.target : edge.source; return <li key={other}>{other}: {edge.weight} shared app{edge.weight === 1 ? '' : 's'}</li>; })}</ul><button onClick={() => setSelectedId('')}>Clear selection</button></>}
    </section>
    <details><summary>How this map is refreshed</summary><p>The generator reads this repository’s app-index.csv, counts each tag once per app, and counts each pair once per app. The existing build refreshes both the graph and its metadata. This page does not upload files or recompute the graph in the browser.</p><p>Maintainers can run <code>node scripts/generate-tag-concurrence-graph.js</code>. The metadata records the source checksum, app names and refresh time so this dataset can be traced to its catalogue.</p></details>
  </main>;
}
