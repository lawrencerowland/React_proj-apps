import React from 'react';
import './App.css';

function PMSoftwareEvolution() {
  const [filterCategory, setFilterCategory] = React.useState('all');
  const [selectedNode, setSelectedNode] = React.useState(null);
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'traditional', name: 'Traditional PM' },
    { id: 'agile', name: 'Agile Tools' },
    { id: 'collaboration', name: 'Collaboration Tools' },
    { id: 'lowcode', name: 'Low-Code/No-Code' },
    { id: 'mobile', name: 'Mobile-First' },
    { id: 'ai', name: 'AI-Enhanced' }
  ];
  
  // Timeline eras
  const eras = [
    { id: 'era1', name: '2004-2008: Web Transition', color: 'bg-blue-100' },
    { id: 'era2', name: '2009-2013: Agile & Cloud', color: 'bg-green-100' },
    { id: 'era3', name: '2014-2018: Mobile & Integration', color: 'bg-yellow-100' },
    { id: 'era4', name: '2019-2023: Low-Code & AI', color: 'bg-purple-100' },
    { id: 'era5', name: '2024-2025: Full AI Integration', color: 'bg-red-100' }
  ];
  
  // Node data - represents significant PM software and trends
  const nodes = [
    // 2004-2008: Web Transition Era
    { id: 1, name: 'MS Project 2007', year: 2007, era: 'era1', category: 'traditional', description: 'Microsoft\'s flagship project management tool added enhanced visualization, multi-level undo, and better resource management.' },
    { id: 2, name: 'Basecamp', year: 2004, era: 'era1', category: 'collaboration', description: 'Pioneered web-based project management with a focus on simplicity and communication over complex gantt charts.' },
    { id: 3, name: 'JIRA (Early)', year: 2004, era: 'era1', category: 'agile', description: 'Initially focused on bug and issue tracking, began adding more project management capabilities.' },
    { id: 4, name: 'Web-Based Transition', year: 2006, era: 'era1', category: 'collaboration', description: 'Industry shift from desktop-only to web-accessible project management tools.' },
    { id: 5, name: 'Primavera P6', year: 2008, era: 'era1', category: 'traditional', description: 'Oracle\'s acquisition of Primavera brought enterprise-level PM to more industries with enhanced web capabilities.' },
    
    // 2009-2013: Agile & Cloud Era
    { id: 6, name: 'Asana Launch', year: 2011, era: 'era2', category: 'collaboration', description: 'Founded by Facebook co-founder, focused on team collaboration and work management with simple UI.' },
    { id: 7, name: 'Trello', year: 2011, era: 'era2', category: 'agile', description: 'Popularized the Kanban board approach to project management with a card-based visual interface.' },
    { id: 8, name: 'JIRA Agile', year: 2012, era: 'era2', category: 'agile', description: 'Atlassian consolidated GreenHopper into JIRA Agile, strengthening its position in agile development tools.' },
    { id: 9, name: 'Cloud Adoption', year: 2010, era: 'era2', category: 'collaboration', description: 'PM tools increasingly moved to SaaS models with enhanced collaboration features.' },
    { id: 10, name: 'Monday.com', year: 2012, era: 'era2', category: 'collaboration', description: 'Launched as dapulse, offering visual collaboration with colorful status indicators and customizable workflows.' },
    
    // 2014-2018: Mobile & Integration Era
    { id: 11, name: 'Slack Integration Era', year: 2014, era: 'era3', category: 'collaboration', description: 'Slack\'s growth drove PM tools to develop robust integrations, changing how teams communicated about projects.' },
    { id: 12, name: 'Mobile PM Apps', year: 2015, era: 'era3', category: 'mobile', description: 'Dedicated mobile apps became standard, with mobile-first design approaches taking hold.' },
    { id: 13, name: 'MS Project Online', year: 2016, era: 'era3', category: 'traditional', description: 'Microsoft shifted to cloud with enhanced Office 365 integration and improved collaboration features.' },
    { id: 14, name: 'Airtable', year: 2015, era: 'era3', category: 'lowcode', description: 'Combined spreadsheet simplicity with database power, allowing teams to build custom PM solutions.' },
    { id: 15, name: 'Notion', year: 2018, era: 'era3', category: 'collaboration', description: 'All-in-one workspace combining notes, tasks, wikis and databases, challenging traditional PM categories.' },
    
    // 2019-2023: Low-Code & AI Era
    { id: 16, name: 'Low-Code PM', year: 2019, era: 'era4', category: 'lowcode', description: 'Rise of customizable platforms allowing teams to build bespoke PM workflows without coding.' },
    { id: 17, name: 'ClickUp', year: 2020, era: 'era4', category: 'collaboration', description: 'All-in-one productivity platform with customizable views and extensive integration capabilities.' },
    { id: 18, name: 'AI Assistance', year: 2021, era: 'era4', category: 'ai', description: 'Introduction of AI for scheduling suggestions, risk identification, and resource allocation optimization.' },
    { id: 19, name: 'Remote Work Tools', year: 2020, era: 'era4', category: 'collaboration', description: 'Pandemic accelerated remote work features: enhanced video integration, digital whiteboards, async updates.' },
    { id: 20, name: 'Atlassian Cloud', year: 2021, era: 'era4', category: 'agile', description: 'Atlassian\'s aggressive cloud migration strategy changed how enterprises approached PM infrastructure.' },
    
    // 2024-2025: Full AI Integration Era
    { id: 21, name: 'AI Project Assistants', year: 2024, era: 'era5', category: 'ai', description: 'AI that can plan projects, identify risks, suggest resources, and even draft communication for stakeholders.' },
    { id: 22, name: 'Predictive Analytics', year: 2024, era: 'era5', category: 'ai', description: 'Advanced forecasting of project outcomes based on historical data and current project metrics.' },
    { id: 23, name: 'Natural Language PM', year: 2025, era: 'era5', category: 'ai', description: 'Conversation-based interfaces for managing projects through text or voice commands.' },
    { id: 24, name: 'Unified Work Platforms', year: 2025, era: 'era5', category: 'collaboration', description: 'Consolidation of project management, communication, documentation and development into single platforms.' }
  ];
  
  // Connections between nodes showing influence and evolution
  const connections = [
    { source: 1, target: 5, description: 'Enterprise PM evolution' },
    { source: 1, target: 13, description: 'MS Project evolution to cloud' },
    { source: 2, target: 4, description: 'Influenced web transition' },
    { source: 2, target: 6, description: 'Influenced collaboration-focused tools' },
    { source: 3, target: 8, description: 'JIRA evolution toward agile' },
    { source: 4, target: 9, description: 'Web-based to cloud transition' },
    { source: 6, target: 10, description: 'Influenced visual collaboration approach' },
    { source: 7, target: 8, description: 'Popularized kanban in agile tools' },
    { source: 7, target: 12, description: 'Visual approach influenced mobile design' },
    { source: 9, target: 11, description: 'Cloud enabled enhanced integrations' },
    { source: 10, target: 16, description: 'Customization influenced low-code approach' },
    { source: 11, target: 15, description: 'Integration capabilities influenced all-in-one workspaces' },
    { source: 12, target: 19, description: 'Mobile capabilities enabled remote work tooling' },
    { source: 14, target: 16, description: 'Pioneered low-code approach to PM' },
    { source: 15, target: 17, description: 'All-in-one approach influence' },
    { source: 16, target: 17, description: 'Low-code principles adopted in collaborative platforms' },
    { source: 18, target: 21, description: 'Early AI evolved into full project assistants' },
    { source: 18, target: 22, description: 'AI capabilities expanded to predictions' },
    { source: 19, target: 24, description: 'Remote needs drove unified platforms' },
    { source: 21, target: 23, description: 'AI assistants evolved to natural language interfaces' },
    { source: 8, target: 20, description: 'Evolution to cloud-first strategy' },
    { source: 13, target: 18, description: 'Traditional tools adding AI capabilities' },
    { source: 17, target: 24, description: 'Evolution toward unified work management' }
  ];
  
  // Filter nodes based on selected category
  const filteredNodes = filterCategory === 'all' 
    ? nodes 
    : nodes.filter(node => node.category === filterCategory);
  
  // Filter connections based on filtered nodes
  const filteredConnections = connections.filter(conn => 
    filteredNodes.some(node => node.id === conn.source) && 
    filteredNodes.some(node => node.id === conn.target)
  );
  
  // Handle node selection
  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };
  
  // Get node DOM ID
  const getNodeDomId = (nodeId) => `node-${nodeId}`;
  
  // Organize nodes by category
  const nodesByCategory = {};
  categories.slice(1).forEach(cat => {
    nodesByCategory[cat.id] = filteredNodes.filter(node => node.category === cat.id);
  });

  // Need a reference to look up node positions for the lines
  const nodeRefs = React.useRef({});

  // Helper to get node color
  const getNodeColor = (category) => {
    switch(category) {
      case 'traditional': return 'bg-blue-100 border-blue-400';
      case 'agile': return 'bg-green-100 border-green-400';
      case 'collaboration': return 'bg-purple-100 border-purple-400';
      case 'lowcode': return 'bg-yellow-100 border-yellow-400';
      case 'mobile': return 'bg-orange-100 border-orange-400';
      case 'ai': return 'bg-red-100 border-red-400';
      default: return 'bg-gray-100 border-gray-400';
    }
  };

  // Timeline calculations
  const yearSpan = 22; // 2004-2025
  const startYear = 2004;
  
  // Calculate position percentage from year
  const getYearPosition = (year) => {
    return ((year - startYear) / yearSpan) * 100;
  };

  // Component to draw connection lines
  const ConnectionLines = () => {
    // Line drawing logic happens after render
    React.useEffect(() => {
      const canvas = document.getElementById('connection-canvas');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const canvasRect = canvas.getBoundingClientRect();
      
      // Set canvas dimensions to match its display size
      canvas.width = canvasRect.width;
      canvas.height = canvasRect.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      filteredConnections.forEach(conn => {
        const sourceRef = nodeRefs.current[`node-${conn.source}`];
        const targetRef = nodeRefs.current[`node-${conn.target}`];
        
        if (!sourceRef || !targetRef) return;
        
        const sourceRect = sourceRef.getBoundingClientRect();
        const targetRect = targetRef.getBoundingClientRect();
        
        // Convert to canvas coordinates
        const sourceX = sourceRect.left + sourceRect.width/2 - canvasRect.left;
        const sourceY = sourceRect.top + sourceRect.height/2 - canvasRect.top;
        const targetX = targetRect.left + targetRect.width/2 - canvasRect.left;
        const targetY = targetRect.top + targetRect.height/2 - canvasRect.top;
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(sourceX, sourceY);
        
        // Curved line
        const midX = (sourceX + targetX) / 2;
        ctx.bezierCurveTo(
          midX, sourceY,
          midX, targetY,
          targetX, targetY
        );
        
        // Style based on connection type
        if (conn.description.includes('evolution')) {
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = '#888';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 3]);
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw arrow at target
        const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(
          targetX - 10 * Math.cos(angle - Math.PI/6),
          targetY - 10 * Math.sin(angle - Math.PI/6)
        );
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(
          targetX - 10 * Math.cos(angle + Math.PI/6),
          targetY - 10 * Math.sin(angle + Math.PI/6)
        );
        ctx.strokeStyle = conn.description.includes('evolution') ? '#000' : '#888';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }, [filteredConnections, nodeRefs.current]);
    
    return (
      <canvas 
        id="connection-canvas" 
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />
    );
  };

  return (
    <div className="pmse-container bg-white rounded-lg shadow-lg">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-center p-4 border-b">Project Management Software Evolution (2004-2025)</h1>
        
        {/* Controls */}
        <div className="px-4 py-2 border-b flex items-center bg-gray-50">
          <div className="mr-4">
            <span className="font-semibold">Filter:</span>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="ml-2 p-1 border rounded"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {categories.slice(1).map(cat => {
              let bgColor = '';
              switch(cat.id) {
                case 'traditional': bgColor = 'bg-blue-100 hover:bg-blue-200'; break;
                case 'agile': bgColor = 'bg-green-100 hover:bg-green-200'; break;
                case 'collaboration': bgColor = 'bg-purple-100 hover:bg-purple-200'; break;
                case 'lowcode': bgColor = 'bg-yellow-100 hover:bg-yellow-200'; break;
                case 'mobile': bgColor = 'bg-orange-100 hover:bg-orange-200'; break;
                case 'ai': bgColor = 'bg-red-100 hover:bg-red-200'; break;
              }
              
              return (
                <button 
                  key={cat.id}
                  className={`px-2 py-1 text-xs rounded border cursor-pointer
                    ${filterCategory === cat.id ? 'font-bold border-gray-500' : 'border-gray-300'} ${bgColor}`}
                  onClick={() => setFilterCategory(cat.id === filterCategory ? 'all' : cat.id)}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Timeline eras */}
        <div className="flex w-full border-b">
          {eras.map((era, index) => (
            <div key={era.id} className={`${era.color} p-2 text-center font-semibold border-r`} 
                style={{ width: `${index === 4 ? 10 : (index < 4 ? 22.5 : 0)}%` }}>
              {era.name}
            </div>
          ))}
        </div>
        
        {/* Year labels */}
        <div className="flex border-b text-xs bg-gray-50">
          {Array.from({ length: yearSpan + 1 }, (_, i) => (
            <div 
              key={i}
              className="text-center border-r py-1"
              style={{ width: `${100 / (yearSpan + 1)}%` }}
            >
              {startYear + i}
            </div>
          ))}
        </div>
        
        {/* Main visualization */}
        <div className="relative" style={{ height: "600px" }}>
          {/* Background grid */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${yearSpan + 1}, 1fr)` }}>
              {Array.from({ length: yearSpan + 1 }, (_, i) => (
                <div key={i} className="h-full border-r border-gray-200"></div>
              ))}
            </div>
          </div>
          
          {/* Canvas for drawing connections */}
          <ConnectionLines />
          
          {/* Category rows */}
          {categories.slice(1).map((category, catIndex) => (
            <div 
              key={category.id}
              className="absolute left-0 w-full border-b pb-8"
              style={{ top: `${catIndex * 100}px` }}
            >
              <div className="absolute left-0 px-2 py-1 bg-white border rounded shadow-sm z-20 font-semibold">
                {category.name}
              </div>
              
              {/* Nodes in this category */}
              {nodesByCategory[category.id].map(node => {
                const xPos = getYearPosition(node.year);
                const isSelected = selectedNode && selectedNode.id === node.id;
                
                return (
                  <div 
                    key={node.id}
                    id={getNodeDomId(node.id)}
                    ref={el => nodeRefs.current[getNodeDomId(node.id)] = el}
                    className={`absolute p-2 rounded-md border cursor-pointer z-20 
                      ${getNodeColor(node.category)} ${isSelected ? 'shadow-lg border-gray-500 border-2' : 'shadow'}`}
                    style={{ 
                      left: `${xPos}%`, 
                      top: '20px',
                      transform: 'translate(-50%, 0)',
                      maxWidth: '140px'
                    }}
                    onClick={() => handleNodeClick(node)}
                  >
                    <div className="text-sm font-bold mb-1">{node.name}</div>
                    <div className="text-xs text-gray-600">{node.year}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Details panel */}
        <div className="border-t p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              {selectedNode ? (
                <div>
                  <h3 className="text-lg font-bold">{selectedNode.name} ({selectedNode.year})</h3>
                  <div className="flex space-x-2 my-1">
                    {categories.find(c => c.id === selectedNode.category) && (
                      <span className={`px-2 py-1 text-xs rounded ${getNodeColor(selectedNode.category)}`}>
                        {categories.find(c => c.id === selectedNode.category).name}
                      </span>
                    )}
                    {eras.find(e => e.id === selectedNode.era) && (
                      <span className="px-2 py-1 text-xs rounded bg-gray-200">
                        {eras.find(e => e.id === selectedNode.era).name}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm">{selectedNode.description}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p className="font-semibold">Click on a node to view details</p>
                  <p className="mt-2 text-sm">This visualization shows the evolution of project management software from 2004-2025.</p>
                </div>
              )}
            </div>
            
            {/* Connections panel */}
            {selectedNode && (
              <div>
                <div className="rounded border bg-white p-3">
                  <h4 className="font-semibold border-b pb-1 mb-2">Influenced by:</h4>
                  <ul className="text-sm">
                    {connections.filter(conn => conn.target === selectedNode.id).map(conn => {
                      const sourceNode = nodes.find(n => n.id === conn.source);
                      return (
                        <li key={`in-${conn.source}`} className="mt-1 flex items-start">
                          <span className="mr-1">←</span> 
                          <button 
                            className="font-medium text-blue-600 hover:underline text-left"
                            onClick={() => handleNodeClick(sourceNode)}
                          >
                            {sourceNode.name} ({sourceNode.year})
                          </button>
                          <span className="ml-1 text-gray-600">: {conn.description}</span>
                        </li>
                      );
                    })}
                    {connections.filter(conn => conn.target === selectedNode.id).length === 0 && (
                      <li className="text-gray-500 italic">No incoming influences</li>
                    )}
                  </ul>
                  
                  <h4 className="font-semibold border-b pb-1 mt-4 mb-2">Influenced:</h4>
                  <ul className="text-sm">
                    {connections.filter(conn => conn.source === selectedNode.id).map(conn => {
                      const targetNode = nodes.find(n => n.id === conn.target);
                      return (
                        <li key={`out-${conn.target}`} className="mt-1 flex items-start">
                          <span className="mr-1">→</span>
                          <button 
                            className="font-medium text-blue-600 hover:underline text-left"
                            onClick={() => handleNodeClick(targetNode)}
                          >
                            {targetNode.name} ({targetNode.year})
                          </button>
                          <span className="ml-1 text-gray-600">: {conn.description}</span>
                        </li>
                      );
                    })}
                    {connections.filter(conn => conn.source === selectedNode.id).length === 0 && (
                      <li className="text-gray-500 italic">No outgoing influences</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center mt-4 text-sm gap-8 pt-3 border-t">
            <div>
              <div className="font-semibold mb-1">Connection types:</div>
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-black"></div>
                <span className="ml-2">Direct Evolution</span>
              </div>
              <div className="flex items-center mt-1">
                <div className="w-8 h-0.5 bg-gray-500 border-dashed border-t border-gray-500"></div>
                <span className="ml-2">Influence</span>
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-1">Categories:</div>
              <div className="flex flex-wrap gap-1">
                <div className="px-2 py-1 bg-blue-100 border-blue-400 border rounded text-xs">Traditional</div>
                <div className="px-2 py-1 bg-green-100 border-green-400 border rounded text-xs">Agile</div>
                <div className="px-2 py-1 bg-purple-100 border-purple-400 border rounded text-xs">Collaboration</div>
                <div className="px-2 py-1 bg-yellow-100 border-yellow-400 border rounded text-xs">Low-Code</div>
                <div className="px-2 py-1 bg-orange-100 border-orange-400 border rounded text-xs">Mobile</div>
                <div className="px-2 py-1 bg-red-100 border-red-400 border rounded text-xs">AI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PMSoftwareEvolution;
