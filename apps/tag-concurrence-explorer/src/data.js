const data = {
  nodes: [
    { id: 'A', weight: 10 },
    { id: 'B', weight: 8 },
    { id: 'C', weight: 6 },
    { id: 'D', weight: 4 }
  ],
  edges: [
    { source: 'A', target: 'B', weight: 5 },
    { source: 'A', target: 'C', weight: 3 },
    { source: 'B', target: 'C', weight: 4 },
    { source: 'C', target: 'D', weight: 2 }
  ]
};
export default data;
