import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <section className="not-found-card fantasy-card">
        <p className="section-label">Unknown route</p>
        <h1>404 — Lost in the Night</h1>
        <p>
          This path leads beyond the VYBE archive. Return to the main hall and continue the ritual from there.
        </p>
        <Link className="relic-button" to="/">Return Home</Link>
      </section>
    </main>
  );
}
