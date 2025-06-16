# Project Apps Repository

This repository hosts a set of React applications built with Vite. The primary application at the moment is a **Project Management Simulation** demonstrating Friston's Active Inference principles applied to project planning.

## Current Application: Project Management Simulation

### Overview
- Located in `src/App.tsx` and bootstrapped by `src/index.jsx`.
- Uses minimal UI components defined in `App.tsx` along with the **Recharts** library for visualisations.
- Simulates project progress across several features (Data Ingestion, ML Model, UI, Integration, Security) while tracking **free energy** as a measure of uncertainty.
- The simulation progresses through predefined **actions** (steps). Each step updates feature progress, resource allocation, overall time estimates and free energy. Each action includes an accompanying explanation, recommended decision and an Active Inference insight.
- Charts display free energy over time, feature estimates with uncertainty, and feature progress versus allocated resources.

### State Structure
- `step`: current step in the simulation.
- `overallEstimate`: object with `mean` (weeks) and `uncertainty`.
- `features`: array of feature objects (`name`, `mean`, `uncertainty`, `progress`, `resourceAllocation`).
- `freeEnergy`: current free energy value; also logged to `freeEnergyHistory` for charting.
- `freeEnergyExplanation`: text describing how free energy changed.

### Controls
- **Next Step**: advance to the next action.
- **Auto-Play**: automatically iterate through actions at a selectable playback speed.
- **Reset**: return to initial state.
- Toggle display of Active Inference insights.

### Running and Testing
- `npm start` launches a development server on port `3000`.
- `npm test` runs the Vitest test suite (see `src/App.test.tsx`).
- Production builds output to the `docs` directory (`vite.config.js`).

## Future Applications
This repository is intended to host additional project-oriented apps beyond the current simulation. New apps should be placed alongside the existing code in the `src` directory or within their own subdirectories as needed. Update this document to describe each new application and how to run it.

