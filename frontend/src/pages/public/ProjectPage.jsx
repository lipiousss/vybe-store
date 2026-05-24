import React from 'react';
import { Link } from 'react-router-dom';

const stackItems = [
  'React + Vite',
  'JavaScript',
  'Zustand',
  'Framer Motion',
  'Node.js + Express',
  'PostgreSQL',
  'Prisma ORM',
  'Docker Compose',
  'pgAdmin',
];

const projectNotes = [
  {
    title: 'Concept',
    text: 'VYBE Store is a diploma project about a dark fantasy online shop for designer apparel, archive objects, art fragments, and limited collectibles.',
  },
  {
    title: 'Visual Direction',
    text: 'The interface mixes boutique commerce with old-web archive pages: dark surfaces, worn gold borders, cold blue glow, compact panels, and artifact-like product cards.',
  },
  {
    title: 'Current Stage',
    text: 'The project already has Docker infrastructure, PostgreSQL, Prisma schema and seed data, backend API for catalog entities, and a frontend foundation with public pages.',
  },
  {
    title: 'Next Work',
    text: 'Upcoming stages include cart, orders, admin panel, inventory tools, file uploads, and richer artwork/content management.',
  },
];

export default function ProjectPage() {
  return (
    <main className="project-page">
      <header className="project-topbar">
        <Link to="/" className="project-title-link">VYBE://PROJECT</Link>
        <nav aria-label="Project navigation">
          <a href="#overview">Overview</a>
          <a href="#stack">Stack</a>
          <a href="#roadmap">Roadmap</a>
        </nav>
      </header>

      <div className="project-layout">
        <aside className="project-sidebar">
          <section className="project-widget">
            <h2>[Menu]</h2>
            <Link to="/">Home</Link>
            <Link to="/catalog">Catalog</Link>
            <Link to="/collectibles">Collectibles</Link>
            <Link to="/artworks">Artworks</Link>
            <Link to="/about">About</Link>
          </section>

          <section className="project-widget">
            <h2>[Status]</h2>
            <p>Mode: diploma build</p>
            <p>Theme: dark fantasy commerce</p>
            <p>Runtime: Docker Compose</p>
          </section>

          <section className="project-widget">
            <h2>[Milestones]</h2>
            <ol>
              <li>Infrastructure</li>
              <li>Database seed</li>
              <li>Backend API</li>
              <li>Frontend foundation</li>
              <li>Commerce flow</li>
            </ol>
          </section>
        </aside>

        <section className="project-content">
          <div className="project-content-frame">
            <section className="project-hero-panel" id="overview">
              <p className="project-terminal-line">visitor@vybe-store:~$ open project_manifest.txt</p>
              <h1>About The Project</h1>
              <p>
                This page is a project archive for VYBE Store: the idea, stack, structure,
                visual language, and planned implementation path in one place.
              </p>
            </section>

            <section className="project-section-grid">
              {projectNotes.map((note) => (
                <article className="project-info-box" key={note.title}>
                  <h2>{note.title}</h2>
                  <p>{note.text}</p>
                </article>
              ))}
            </section>

            <section className="project-panel" id="stack">
              <div className="project-section-heading">
                <span>01</span>
                <h2>Stack</h2>
              </div>
              <div className="project-stack-grid">
                {stackItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </section>

            <section className="project-panel project-split" id="roadmap">
              <div>
                <div className="project-section-heading">
                  <span>02</span>
                  <h2>Architecture</h2>
                </div>
                <p>
                  The frontend consumes public backend endpoints, Zustand stores hold UI and
                  entity state, Express routes expose API modules, and Prisma maps the store
                  domain to PostgreSQL.
                </p>
              </div>
              <div className="project-terminal">
                <p>backend/src</p>
                <p>frontend/src</p>
                <p>backend/prisma/schema.prisma</p>
                <p>docker-compose.yml</p>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
