import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

export default function App() {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const lowerParetoData = Array.from({ length: 100 }, (_, i) => 100 - Math.pow(i + 1, 0.5) * 10);
  const higherParetoData = lowerParetoData.map(value => value + 20); // Higher Pareto curve is shifted up

  const dataLower = {
    labels: Array.from({ length: 100 }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Pareto Curve',
        data: lowerParetoData,
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        fill: true,
      },
    ],
  };

  const dataHigher = {
    labels: Array.from({ length: 100 }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Higher Pareto Curve',
        data: higherParetoData,
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        fill: true,
      },
      {
        label: 'Solution Point',
        data: Array.from({ length: 100 }, (_, i) => (i === selectedPoint ? higherParetoData[selectedPoint] : null)),
        borderColor: 'red',
        backgroundColor: 'red',
        pointBackgroundColor: 'red',
        pointRadius: 5,
        fill: false,
      },
      {
        label: 'Selected Point',
        data: Array.from({ length: 100 }, (_, i) => (i === selectedPoint ? lowerParetoData[selectedPoint] : null)),
        borderColor: 'red',
        backgroundColor: 'red',
        pointBackgroundColor: 'red',
        pointRadius: 5,
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Apparent Progress',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Real Progress',
        },
      },
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const { index } = elements[0];
        setSelectedPoint(index);
      }
    },
  };

  const handleShowSolution = () => {
    setShowSolution(true);
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  const renderOrthogonalVector = () => {
    if (showSolution && selectedPoint !== null) {
      const startPoint = { x: selectedPoint + 1, y: lowerParetoData[selectedPoint] };
      const endPoint = { x: selectedPoint + 1, y: higherParetoData[selectedPoint] };

      return (
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
          <line
            x1={`${(startPoint.x / 100) * 100}%`}
            y1={`${100 - startPoint.y}%`} // Adjusting for svg coordinate system
            x2={`${(endPoint.x / 100) * 100}%`}
            y2={`${100 - endPoint.y}%`} // Adjusting for svg coordinate system
            stroke="red"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <defs>
            <marker
              id="arrow"
              markerWidth="10"
              markerHeight="10"
              refX="0"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="#f00" />
            </marker>
          </defs>
        </svg>
      );
    }
    return null;
  };

  return (
    <main>
      <h1>Really Winning on Projects</h1>
      <button
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginBottom: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={() => alert('This exercise will show you how to achieve real results in your projects. Click on a point to select your project strategy.')}
      >
        Instructions
      </button>
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        {!showSolution ? (
          <Line data={dataLower} options={options} />
        ) : (
          <>
            <Line data={dataHigher} options={options} />
            {renderOrthogonalVector()}
          </>
        )}
      </div>
      <p>What's your project strategy?</p>
      {selectedPoint !== null && !showSolution && (
        <div>
          <p>Selected Point: {selectedPoint + 1}</p>
          <button
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={handleShowSolution}
          >
            See Solution
          </button>
        </div>
      )}
      {showSolution && !showExplanation && (
        <div>
          <button
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              marginTop: '20px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={handleShowExplanation}
          >
            Explanation
          </button>
        </div>
      )}
      {showExplanation && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
            Don't just trade off between apparent progress and real progress. Push the envelope and achieve real results. By moving to a higher
            Pareto curve, you can achieve significant improvements that not only yield real progress but also enhance apparent progress as a side
            effect.
          </p>
        </div>
      )}
    </main>
  );
}
