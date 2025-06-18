import React, { useState } from 'react'
import './App.css'
import { ProjectState, Project, Portfolio } from './portfolioLogic'
import ProjectList from './components/ProjectList'
import AddProject from './components/AddProject'
import TransitionProject from './components/TransitionProject'
import PortfolioOverview from './components/PortfolioOverview'
import SimulationResults from './components/SimulationResults'
import Instructions from './components/Instructions'
import StateMachineDiagram from './components/StateMachineDiagram'

export default function App() {
  const [portfolio, setPortfolio] = useState(new Portfolio())
  const [simulationResults, setSimulationResults] = useState(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const [showStateMachine, setShowStateMachine] = useState(false)

  const addProject = (name) => {
    const newPortfolio = new Portfolio([...portfolio.projects])
    newPortfolio.addProject(new Project(name))
    setPortfolio(newPortfolio)
  }

  const transitionProject = (projectName, newState) => {
    const newPortfolio = new Portfolio([...portfolio.projects])
    newPortfolio.transitionProject(projectName, newState, "User action")
    setPortfolio(newPortfolio)
  }

  const runSimulation = () => {
    const results = portfolio.simulatePortfolio(100)
    setSimulationResults(results)
  }

  return (
    <main className="app-container">
      <h1>Portfolio Management App</h1>
      <div className="button-group">
        <button onClick={() => setShowInstructions(!showInstructions)}>
          {showInstructions ? 'Hide' : 'Show'} Instructions
        </button>
        <button onClick={() => setShowStateMachine(!showStateMachine)}>
          {showStateMachine ? 'Hide' : 'Show'} State Machine Diagram
        </button>
      </div>
      {showInstructions && <Instructions />}
      {showStateMachine && <StateMachineDiagram />}
      <div className="content-wrapper">
        <div className="left-panel">
          <ProjectList projects={portfolio.projects} />
          <AddProject onAddProject={addProject} />
        </div>
        <div className="right-panel">
          <TransitionProject 
            projects={portfolio.projects} 
            onTransition={transitionProject} 
          />
          <PortfolioOverview portfolio={portfolio} />
          <button onClick={runSimulation} className="simulate-button">Run Simulation</button>
          {simulationResults && <SimulationResults results={simulationResults} />}
        </div>
      </div>
    </main>
  )
}