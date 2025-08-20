import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import './App.css';

function elementsFromData(data, threshold){
  const filteredEdges = data.edges.filter(e=>e.weight>=threshold);
  const nodes = data.nodes.map(n=>({ data:{ id:n.id, weight:n.weight}}));
  const edges = filteredEdges.map(e=>({ data:{ id:`${e.source}-${e.target}`, source:e.source, target:e.target, weight:e.weight}}));
  return [...nodes, ...edges];
}

export default function App(){
  const [threshold, setThreshold] = useState(0);
  // default layout is grid so users immediately see a structured view
  const [layout, setLayout] = useState('grid');
  const [data, setData] = useState({ nodes: [], edges: [] });
  const [tooltip, setTooltip] = useState(null);
  const [showLabels, setShowLabels] = useState(false);
  const cyRef = useRef(null);

  const handleCy = useCallback((cy) => {
    cyRef.current = cy;
    cy.on('mouseover', 'node', (evt) => {
      const { x, y } = evt.renderedPosition || evt.position;
      setTooltip({ label: evt.target.data('id'), x, y });
    });
    cy.on('mouseout', 'node', () => setTooltip(null));
    cy.on('mousemove', 'node', (evt) => {
      const { x, y } = evt.renderedPosition || evt.position;
      setTooltip(t => t ? { ...t, x, y } : t);
    });
  }, []);

  useEffect(() => {
    fetch('./tag_concurrence_graph.json')
      .then(r => r.json())
      .then(setData)
      .catch(err => console.error('Failed to load graph data', err));
  }, []);

  const elements = useMemo(() => elementsFromData(data, threshold), [data, threshold]);
  const stylesheet = useMemo(() => ([
    { selector: 'node', style: { label: showLabels ? 'data(id)' : '' } }
  ]), [showLabels]);

  const handleDownload = () => {
    if (cyRef.current) {
      const uri = cyRef.current.png({ full: true });
      const a = document.createElement('a');
      a.href = uri;
      a.download = 'tag-concurrence.png';
      a.click();
    }
  };

  return (
    <div className="app-container">
      <h1>Concepts in the apps on this website: a visualiser for document tags</h1>
      <p className="getting-started">You will initially see one big node. Just click on "Concentric" or "Grid" layout to get started. To see tags, hover over nodes.</p>
      <section className="instructions">
        <h2>How to Use</h2>
        <h3>Basic Navigation</h3>
        <ul>
          <li>Click and drag to move around the graph</li>
          <li>Scroll to zoom in/out</li>
          <li>Click nodes to see their connections</li>
        </ul>
        <h3>Features</h3>
        <ul>
          <li>Switch between different layouts using the dropdown</li>
          <li>Filter connections by weight using the slider</li>
          <li>Toggle node labels on/off</li>
          <li>Download your current view</li>
        </ul>
      </section>
      <div className="controls">
        <label>Min edge weight: {threshold}</label>
        <input type="range" min="0" max="10" value={threshold} onChange={e=>setThreshold(+e.target.value)}/>
        <select value={layout} onChange={e=>setLayout(e.target.value)}>
          <option value="cose">Cose</option>
          <option value="concentric">Concentric</option>
          <option value="grid">Grid</option>
        </select>
        <button onClick={()=>setShowLabels(s=>!s)}>{showLabels ? 'Hide Labels' : 'Show Labels'}</button>
        <button onClick={handleDownload}>Download</button>
      </div>
      <div className="cy-container">
        <CytoscapeComponent cy={handleCy} elements={elements} stylesheet={stylesheet} style={{ width: '100%', height: '100%' }} layout={{ name: layout }} />
        {tooltip && (
          <div className="cy-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
            {tooltip.label}
          </div>
        )}
      </div>
      <section className="about">
        <h2>About This Tool</h2>
        <p>This web-based visualization displays relationships between tags using interactive network graphs. Features include:</p>
        <ul>
          <li>Community detection algorithms</li>
          <li>Node sizes weighted by tag frequency</li>
          <li>Interactive filtering capabilities</li>
        </ul>
      </section>
    </div>
  );
}
