import React from 'react';
import { Link } from 'react-router-dom';

const columns = [
  ['Shop', [['Catalog', '/catalog'], ['Collectibles', '/collectibles'], ['Cart', '/cart']]],
  ['Collections', [['Collections', '/collections'], ['Artworks', '/artworks'], ['Project', '/project']]],
  ['Company', [['About VYBE', '/about'], ['Visual Archive', '/artworks'], ['Project Notes', '/project']]],
  ['Support', [['Profile', '/profile'], ['Orders', '/profile/orders'], ['Settings', '/profile/settings']]],
];

export default function Footer() {
  return (
    <footer className="site-footer reference-footer">
      <div className="footer-brand">
        <Link className="logo-mark" to="/">
          <span className="logo-sigil">V</span>
          <span>VYBE</span>
        </Link>
        <p className="footer-copy">
          Designer objects, apparel, and archive fragments shaped in a dark fantasy language.
        </p>
      </div>

      <div className="footer-columns">
        {columns.map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <h3>{title}</h3>
            {links.map(([label, to]) => (
              <Link key={label} to={to}>{label}</Link>
            ))}
          </nav>
        ))}
      </div>

      <form className="footer-newsletter">
        <h3>Join the Realm</h3>
        <p>Enter your email to receive drops, tales, and archive offers.</p>
        <div>
          <input placeholder="Enter your email" type="email" />
          <button type="button" aria-label="Join newsletter">-&gt;</button>
        </div>
      </form>

      <div className="footer-bottom">
        <span>(c) 2026 VYBE</span>
        <Link to="/project">Terms</Link>
        <Link to="/project">Privacy</Link>
        <Link to="/project">Cookie Policy</Link>
      </div>
    </footer>
  );
}
