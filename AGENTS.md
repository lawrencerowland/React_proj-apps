# Project Apps Repository

This repository hosts a set of React applications built with Vite. The primary application at the moment is a **Project Management Simulation** demonstrating Friston's Active Inference principles applied to project planning.

## Current Application: Project Management Simulation

### Overview
- Located in `apps/project-management-simulation/src/App.tsx` and bootstrapped by `apps/project-management-simulation/src/index.jsx`.
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
- `npm test` runs the Vitest test suite (see `apps/project-management-simulation/src/App.test.tsx`).
- Production builds output to the `docs/apps/project-management-simulation` directory (`vite.config.js`).

## Future Applications
This repository is intended to host multiple project-oriented apps. Each app should live in `apps/<app-name>` with its own `src` folder and `index.html`. Shared utilities such as `index.css`, `reportWebVitals.js` and test setup files belong in `src/common` so they can be imported across apps. Application-specific components and styles should remain under their respective app directory. The root `index.html` displays a card index of all available apps using `app-index.csv` and images in `pics/`. Update this document to describe each new application and how to run it.

