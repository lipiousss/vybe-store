import React from 'react';
import { Link } from 'react-router-dom';

export default function HomeEditorialBanners({ collections = [] }) {
  const eclipse = collections.find((collection) => collection.name?.toLowerCase().includes('eclipse'));
  const collectionTitle = eclipse?.name || 'Eclipse Collection';

  return (
    <section className="home-editorial" aria-label="Editorial banners">
      <article className="home-editorial__banner">
        <p className="section-label">EDITORIAL</p>
        <h2>Shadows in Motion</h2>
        <p>A visual tale of fabric, form, and forgotten kingdoms.</p>
        <Link to="/about">EXPLORE THE STORY {'\u2192'}</Link>
      </article>

      <article className="home-editorial__banner">
        <p className="section-label">NEW DROP</p>
        <h2>{collectionTitle}</h2>
        <p>New designs born from the void. Limited pieces. Eternal impact.</p>
        <Link to="/collectibles">DISCOVER NOW {'\u2192'}</Link>
      </article>
    </section>
  );
}
