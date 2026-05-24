import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <p className="eyebrow">VYBE Store</p>
        <p className="footer-copy">
          Designer objects, apparel, and archive fragments shaped in a dark fantasy language.
        </p>
      </div>
      <div className="footer-links">
        <Link to="/project" className="footer-project-link">Project</Link>
        <Link to="/catalog">Catalog</Link>
        <Link to="/collectibles">Collectibles</Link>
        <Link to="/artworks">Artworks</Link>
        <Link to="/about">About</Link>
      </div>
    </footer>
  );
}
