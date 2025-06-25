import React, { useState, useEffect } from 'react';

const ProjectManagement = () => {
  const [state, setState] = useState({
    week: 0,
    developers: 5,
    budget: 100000,
    progress: 0,
    quality: 80,
    customerSatisfaction: 70,
  });

  const [decision, setDecision] = useState({
    hireDevelopers: 0,
    allocateToBugs: 2,
    allocateToNewFeatures: 3,
  });

  const [exogenousInfo, setExogenousInfo] = useState(null);

  const makeDecision = () => {
    // Decision is now made by the user through UI controls
  };

  const generateExogenousInfo = () => {
    const newInfo = {
      newBugs: Math.floor(Math.random() * 10),
      marketDemand: Math.random() > 0.7 ? 'Increased' : Math.random() > 0.4 ? 'Stable' : 'Decreased',
      competitorUpdate: Math.random() > 0.8 ? 'Major Release' : 'No Significant Update',
    };
    setExogenousInfo(newInfo);
  };

  const updateState = () => {
    if (exogenousInfo) {
      setState(prevState => {
        const newDevelopers = prevState.developers + decision.hireDevelopers;
        const newBudget = prevState.budget - (decision.hireDevelopers * 10000) - (newDevelopers * 2000);
        const newProgress = prevState.progress + decision.allocateToNewFeatures * 3;
        const newQuality = Math.min(100, prevState.quality + decision.allocateToBugs * 2 - exogenousInfo.newBugs);
        const newCustomerSatisfaction = Math.min(100, Math.max(0, prevState.customerSatisfaction + 
          (newProgress - prevState.progress) / 2 + 
          (newQuality - prevState.quality) / 2 +
          (exogenousInfo.marketDemand === 'Increased' ? 5 : exogenousInfo.marketDemand === 'Decreased' ? -5 : 0) +
          (exogenousInfo.competitorUpdate === 'Major Release' ? -10 : 0)
        ));

        return {
          week: prevState.week + 1,
          developers: newDevelopers,
          budget: newBudget,
          progress: newProgress,
          quality: newQuality,
          customerSatisfaction: newCustomerSatisfaction,
        };
      });
    }
  };

  useEffect(() => {
    updateState();
  }, [exogenousInfo]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Project Management Simulation</h1>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Current State</h2>
        <p>Week: {state.week}</p>
        <p>Developers: {state.developers}</p>
        <p>Budget: ${state.budget}</p>
        <p>Progress: {state.progress}%</p>
        <p>Quality: {state.quality}%</p>
        <p>Customer Satisfaction: {state.customerSatisfaction}%</p>
      </div>

      <div className="mb-4 p-4 bg-blue-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Make Decision</h2>
        <div className="mb-2">
          <label className="mr-2">Hire Developers:</label>
          <input 
            type="number" 
            min="0" 
            max="5" 
            value={decision.hireDevelopers} 
            onChange={(e) => setDecision({...decision, hireDevelopers: parseInt(e.target.value)})}
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="mb-2">
          <label className="mr-2">Allocate to Bug Fixing:</label>
          <input 
            type="number" 
            min="0" 
            max={state.developers} 
            value={decision.allocateToBugs} 
            onChange={(e) => setDecision({...decision, allocateToBugs: parseInt(e.target.value)})}
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="mb-2">
          <label className="mr-2">Allocate to New Features:</label>
          <input 
            type="number" 
            min="0" 
            max={state.developers} 
            value={decision.allocateToNewFeatures} 
            onChange={(e) => setDecision({...decision, allocateToNewFeatures: parseInt(e.target.value)})}
            className="border rounded px-2 py-1"
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Note: Total allocated developers should not exceed {state.developers}
        </p>
      </div>

      <div className="mb-4">
        <button 
          onClick={generateExogenousInfo} 
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Advance to Next Week
        </button>
      </div>

      {exogenousInfo && (
        <div className="mb-4 p-4 bg-green-100 rounded">
          <h2 className="text-xl font-semibold mb-2">Weekly Update</h2>
          <p>New Bugs Discovered: {exogenousInfo.newBugs}</p>
          <p>Market Demand: {exogenousInfo.marketDemand}</p>
          <p>Competitor Activity: {exogenousInfo.competitorUpdate}</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Project Manager's Guide</h2>
        <ul className="list-disc pl-5">
          <li>Balance your resources between hiring, bug fixing, and new feature development.</li>
          <li>Monitor your budget closely - hiring and maintaining developers is expensive.</li>
          <li>Keep an eye on quality - too many bugs will decrease customer satisfaction.</li>
          <li>Progress is important, but don't neglect quality for speed.</li>
          <li>Be prepared to adjust your strategy based on market demand and competitor activities.</li>
          <li>Remember, this is a long-term game - short-term setbacks can be overcome with good management.</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectManagement;