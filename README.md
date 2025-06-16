# Project Management Simulation with Active Inference

This project is an interactive demo of how Active Inference principles can guide project management decisions. It is built with **React** and **Vite** and visualizes estimations, progress and resource allocation using [Recharts](https://recharts.org/).

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the development server**
   ```bash
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000). The page reloads automatically when files change.

3. **Run tests**
   ```bash
   npm test
   ```
   This launches [Vitest](https://vitest.dev/) in watch mode. Press `q` to quit the test runner.

4. **Create a production build**
   ```bash
   npm run build
   ```
   The optimized output is written to the `docs` folder. This folder is configured for deployment to GitHub Pages.

5. **Preview the production build locally**
   ```bash
   npm run preview
   ```

## Project Structure

- `src/App.tsx` – main simulation component with minimal UI helpers.
- `src/App.test.tsx` – example unit test using Vitest and React Testing Library.
- `public/` – static assets and `index.html` template.
- `vite.config.js` – Vite configuration. When `NODE_ENV` is `production`, the base path is set for GitHub Pages (`/React_proj-apps/`).

## Deployment

A workflow in `.github/workflows/deploy.yml` builds the project and publishes the contents of the `docs` directory whenever changes land on the `main` branch. You can run the same build locally with `npm run build` and open `docs/index.html` to verify the result.

## Learn More

- [Vite documentation](https://vitejs.dev/guide/)
- [Vitest documentation](https://vitest.dev/guide/)
- [React documentation](https://reactjs.org/)

## License

This project is licensed under the [MIT License](LICENSE).
