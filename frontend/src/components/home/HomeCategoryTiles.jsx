import React from 'react';
import { Link } from 'react-router-dom';

const tileConfig = [
  {
    title: 'Одежда',
    text: 'Многослойные силуэты для ночного города.',
    match: ['одежда', 'apparel', 'clothing'],
    to: '/catalog',
    image: '/images/site/setup/setup-scene-1.png',
  },
  {
    title: 'Аксессуары',
    text: 'Металл, символы и детали для законченного образа.',
    match: ['аксессуары', 'accessories'],
    to: '/catalog',
    image: '/images/site/home/home-feature-banner-1.png',
  },
  {
    title: 'Декор',
    text: 'Предметы для тёмного личного пространства.',
    match: ['декор', 'decor'],
    to: '/catalog',
    image: '/images/site/setup/setup-scene-3.png',
  },
  {
    title: 'Периферия',
    text: 'Рабочее место как часть визуального ритуала.',
    match: ['периферия', 'peripherals'],
    to: '/catalog',
    image: '/images/site/setup/setup-scene-2.png',
  },
  {
    title: 'Коллекционные предметы',
    text: 'Редкие фрагменты из архива бренда.',
    match: ['коллекционные', 'collectibles'],
    to: '/collectibles',
    image: '/images/site/home/home-feature-banner-2.png',
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
    <section className="home-category-tiles" aria-label="Разделы каталога">
      {tileConfig.map((tile, index) => {
        const category = findCategory(categories, tile.match);
        const to = category?.slug && tile.to === '/catalog'
          ? `/catalog?category=${category.slug}`
          : tile.to;

        return (
          <article className="home-category-tile" key={tile.title}>
            <div className="home-category-tile__image">
              <img src={tile.image} alt="" />
            </div>
            <div className="home-category-tile__content">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{tile.title}</h3>
              <p>{category?.description || tile.text}</p>
            </div>
            <Link to={to} aria-label={`Открыть раздел ${tile.title}`}>
              →
            </Link>
          </article>
        );
      })}
    </section>
  );
}
