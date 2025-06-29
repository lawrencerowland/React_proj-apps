import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, BarChart, Bar } from 'recharts';
import './App.css';

const CopulaRiskAnalysis = () => {
  const [correlationParam, setCorrelationParam] = useState(0.7);
  const [sampleSize, setSampleSize] = useState(500);
  const [riskData, setRiskData] = useState<any[]>([]);
  const [copulaData, setCopulaData] = useState<any[]>([]);
  const [extremeScenarioData, setExtremeScenarioData] = useState<any[]>([]);
  const [showExtremeScenario, setShowExtremeScenario] = useState(false);
  const [scenarioImpact, setScenarioImpact] = useState({ delay: 0, cost: 0 });
  const [currentView, setCurrentView] = useState('intro');

  // Generate gaussian copula samples
  const generateGaussianCopula = (correlation: number, size: number) => {
    // Create a covariance matrix for bivariate normal
    const covMatrix = [
      [1, correlation],
      [correlation, 1]
    ];
    
    // Generate multivariate normal data
    const mvNormalData: any[] = [];
    
    for (let i = 0; i < size; i++) {
      // Generate independent standard normal variables
      const z1 = gaussianRandom();
      const z2 = gaussianRandom();
      
      // Transform to correlated normal variables
      const x1 = z1;
      const x2 = correlation * z1 + Math.sqrt(1 - correlation * correlation) * z2;
      
      // Transform to uniform using the CDF of standard normal
      // Using the error function approximation for normal CDF
      const normalCDF = (x: number) => {
        // Implementation of normal CDF using error function
        return 0.5 * (1 + erf(x / Math.sqrt(2)));
      };
      
      // Error function approximation
      const erf = (x: number) => {
        // Constants
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;
        
        // Save the sign
        const sign = (x < 0) ? -1 : 1;
        x = Math.abs(x);
        
        // Approximation formula
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        
        return sign * y;
      };
      
      const u1 = normalCDF(x1);
      const u2 = normalCDF(x2);
      
      mvNormalData.push({u1, u2});
    }
    
    return mvNormalData;
  };
  
  // Standard normal random variable generator
  const gaussianRandom = () => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };
  
  // Transform uniform marginals to specific distributions for concrete project tasks
  const createRiskDistributions = (copulaData: any[]) => {
    const riskData = copulaData.map(point => {
      // Foundation Work Delay: Right-skewed distribution
      // Using quantile function approximation
      const mu_foundation = 2.0;
      const sigma_foundation = 0.8;
      const normalQuantile = (p: number) => {
        // Approximation of the inverse of the normal CDF (quantile function)
        if (p <= 0) return -5;
        if (p >= 1) return 5;
        
        let q, r;
        if (p < 0.5) {
          q = p;
          r = 1;
        } else {
          q = 1 - p;
          r = -1;
        }
        
        const y = Math.sqrt(-2 * Math.log(q));
        const a = 2.515517 + (0.802853 * y) + (0.010328 * y * y);
        const b = 1 + (1.432788 * y) + (0.189269 * y * y) + (0.001308 * y * y * y);
        
        return r * (y - (a / b));
      };
      
      const foundationDelay = Math.exp(mu_foundation + sigma_foundation * normalQuantile(point.u1));
      
      // Electrical Installation Delay: Using a different skewed distribution
      const shape = 1.5;
      const scale = 4;
      const electricalDelay = scale * Math.pow(point.u2, 1/shape);
      
      return {
        foundationDelay: Math.min(Math.round(foundationDelay * 10) / 10, 30),
        electricalDelay: Math.min(Math.round(electricalDelay * 10) / 10, 20),
        probability: 1/copulaData.length
      };
    });
    
    return riskData;
  };
  
  // Calculate project impact from risk scenarios
  const calculateImpact = (data: any[]) => {
    // Weighted average of delays considering their probability
    const avgFoundationDelay = data.reduce((sum, point) => {
      return sum + (point.foundationDelay * point.probability);
    }, 0);
    
    const avgElectricalDelay = data.reduce((sum, point) => {
      return sum + (point.electricalDelay * point.probability);
    }, 0);
    
    // Simplified project impact calculation
    const totalDelay = Math.max(avgFoundationDelay, avgElectricalDelay * 0.7);
    const totalCost = (avgFoundationDelay * 5000) + (avgElectricalDelay * 3000);
    
    return {
      delay: Math.round(totalDelay * 10) / 10,
      cost: Math.round(totalCost / 1000)
    };
  };
  
  // Generate extreme scenario by selecting worst percentile cases
  const generateExtremeScenario = (data: any[], percentile = 0.9) => {
    const sortedByFoundation = [...data].sort((a, b) => b.foundationDelay - a.foundationDelay);
    const sortedByElectrical = [...data].sort((a, b) => b.electricalDelay - a.electricalDelay);
    
    const cutoffIndex = Math.floor(data.length * (1 - percentile));
    
    const worstFoundation = sortedByFoundation.slice(0, cutoffIndex);
    const worstElectrical = sortedByElectrical.slice(0, cutoffIndex);
    
    const jointExtremeEvents: any[] = [];
    
    for (let i = 0; i < worstFoundation.length; i++) {
      for (let j = 0; j < worstElectrical.length; j++) {
        if (worstFoundation[i].foundationDelay === worstElectrical[j].foundationDelay &&
            worstFoundation[i].electricalDelay === worstElectrical[j].electricalDelay) {
          jointExtremeEvents.push(worstFoundation[i]);
          break;
        }
      }
    }
    
    if (jointExtremeEvents.length === 0) {
      const combined = [...worstFoundation.slice(0, 5), ...worstElectrical.slice(0, 5)];
      const uniqueCombined = combined.filter((item, index, self) => 
        index === self.findIndex(t => 
          t.foundationDelay === item.foundationDelay && t.electricalDelay === item.electricalDelay
        )
      );
      
      return uniqueCombined.map(event => ({
        ...event,
        probability: percentile / uniqueCombined.length
      }));
    }
    
    const totalProb = jointExtremeEvents.reduce((sum, event) => sum + event.probability, 0);
    
    return jointExtremeEvents.map(event => ({
      ...event,
      probability: event.probability / totalProb * percentile
    }));
  };
  
  useEffect(() => {
    const copula = generateGaussianCopula(correlationParam, sampleSize);
    setCopulaData(copula);
    
    const risks = createRiskDistributions(copula);
    setRiskData(risks);
    
    const extremeScenario = generateExtremeScenario(risks);
    setExtremeScenarioData(extremeScenario);
    
    const impact = calculateImpact(risks);
    setScenarioImpact(impact);
    
    setFoundationHistogram(getHistogramData(risks, d => d.foundationDelay, 10, 30));
    setElectricalHistogram(getHistogramData(risks, d => d.electricalDelay, 10, 20));
  }, [correlationParam, sampleSize]);
  
  useEffect(() => {
    if (showExtremeScenario) {
      const extremeImpact = calculateImpact(extremeScenarioData);
      setScenarioImpact(extremeImpact);
    } else {
      const normalImpact = calculateImpact(riskData);
      setScenarioImpact(normalImpact);
    }
  }, [showExtremeScenario, extremeScenarioData, riskData]);
  
  const handleCorrelationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCorrelationParam(parseFloat(e.target.value));
  };
  
  const handleExtremeScenarioToggle = () => {
    setShowExtremeScenario(!showExtremeScenario);
  };
  
  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };
  
  const [foundationHistogram, setFoundationHistogram] = useState<any[]>([]);
  const [electricalHistogram, setElectricalHistogram] = useState<any[]>([]);
  
  const getHistogramData = (data: any[], accessor: (d: any) => number, bins = 10, maxValue?: number) => {
    if (!data || data.length === 0) {
      return Array(bins).fill(null).map((_, i) => ({
        bin: `${i}-${i+1}`,
        binCenter: i + 0.5,
        count: 0
      }));
    }
    
    const values = data.map(accessor);
    const maxVal = maxValue || Math.max(...values);
    const binWidth = maxVal / bins;
    
    const histogramData = Array(bins).fill(null).map((_, i) => {
      const binStart = i * binWidth;
      const binEnd = (i + 1) * binWidth;
      const count = values.filter(v => v >= binStart && v < binEnd).length;
      
      return {
        bin: `${Math.round(binStart)}-${Math.round(binEnd)}`,
        binCenter: (binStart + binEnd) / 2,
        count: count / values.length
      };
    });
    
    return histogramData;
  };
  
  return (
    <div className="flex flex-col p-4 bg-gray-50 rounded-lg shadow-md">
      <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">Construction Project Risk Analysis with Copulas</h1>
        
        <div className="flex gap-4 mb-4 flex-wrap">
          <button
            className={`px-3 py-2 rounded-md ${currentView === 'intro' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleViewChange('intro')}
          >
            Introduction
          </button>
          <button
            className={`px-3 py-2 rounded-md ${currentView === 'copula' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleViewChange('copula')}
          >
            Copula Structure
          </button>
          <button
            className={`px-3 py-2 rounded-md ${currentView === 'marginals' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleViewChange('marginals')}
          >
            Task Delay Distributions
          </button>
          <button
            className={`px-3 py-2 rounded-md ${currentView === 'joint' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleViewChange('joint')}
          >
            Joint Delay Analysis
          </button>
          <button
            className={`px-3 py-2 rounded-md ${currentView === 'stress' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleViewChange('stress')}
          >
            Stress Testing
          </button>
        </div>
        
        {currentView === 'intro' && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Office Building Construction Project</h2>
            <p className="mb-2">
              We're analyzing a construction project with two key interrelated tasks:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li><strong>Foundation Work:</strong> Potential delays in days (affects multiple downstream tasks)</li>
              <li><strong>Electrical System Installation:</strong> Potential delays in days (dependent on foundation completion)</li>
            </ul>
            <p className="mb-3">
              These tasks have individual delay distributions, but they're also related. For example:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>Poor soil conditions can delay foundation work <strong>and</strong> make electrical conduit installation more difficult</li>
              <li>Labor shortages can affect both tasks simultaneously</li>
              <li>Material availability issues often impact both systems</li>
            </ul>
            <p className="mb-2">
              <strong>Why a copula approach helps:</strong> Copulas allow us to model both the individual risk behavior of each task and their mutual dependencies, showing when both tasks might be delayed simultaneously.
            </p>
          </div>
        )}
        
        {currentView === 'copula' && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">The Copula: Modeling Task Dependencies</h2>
            <p className="mb-3">
              A copula is a mathematical function that describes the dependence structure between tasks, separate from each task's individual delay distribution.
            </p>
            <p className="mb-3">
              <strong>In practical terms:</strong> A copula lets us answer questions like "If foundation work is delayed by 2 weeks, what's the probability that electrical installation will also be delayed?"
            </p>
            <p className="mb-2">
              The plot below shows a Gaussian copula with uniform margins. This represents the pure dependency structure between our two tasks before applying their specific delay distributions.
            </p>
            
            <div className="flex items-center mb-4">
              <span className="mr-2 font-medium">Correlation:</span>
              <input
                type="range"
                min="-0.95"
                max="0.95"
                step="0.05"
                value={correlationParam}
                onChange={handleCorrelationChange}
                className="w-64"
              />
              <span className="ml-2">{correlationParam.toFixed(2)}</span>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="u1" name="U1" domain={[0, 1]} label={{ value: 'Foundation Delay (Uniform Scale)', position: 'bottom' }} />
                  <YAxis type="number" dataKey="u2" name="U2" domain={[0, 1]} label={{ value: 'Electrical Delay (Uniform Scale)', angle: -90, position: 'left' }} />
                  <Tooltip 
                    formatter={(value) => [value.toFixed(2), '']}
                    labelFormatter={() => 'Uniform values'}
                  />
                  <Scatter name="Dependency Structure" data={copulaData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <p className="mt-3">
              <strong>What this means:</strong> With positive correlation ({correlationParam > 0 ? 'like we see here' : ''}), delays in foundation work tend to coincide with delays in electrical installation. Negative correlation would mean that when one task is delayed, the other tends to be on schedule.
            </p>
          </div>
        )}
        
        {currentView === 'marginals' && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Task Delay Distributions</h2>
            <p className="mb-3">
              Each task has its own delay distribution based on historical data and expert judgment:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Foundation Work Delays</h3>
                <p className="mb-2">Right-skewed distribution: Most foundation work completes with minor delays, but there's a 'long tail' of potential significant delays due to unforeseen ground conditions.</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={foundationHistogram} margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="binCenter" label={{ value: 'Delay (days)', position: 'bottom' }} />
                      <YAxis label={{ value: 'Probability', angle: -90, position: 'left' }} />
                      <Tooltip 
                        formatter={(value) => [(value * 100).toFixed(1) + '%', 'Probability']}
                        labelFormatter={(value) => `Delay: ~${Math.round(value)} days`}
                      />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Electrical Installation Delays</h3>
                <p className="mb-2">Another right-skewed distribution: Electrical work typically has fewer extreme delays, but can still face significant setbacks due to design changes and material issues.</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={electricalHistogram} margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="binCenter" label={{ value: 'Delay (days)', position: 'bottom' }} />
                      <YAxis label={{ value: 'Probability', angle: -90, position: 'left' }} />
                      <Tooltip 
                        formatter={(value) => [(value * 100).toFixed(1) + '%', 'Probability']}
                        labelFormatter={(value) => `Delay: ~${Math.round(value)} days`}
                      />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <p className="mt-3">
              <strong>Key insight:</strong> Looking at these distributions separately doesn't tell us how delays in one task might coincide with delays in the other. That's where copulas come in.
            </p>
          </div>
        )}
        
        {currentView === 'joint' && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Joint Delay Analysis</h2>
            <p className="mb-3">
              The copula transforms the uniform values into our actual task delay distributions, while preserving their dependency structure:
            </p>
            
            <div className="h-64 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="foundationDelay" name="Foundation Delay" label={{ value: 'Foundation Delay (days)', position: 'bottom' }} />
                  <YAxis type="number" dataKey="electricalDelay" name="Electrical Delay" label={{ value: 'Electrical Delay (days)', angle: -90, position: 'left' }} />
                  <ZAxis type="number" dataKey="probability" range={[20, 20]} />
                  <Tooltip 
                    formatter={(value) => [value.toFixed(1) + ' days', '']}
                    labelFormatter={(_, payload) => {
                      if (!payload || !payload[0]) return '';
                      return `Foundation: ${payload[0].payload.foundationDelay.toFixed(1)} days\nElectrical: ${payload[0].payload.electricalDelay.toFixed(1)} days`;
                    }}
                  />
                  <Scatter name="Delay Scenarios" data={riskData} fill="#ff7300" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <p className="mb-2">
              <strong>What project managers can learn:</strong> This joint distribution shows all possible combinations of delays in both tasks, revealing:
            </p>
            <ul className="list-disc pl-6">
              <li>Which delay combinations are most likely</li>
              <li>The probability of both tasks being delayed simultaneously</li>
              <li>How delays in foundation work tend to correlate with delays in electrical installation</li>
              <li>The presence of outliers that represent extreme risk scenarios</li>
            </ul>
            
            <p className="mt-3">
              Notice how the general pattern follows our correlation parameter ({correlationParam.toFixed(2)}), but the shape of each task's individual distribution also influences the overall picture.
            </p>
          </div>
        )}
        
        {currentView === 'stress' && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Stress Testing: What If Both Tasks Are Severely Delayed?</h2>
            <p className="mb-3">
              Copulas excel at identifying scenarios where multiple tasks face delays simultaneously - the most disruptive scenario for project timelines and budgets.
            </p>
            
            <div className="mb-4">
              <button
                className={`px-4 py-2 rounded-md ${showExtremeScenario ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                onClick={handleExtremeScenarioToggle}
              >
                {showExtremeScenario ? 'Hide Extreme Scenario' : 'Show Extreme Scenario (10% Worst Case)'}
              </button>
            </div>
            
            <div className="h-64 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="foundationDelay" name="Foundation Delay" label={{ value: 'Foundation Delay (days)', position: 'bottom' }} />
                  <YAxis type="number" dataKey="electricalDelay" name="Electrical Delay" label={{ value: 'Electrical Delay (days)', angle: -90, position: 'left' }} />
                  <ZAxis type="number" dataKey="probability" range={[20, 20]} />
                  <Tooltip 
                    formatter={(value) => [value.toFixed(1) + ' days', '']}
                    labelFormatter={(_, payload) => {
                      if (!payload || !payload[0]) return '';
                      return `Foundation: ${payload[0].payload.foundationDelay.toFixed(1)} days\nElectrical: ${payload[0].payload.electricalDelay.toFixed(1)} days`;
                    }}
                  />
                  <Scatter 
                    name="Delay Scenarios" 
                    data={showExtremeScenario ? extremeScenarioData : riskData} 
                    fill={showExtremeScenario ? '#d32f2f' : '#ff7300'} 
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-lg mb-3">
              <h3 className="text-lg font-medium mb-1">Project Impact Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Overall project delay: {scenarioImpact.delay} days</strong><br/>
                  {showExtremeScenario ? 
                    '(Based on extreme scenario - significantly longer than average case)' : 
                    '(Based on expected case scenarios)'}
                </div>
                <div>
                  <strong>Cost impact: ${scenarioImpact.cost}k</strong><br/>
                  {showExtremeScenario ? 
                    '(Based on extreme scenario - significantly higher than average case)' : 
                    '(Based on expected case scenarios)'}
                </div>
              </div>
            </div>
            
            <p className="mb-2">
              <strong>Actions for risk mitigation:</strong>
            </p>
            <ul className="list-disc pl-6">
              <li>Identify common causes that could delay both tasks (e.g., labor issues, weather events)</li>
              <li>Prepare targeted contingency plans for the specific scenario where both tasks face severe delays</li>
              <li>Consider resource reallocation strategies that can address simultaneous delays</li>
              <li>Determine appropriate financial and schedule buffers based on correlated risk assessments</li>
            </ul>
          </div>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Key Takeaways for Project Risk Managers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <h3 className="text-lg font-medium mb-1">Beyond Independent Analysis</h3>
            <p>
              Traditional risk analyses often treat task delays as independent events. Copulas reveal how task delays can cluster together due to common causes, creating compound impacts.
            </p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="text-lg font-medium mb-1">Targeted Contingency Planning</h3>
            <p>
              Instead of generic buffers, you can develop specific contingency plans for scenarios where multiple interdependent tasks face delays simultaneously.
            </p>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <h3 className="text-lg font-medium mb-1">Risk Communication</h3>
            <p>
              Copula analysis provides a clearer picture of project risk for stakeholder communication, showing not just individual task risks but how they might combine.
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <p>
            <strong>Mathematical note for data scientists:</strong> The Gaussian copula used here is just one of many possible copula families. Others like Clayton, Frank, or Gumbel copulas can better capture specific dependency patterns like stronger correlation in the tails (representing extreme event dependence).
          </p>
          <p className="mt-2 italic">
            Try adjusting the correlation parameter to see how different dependency structures between foundation work and electrical installation affect overall project risk profiles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopulaRiskAnalysis;
