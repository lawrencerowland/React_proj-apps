import React, { useState, useMemo } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import data from './data.js';
import './App.css';

function elementsFromData(threshold){
  const filteredEdges = data.edges.filter(e=>e.weight>=threshold);
  const nodes = data.nodes.map(n=>({ data:{ id:n.id, weight:n.weight}}));
  const edges = filteredEdges.map(e=>({ data:{ id:`${e.source}-${e.target}`, source:e.source, target:e.target, weight:e.weight}}));
  return [...nodes, ...edges];
}

export default function App(){
  const [threshold, setThreshold] = useState(0);
  const [layout, setLayout] = useState('cose');
  const elements = useMemo(()=>elementsFromData(threshold),[threshold]);
  return (
    <div className="app-container">
      <div className="controls">
        <label>Min edge weight: {threshold}</label>
        <input type="range" min="0" max="10" value={threshold} onChange={e=>setThreshold(+e.target.value)}/>
        <select value={layout} onChange={e=>setLayout(e.target.value)}>
          <option value="cose">Cose</option>
          <option value="concentric">Concentric</option>
          <option value="grid">Grid</option>
        </select>
      </div>
      <div className="cy-container">
        <CytoscapeComponent elements={elements} style={{ width: '100%', height: '100%' }} layout={{ name: layout }} />
      </div>
    </div>
  );
}
