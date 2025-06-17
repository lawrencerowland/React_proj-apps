# Project Apps

This repository hosts a collection of small React applications. The main example is a **Project Management Simulation** implementing Active Inference principles. A second app, **Project Dynamics Simulator**, explores feedback loops in projects. All apps are built with **Vite** and use [Recharts](https://recharts.org/) for charts.

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

## Project Structure

- `apps/<app-name>/` – individual applications. Each folder contains its own `src` and `index.html`.
- `src/common/` – shared utilities like `index.css`, `reportWebVitals.js` and test setup.
- `vite.config.js` – uses the `APP` environment variable to select which app to serve or build.
- `scripts/build-all.js` – helper script run by `npm run build` to build every app found in `apps/`.

## Deployment

A workflow in `.github/workflows/deploy.yml` builds the project and publishes the contents of the `docs` directory whenever changes land on the `main` branch. You can run the same build locally with `npm run build` and open `docs/index.html` to verify the generated app list.

## Learn More

- [Vite documentation](https://vitejs.dev/guide/)
- [Vitest documentation](https://vitest.dev/guide/)
- [React documentation](https://reactjs.org/)

## License

This project is licensed under the [MIT License](LICENSE).
