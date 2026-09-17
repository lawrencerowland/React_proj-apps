# Project Apps Repository

This repository hosts a growing collection of React applications built with Vite. The first app was a **Project Management Simulation** demonstrating Active Inference principles. A second app explores project dynamics. More apps may be added over time.

## Application: Project Management Simulation

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
- `npm start` launches a development server on port `3000`. Set `APP=<app-name>` to work on a different app.
- `npm test` runs the Vitest test suite (see `apps/project-management-simulation/src/App.test.tsx`).
- `npm run build` executes `scripts/build-all.js` which builds every app under `apps/` and outputs them to `docs/apps/<app-name>`.

## Application: Project Dynamics Simulator

This second app explores reinforcing and balancing feedback loops in a project environment.

- Located in `apps/project-dynamics-simulator/src/App.tsx` and bootstrapped by `apps/project-dynamics-simulator/src/index.jsx`.
- Visualises progress, scope, quality, morale and other metrics with **Recharts**.
- Toggle effects like technical debt, team learning and user feedback to see non-linear project behaviour.
To work on this app locally run `APP=project-dynamics-simulator npm start`.

## Future Applications
This repository is intended to host multiple project-oriented apps. Each app should live in `apps/<app-name>` with its own `src` folder and `index.html`. Shared utilities such as `index.css`, `reportWebVitals.js` and test setup files belong in `src/common` so they can be imported across apps. Application-specific components and styles should remain under their respective app directory. The root `index.html` displays a card index of all available apps using `app-index.csv` and screenshots stored in `pics/`.

- Provide its own CSS file (e.g., `src/App.css`) for basic styling.
- Include at least one test file under `src/` so `npm test` covers it.

Each row of `app-index.csv` includes a `#` column. The number in this column corresponds to an image file named `pics/<number>.png`. Screenshots **must** use this lowercase `.png` extension so the index page can load them automatically. Missing images fall back to `pics/blank.png`. Update this document to describe each new application and how to run it.

**Navigation**: Every app should offer a link back to the card index so users can return easily. Add `<a href="../../index.html">Back to app index</a>` somewhere in each application's `index.html`.

### IT Project Sequential Decisions
- Located in `apps/IT-project-seq-decisions/src/App.jsx` and bootstrapped by `apps/IT-project-seq-decisions/src/index.jsx`.
- Six-step tutorial for an illustrative IT project: narrative, model, uncertainty, policies and a proposed evaluation workflow. It does not execute a simulation or optimisation.
- Run locally with `APP=IT-project-seq-decisions npm start`.
### Portfolio State Machine
- Located in `apps/portfolio-state-machine/src/App.jsx` and bootstrapped by `apps/portfolio-state-machine/src/index.jsx`.
- Manages a portfolio of projects using a state machine and includes a simulation mode.
- Run locally with `APP=portfolio-state-machine npm start`.
### Stakeholder Analysis Dashboard
- Located in `apps/stakeholder-analysis-dashboard/src/App.jsx` and bootstrapped by `apps/stakeholder-analysis-dashboard/src/index.jsx`.
- Visualises stakeholder relationships, alignment and sentiment for different project roles.
- Run locally with `APP=stakeholder-analysis-dashboard npm start`.

### Stakeholder Network Graph
- Located in `apps/stakeholder-network-graph/src/App.jsx` and bootstrapped by `apps/stakeholder-network-graph/src/index.jsx`.
- Uses `react-force-graph-2d` to display interactive stakeholder networks.
- This dependency is installed at the repository root. Future apps that also need network-graph functionality should import from `'react-force-graph-2d'` and avoid creating per-app `package.json` files.
- Add any additional graph libraries only once in the root `package.json` and run `npm install` so all apps share them.
- Run locally with `APP=stakeholder-network-graph npm start`.

### Pareto Projects
- Located in `apps/pareto_projects/src/App.jsx` and bootstrapped by `apps/pareto_projects/src/index.jsx`.
- Encourages teams to push project value beyond the usual Pareto frontier.
- Run locally with `APP=pareto_projects npm start`.

### Market Timeline Explorer
- Located in `apps/market_timeline_explorer/src/app.jsx` and bootstrapped by `apps/market_timeline_explorer/src/index.jsx`.
- Charts potential market shifts for project-management services through AGI and ASI milestones.
- Run locally with `APP=market_timeline_explorer npm start`.

### Building Site Occupancy Simulation
- Located in `apps/building-site-occupancy-simulation/src/App.jsx` and bootstrapped by `apps/building-site-occupancy-simulation/src/index.jsx`.
- Provides a NetLogo model simulating construction site occupancy over a 24‑hour period.
- Run locally with `APP=building-site-occupancy-simulation npm start`.


### Weekly IT Project Game
- Located in `apps/Another-IT-project-simulation/`; pure decision rules are in `src/model.js`.
- Validates finite integer choices, staffing totals and affordable payroll before drawing weekly information. New hires work immediately; hiring costs apply once and all retained staff are paid.
- Ends on feature completion, the 12-week horizon or inability to fund another payroll. Quality and satisfaction remain separate bounded outcomes. Reset clears the run; a chart and table retain its weekly decisions and results while playing.
- The numbers and random distributions are illustrative. See `REPAIRS.md` for checks and scope.

### Tag Concurrence Explorer
- Maps the tags in this repository's `app-index.csv`; this is an app-catalogue projection, not a source-reading graph or detected communities.
- Maintains filtering, Grid/Concentric/Cose layouts, tag inspection and PNG export. Node size represents the number of apps carrying each tag.
- `node scripts/generate-tag-concurrence-graph.js` refreshes graph JSON and `tag_concurrence_metadata.json`, including the source checksum, app names and refresh time. The existing postbuild invokes it and copies both into ignored `docs/` output.
- Run all repository tests with `node node_modules/vitest/vitest.mjs run --root .`; the default Vite app root otherwise limits test discovery.
