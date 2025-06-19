import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './App.css'

// Mock data
const stakeholderData = [
  { id: 1, name: 'Local Government', influence: 8, alignment: 6, cluster: 'Government', sentiment: 0.6 },
  { id: 2, name: 'Environmental Groups', influence: 6, alignment: 2, cluster: 'NGOs', sentiment: -0.4 },
  { id: 3, name: 'Business Associations', influence: 7, alignment: 8, cluster: 'Business', sentiment: 0.8 },
  { id: 4, name: 'Community Leaders', influence: 5, alignment: 4, cluster: 'Community', sentiment: 0.1 },
  { id: 5, name: 'Transport Authorities', influence: 9, alignment: 7, cluster: 'Government', sentiment: 0.7 },
];

const relationshipData = [
  { source: 'Local Government', target: 'Transport Authorities', value: 3 },
  { source: 'Environmental Groups', target: 'Community Leaders', value: 2 },
  { source: 'Business Associations', target: 'Local Government', value: 2 },
  { source: 'Transport Authorities', target: 'Business Associations', value: 1 },
  { source: 'Community Leaders', target: 'Local Government', value: 2 },
];

const objectivesData = [
  { objective: 'Cost Efficiency', stakeholder: 'Business Associations', opinion: 'Highly Important', sentiment: 0.8 },
  { objective: 'Environmental Impact', stakeholder: 'Environmental Groups', opinion: 'Critical Concern', sentiment: -0.6 },
  { objective: 'Job Creation', stakeholder: 'Local Government', opinion: 'Very Important', sentiment: 0.7 },
  { objective: 'Traffic Reduction', stakeholder: 'Transport Authorities', opinion: 'Primary Goal', sentiment: 0.9 },
  { objective: 'Community Benefits', stakeholder: 'Community Leaders', opinion: 'Essential', sentiment: 0.5 },
];

const StakeholderNetworkGraph = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    const angleStep = (2 * Math.PI) / stakeholderData.length;

    const newNodes = stakeholderData.map((stakeholder, index) => ({
      ...stakeholder,
      x: centerX + radius * Math.cos(index * angleStep),
      y: centerY + radius * Math.sin(index * angleStep),
    }));

    setNodes(newNodes);
    setLinks(relationshipData.map(link => ({
      ...link,
      sourceNode: newNodes.find(node => node.name === link.source),
      targetNode: newNodes.find(node => node.name === link.target),
    })));
  }, []);

  const getColor = (cluster) => {
    const colors = {
      'Government': '#4e79a7',
      'NGOs': '#f28e2c',
      'Business': '#e15759',
      'Community': '#76b7b2',
    };
    return colors[cluster] || '#000000';
  };

  return (
    <div>
      <h2>Stakeholder Network Graph</h2>
      <svg width="100%" height="400" viewBox="0 0 600 400">
        {links.map((link, index) => (
          <line
            key={`link-${index}`}
            x1={link.sourceNode.x}
            y1={link.sourceNode.y}
            x2={link.targetNode.x}
            y2={link.targetNode.y}
            stroke="#999"
            strokeOpacity="0.6"
            strokeWidth={Math.sqrt(link.value)}
          />
        ))}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={Math.sqrt(node.influence) * 3}
              fill={getColor(node.cluster)}
              opacity="0.8"
            />
            <text
              x={node.x}
              y={node.y + 15}
              textAnchor="middle"
              fontSize="10"
              fill="#333"
            >
              {node.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const StakeholderMatrix = () => {
  return (
    <div>
      <h2>Stakeholder Alignment vs Influence Matrix</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="alignment" name="Alignment" domain={[0, 10]} label={{ value: 'Alignment', position: 'bottom' }} />
          <YAxis type="number" dataKey="influence" name="Influence" domain={[0, 10]} label={{ value: 'Influence', angle: -90, position: 'insideLeft' }} />
          <ZAxis type="number" dataKey="sentiment" range={[50, 400]} name="Sentiment" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="Stakeholders" data={stakeholderData} fill="#8884d8">
            {stakeholderData.map((entry, index) => (
              <cell key={`cell-${index}`} fill={entry.sentiment > 0 ? '#82ca9d' : '#ff7300'} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

const ObjectivesAnalysis = () => {
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('objective');

  const filteredAndSortedData = objectivesData
    .filter(item => item.objective.toLowerCase().includes(filter.toLowerCase()) || 
                    item.stakeholder.toLowerCase().includes(filter.toLowerCase()) ||
                    item.opinion.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

  return (
    <div>
      <h2>Stakeholder Objectives Analysis</h2>
      <div>
        <input 
          type="text"
          placeholder="Filter objectives..." 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        />
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="objective">Objective</option>
          <option value="stakeholder">Stakeholder</option>
          <option value="opinion">Opinion</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Objective</th>
            <th>Stakeholder</th>
            <th>Opinion</th>
            <th>Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedData.map((item, index) => (
            <tr key={index}>
              <td>{item.objective}</td>
              <td>{item.stakeholder}</td>
              <td>{item.opinion}</td>
              <td>
                <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '9999px', height: '10px' }}>
                  <div 
                    style={{
                      width: `${Math.abs(item.sentiment * 100)}%`,
                      backgroundColor: item.sentiment > 0 ? '#4caf50' : '#f44336',
                      height: '100%',
                      borderRadius: '9999px'
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SentimentAnalysis = () => {
  return (
    <div>
      <h2>Stakeholder Sentiment Analysis</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={stakeholderData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[-1, 1]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="sentiment" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('stakeholder-manager');

  return (
    <main>
      <h1>Stakeholder Analysis Dashboard</h1>
      <div>
        <button onClick={() => setActiveTab('stakeholder-manager')}>Stakeholder Manager View</button>
        <button onClick={() => setActiveTab('business-case-director')}>Business Case Director View</button>
      </div>
      {activeTab === 'stakeholder-manager' && (
        <div>
          <StakeholderNetworkGraph />
          <StakeholderMatrix />
          <SentimentAnalysis />
        </div>
      )}
      {activeTab === 'business-case-director' && (
        <ObjectivesAnalysis />
      )}
    </main>
  )
}