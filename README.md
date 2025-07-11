# Project Apps

This repository hosts a collection of small React applications. The main example is a **Project Management Simulation** implementing Active Inference principles. A second app, **Project Dynamics Simulator**, explores feedback loops in projects. A third app, **IT Project Sequential Decisions**, demonstrates sequential decision making for IT projects. A fourth app, **Portfolio State Machine**, models project portfolios using a state machine. A fifth app, **Stakeholder Analysis Dashboard**, visualises stakeholder perspectives. A sixth app, **Stakeholder Network Graph**, displays stakeholder relationships as an interactive graph. A seventh app, **Pareto Projects**, examines pushing project value beyond the Pareto frontier. An eighth app, **Market Timeline Explorer**, charts potential market dynamics within the project-management services industry. A ninth app, **Another IT Project Simulation**, offers a training-style variant of sequential decision making. A tenth app, **Decision Path Guide**, uses an ontology-based questionnaire. An eleventh app, **Capabilities Wiring Diagram**, visualises AI model inputs, reasoning stages and output formats. A twelfth app, **Copula Risk Analysis**, models correlated task delays using copulas. A thirteenth app, **Scope Benefits Tree**, visualises how project scope outputs lead to benefits for the East West Rail upgrade. A fourteenth app, **Project Controls Knowledge Graph**, shows links between project management and project controls concepts. A fifteenth app, **PM Software Evolution**, charts how project management software has evolved over the last 20 years. All apps are built with **Vite** and use [Recharts](https://recharts.org/) for charts.
## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the development server**
   ```bash
   npm start
   ```
   By default this serves the Project Management Simulation at [http://localhost:3000](http://localhost:3000).
   To work on the Project Dynamics Simulator run:
   ```bash
  APP=project-dynamics-simulator npm start
  ```
  To work on the IT Project Sequential Decisions app run:
  ```bash
  APP=IT-project-seq-decisions npm start
  ```
  To work on the Portfolio State Machine app run:
  ```bash
  APP=portfolio-state-machine npm start
  ```
  To work on the Stakeholder Analysis Dashboard app run:
  ```bash
  APP=stakeholder-analysis-dashboard npm start
  ```
  To work on the Stakeholder Network Graph app run:
  ```bash
  APP=stakeholder-network-graph npm start
  ```
  To work on the Pareto Projects app run:
  ```bash
  APP=pareto_projects npm start
  ```
  To work on the Market Timeline Explorer app run:
  ```bash
  APP=market_timeline_explorer npm start
  ```
  To work on the Another IT Project Simulation app run:
  ```bash
  APP=Another-IT-project-simulation npm start
  ```
  To work on the Decision Path Guide app run:
  ```bash
  APP=decision-path-guide npm start
  ```
  To work on the Capabilities Wiring Diagram app run:
  ```bash
  APP=capabilities-wiring-diag npm start
  ```
  To work on the Copula Risk Analysis app run:
  ```bash
  APP=copula-risk-analysis npm start
  ```
  To work on the Data Maturity Combined app run:
  ```bash
  APP=data-maturity-combined npm start
  ```
  To work on the Olaf Delivery Dashboard app run:
  ```bash
  APP=olaf-delivery-dashboard npm start
  ```

  The page reloads automatically when files change.

3. **Run tests**
   ```bash
   npm test
   ```
   This launches [Vitest](https://vitest.dev/) in watch mode. Press `q` to quit the test runner.

4. **Create a production build**
   ```bash
   npm run build
   ```
   The build script automatically iterates over every folder in `apps/` and writes the optimized output under `docs/apps/<app-name>`.
   The folder is configured for deployment to GitHub Pages.

5. **Preview the production build locally**
   ```bash
   npm run preview
   ```
   Pass `APP=<app-name>` to preview a specific build, e.g.
   ```bash
  APP=project-dynamics-simulator npm run preview
  ```
  Preview the IT Project Sequential Decisions app with:
  ```bash
  APP=IT-project-seq-decisions npm run preview
  ```
  Preview the Portfolio State Machine app with:
  ```bash
  APP=portfolio-state-machine npm run preview
  ```
  Preview the Stakeholder Analysis Dashboard app with:
  ```bash
  APP=stakeholder-analysis-dashboard npm run preview
  ```
  Preview the Stakeholder Network Graph app with:
  ```bash
  APP=stakeholder-network-graph npm run preview
  ```
  Preview the Pareto Projects app with:
  ```bash
  APP=pareto_projects npm run preview
  ```
  Preview the Market Timeline Explorer app with:
  ```bash
  APP=market_timeline_explorer npm run preview
  ```
  Preview the Another IT Project Simulation app with:
  ```bash
  APP=Another-IT-project-simulation npm run preview
  ```
  Preview the Decision Path Guide app with:
  ```bash
  APP=decision-path-guide npm run preview
  ```
  Preview the Capabilities Wiring Diagram app with:
  ```bash
  APP=capabilities-wiring-diag npm run preview
  ```
  Preview the Copula Risk Analysis app with:
  ```bash
  APP=copula-risk-analysis npm run preview
  ```
  Preview the Data Maturity Combined app with:
  ```bash
  APP=data-maturity-combined npm run preview
  ```
  Preview the Olaf Delivery Dashboard app with:
  ```bash
  APP=olaf-delivery-dashboard npm run preview
  ```


## Project Structure

- `apps/<app-name>/` – individual applications. Each folder contains its own `src` and `index.html`.
- `src/common/` – shared utilities like `index.css`, `reportWebVitals.js` and test setup.
- `vite.config.js` – uses the `APP` environment variable to select which app to serve or build.
- `scripts/build-all.js` – helper script run by `npm run build` to build every app found in `apps/`.

## Deployment

A workflow in `.github/workflows/deploy.yml` builds the project and publishes the contents of the `docs` directory whenever changes land on the `main` branch. You can run the same build locally with `npm run build` and open `docs/index.html` to verify the generated app list.

## To add a new React app (from a TSX/JSX file) into the repository:

1. Create the new app folder

2. Place it under apps/<app-name>/ with its own src directory and index.html. Shared utilities live in src/common/ so import those in your new src/index.jsx or tsx. Use the snippet below as a starting point for your `index.html` so the app mounts correctly and links back to the index.

```html
<!-- index.html snippet -->
<div id="root"></div>
<p><a href="../../index.html">Back to app index</a></p>
```

3. Include a link back to the app index (<a href="../../index.html">Back to app index</a>) in the HTML as shown above and noted in AGENTS.md.

4. Add a screenshot and CSV entry

5. Pick the next numeric ID and save a screenshot under `pics/` using either
   a `.png` or `.webp` extension. Case does not matter—the build process
   normalises filenames and falls back to `pics/blank.png` if no image is found.

6. Add a corresponding row to app-index.csv, filling out the name, description, and other fields. AGENTS.md explains how each CSV # value matches a screenshot. 

7. Run and test locally

-  Serve the new app with APP=<app-name> npm start. This is how you switch between apps during development. 
-   Execute npm test to run Vitest-based tests. 

8. Build all apps

- When ready, run npm run build. The scripts/build-all.js script automatically iterates over every folder in apps/ and outputs optimized builds to docs/apps/<app-name>. 

- Preview a specific build (optional). Use APP=<app-name> npm run preview to check an individual build locally. 

Following these steps will integrate your new TSX/JSX app alongside the existing ones, update the index page, and ensure the build process handles it automatically.
## Learn More

- [Vite documentation](https://vitejs.dev/guide/)
- [Vitest documentation](https://vitest.dev/guide/)
- [React documentation](https://reactjs.org/)

## License

This project is licensed under the [MIT License](LICENSE).
