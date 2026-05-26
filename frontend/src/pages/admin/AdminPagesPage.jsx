import React from 'react';
import { Link } from 'react-router-dom';

const pages = [
  ['Home Page', '/', 'Storefront hero, featured pieces and editorial banners.'],
  ['About Page', '/about', 'Brand story, materials and project mission.'],
  ['Artworks Page', '/artworks', 'Visual archive and fullscreen artwork modal.'],
  ['Collectibles Page', '/collectibles', 'Rare objects and archive relics.'],
  ['Catalog Page', '/catalog', 'Main product catalogue with filters.'],
];

export default function AdminPagesPage() {
  return (
    <div className="admin-pages-page">
      <section className="admin-page-head">
        <div>
          <p className="eyebrow">Pages</p>
          <h1>STATIC PAGES MANAGER</h1>
          <p>Demo control room for public routes. CRUD content editing can be added later through SiteAsset and page content models.</p>
        </div>
      </section>

      <section className="admin-card-grid">
        {pages.map(([title, route, description]) => (
          <article className="admin-panel admin-page-card" key={route}>
            <p className="section-label">{route}</p>
            <h2>{title}</h2>
            <p>{description}</p>
            <span className="admin-status active">ACTIVE</span>
            <Link className="ghost-button" to={route}>Open Page</Link>
          </article>
        ))}
      </section>
    </div>
  );
}
