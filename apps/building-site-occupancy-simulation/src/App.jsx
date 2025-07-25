import React from 'react';
import '../../../src/common/index.css';
import './App.css';

// Obtain the URL for the NetLogo model.  Vite will handle copying the
// referenced file into the build output and replacing this with the
// final path at runtime.  The model file lives one directory above
// `src` so we construct a URL relative to this module.
const modelURL = new URL('../building_site_pool_gym_model.nlogo', import.meta.url).href;

/**
 * Application component rendering a description of the NetLogo model,
 * download instructions and a link to NetLogo Web.  Users can read
 * about the simulation and click the provided link to download the
 * `.nlogo` file.  To run the model in a browser, visit the NetLogo
 * Web site and upload the downloaded file via the "Upload a Model"
 * button.
 */
const App = () => {
  return (
    <main className="app-container">
      <h1>Building&nbsp;Site Occupancy Simulation</h1>
      <p>
        This simple React application accompanies a NetLogo model that
        simulates the occupancy and usage of a small construction site
        over a 24‑hour period.  The site is halfway through building an
        indoor swimming pool and adjacent gym; workers arrive at dawn,
        take a lunch break, resume work on the pool or gym in the
        afternoon and depart in the evening.  Deliveries enter the
        site sporadically and a night guard patrols the walkways after
        the crew leaves.  Each tick in the simulation represents one
        minute of real time.
      </p>
      <p>
        To explore the model yourself, download the NetLogo file
        below and open it in your favourite NetLogo environment.  If
        you do not have NetLogo installed locally, you can run the
        model entirely in your browser by visiting{' '}
        <a href="https://www.netlogoweb.org/" target="_blank" rel="noopener noreferrer">
          NetLogo Web
        </a>{' '}and using the “Upload a Model” button to select the
        downloaded file.  Once loaded, press the <em>setup</em> and
        <em>go</em> buttons to start the simulation.
      </p>
      <section className="download-section">
        <h2>Download NetLogo Model</h2>
        <p>
          The model file contains the complete NetLogo code along with
          comments explaining the design.  Right‑click the link below and
          choose <em>Save link as…</em> if your browser does not
          automatically download it.
        </p>
        <a className="download-link" href={modelURL} download>
          building_site_pool_gym_model.nlogo
        </a>
      </section>
      <section className="schedule-section">
        <h2>Daily Schedule Overview</h2>
        <ul>
          <li><strong>06:00</strong> — Site opens; workers arrive and head to their assigned zones.</li>
          <li><strong>12:00</strong> — Lunch break; all workers gather in the break area.</li>
          <li><strong>13:00</strong> — Work resumes on the pool and gym.</li>
          <li><strong>17:00</strong> — End of shift; workers leave the site.</li>
          <li><strong>21:00</strong> — A security guard patrols the walkways until dawn.</li>
        </ul>
      </section>
      <section className="notes-section">
        <h2>Model Notes</h2>
        <p>
          The NetLogo program divides the virtual site into coloured
          regions representing the pool, gym, break area, office and
          walkways.  Workers are modelled as agents with a <em>role</em>
          corresponding to their area (pool or gym) and a
          <em>state</em> indicating whether they are working, on
          break, leaving or patrolling.  Vehicles delivering
          materials spawn at the entrance, travel to the appropriate
          zone, wait for a time and then depart.  Occupancy
          statistics are logged each minute to enable plotting of
          zone utilisation over the course of the day.
        </p>
      </section>
    </main>
  );
};

export default App;