import React from 'react';
import { Link } from 'react-router-dom';

const tileConfig = [
  {
    title: 'APPAREL',
    text: 'Layered shadows tailored for the realm.',
    match: ['одежда', 'apparel', 'clothing'],
    to: '/catalog',
  },
  {
    title: 'ACCESSORIES',
    text: 'Details that speak in steel and signal.',
    match: ['аксессуары', 'accessories'],
    to: '/catalog',
  },
  {
    title: 'DECOR',
    text: 'Objects for a mythic dark sanctuary.',
    match: ['декор', 'decor'],
    to: '/catalog',
  },
  {
    title: 'PERIPHERALS',
    text: 'Build your dark command desk.',
    match: ['периферия', 'peripherals'],
    to: '/catalog',
  },
  {
    title: 'COLLECTIBLES',
    text: 'Rare fragments from the archive.',
    match: ['коллекционные', 'collectibles'],
    to: '/collectibles',
  },
];

function findCategory(categories, match) {
  return categories.find((category) => {
    const name = `${category.name || ''} ${category.slug || ''}`.toLowerCase();
    return match.some((item) => name.includes(item));
  });
}

export default function HomeCategoryTiles({ categories = [] }) {
  return (
    <section className="home-category-tiles" aria-label="Featured categories">
      {tileConfig.map((tile, index) => {
        const category = findCategory(categories, tile.match);
        const to = category?.slug && tile.to === '/catalog'
          ? `/catalog?category=${category.slug}`
          : tile.to;

        return (
          <article className="home-category-tile" key={tile.title}>
            <div>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{tile.title}</h3>
              <p>{category?.description || tile.text}</p>
            </div>
            <Link to={to} aria-label={`Open ${tile.title}`}>
              {'\u2192'}
            </Link>
          </article>
        );
      })}
    </section>
  );
}
