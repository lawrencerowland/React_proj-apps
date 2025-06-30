import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

const nodes = [
  { id: 'scope', position: { x: 0, y: 0 }, data: { label: 'Scope' }, style: { background: '#b7eb8f' } },
  { id: 'track', position: { x: 200, y: -120 }, data: { label: 'Track Sections' }, style: { background: '#b7eb8f' } },
  { id: 'stations', position: { x: 200, y: 0 }, data: { label: 'Stations' }, style: { background: '#b7eb8f' } },
  { id: 'integration', position: { x: 200, y: 120 }, data: { label: 'Service Integration' }, style: { background: '#b7eb8f' } },
  { id: 'track_built', position: { x: 400, y: -120 }, data: { label: 'Track built' }, style: { background: '#b7eb8f' } },
  { id: 'stations_improved', position: { x: 400, y: 0 }, data: { label: 'Stations improved' }, style: { background: '#b7eb8f' } },
  { id: 'timetable', position: { x: 400, y: 120 }, data: { label: 'Timetable integrated' }, style: { background: '#b7eb8f' } },

  { id: 'benefits', position: { x: 1000, y: 0 }, data: { label: 'Benefits' }, style: { background: '#91d5ff' } },
  { id: 'growth', position: { x: 800, y: -120 }, data: { label: 'Economic Growth' }, style: { background: '#91d5ff' } },
  { id: 'congestion', position: { x: 800, y: 0 }, data: { label: 'Less Congestion' }, style: { background: '#91d5ff' } },
  { id: 'environment', position: { x: 800, y: 120 }, data: { label: 'Environmental' }, style: { background: '#91d5ff' } },
  { id: 'jobs', position: { x: 600, y: -120 }, data: { label: 'More Jobs' }, style: { background: '#91d5ff' } },
  { id: 'faster', position: { x: 600, y: 0 }, data: { label: 'Faster Travel' }, style: { background: '#91d5ff' } },
  { id: 'cleaner', position: { x: 600, y: 120 }, data: { label: 'Lower Emissions' }, style: { background: '#91d5ff' } },
];

const edges = [
  { id: 'e1', source: 'scope', target: 'track' },
  { id: 'e2', source: 'scope', target: 'stations' },
  { id: 'e3', source: 'scope', target: 'integration' },
  { id: 'e4', source: 'track', target: 'track_built' },
  { id: 'e5', source: 'stations', target: 'stations_improved' },
  { id: 'e6', source: 'integration', target: 'timetable' },

  { id: 'e7', source: 'benefits', target: 'growth' },
  { id: 'e8', source: 'benefits', target: 'congestion' },
  { id: 'e9', source: 'benefits', target: 'environment' },
  { id: 'e10', source: 'growth', target: 'jobs' },
  { id: 'e11', source: 'congestion', target: 'faster' },
  { id: 'e12', source: 'environment', target: 'cleaner' },

  // cross connections
  { id: 'c1', source: 'track_built', target: 'faster', animated: true },
  { id: 'c2', source: 'stations_improved', target: 'faster', animated: true },
  { id: 'c3', source: 'timetable', target: 'jobs', animated: true },
  { id: 'c4', source: 'timetable', target: 'cleaner', animated: true },
];

export default function App() {
  return (
    <div className="app-container">
      <h1>Scope to Benefits Tree: East West Rail</h1>
      <ReactFlow nodes={nodes} edges={edges} fitView className="tree-flow">
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

