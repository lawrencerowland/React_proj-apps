import React from 'react';
import ForceGraph2D from 'react-force-graph';
import './App.css';

export default function App() {
  // Define the graph data schema
  const data = {
    nodes: [
      { id: 'Stakeholder', color: 'yellow' },
      { id: 'claim' },
      { id: 'collaboration_style' },
      { id: 'Public_press_presence' },
      { id: 'Internal_stakeholders' },
      { id: 'User_engagement' },
      { id: 'External_event' },
      { id: 'Public_persona' },
      { id: 'Level_of_project_support' },
      { id: 'Outgoing_communication' },
      { id: 'reasoning_style' },
      { id: 'Project_awareness' },
      { id: 'Level_of_formal_representation' },
      { id: 'Stakeholder_importance' },
      { id: 'Project_role' },
      { id: 'External_project' },
      { id: 'Project_scope' },
      { id: 'Business_theme' },
      { id: 'product_Breakdown_structure' },
      { id: 'externality' },
      { id: 'agreement' },
      { id: 'veto' },
      { id: 'Post_project_role' },
    ],
    links: [
      { source: 'Stakeholder', target: 'claim', label: 'demands' },
      { source: 'Stakeholder', target: 'collaboration_style' },
      { source: 'Stakeholder', target: 'Public_press_presence' },
      { source: 'Stakeholder', target: 'Internal_stakeholders' },
      { source: 'Stakeholder', target: 'Project_role', label: 'has_project_role' },
      { source: 'Project_role', target: 'External_project', label: 'has_project_interfaces' },
      { source: 'External_project', target: 'Project_scope', label: 'has_interface_to' },
      { source: 'Public_persona', target: 'Level_of_project_support', label: 'interacts_with' },
      { source: 'Stakeholder', target: 'Project_awareness', label: 'has_level_of_awareness' },
      { source: 'Business_theme', target: 'Stakeholder', label: 'relates_to' },
      { source: 'Stakeholder', target: 'External_event', label: 'has_caused' },
    ],
  };


  return (
    <div>
      <h1>Interactive Stakeholder Graph</h1>
      <ForceGraph2D
        graphData={data}
        nodeAutoColorBy="id"
      />
    </div>
  );
}

