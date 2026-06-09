import React from 'react';
import { Link } from 'react-router-dom';

const banners = [
  {
    label: 'За кулисами',
    title: 'За кулисами дизайна',
    text: 'Материалы, силуэты и детали, собранные в единую атмосферу.',
    image: '/images/site/home/home-feature-banner-1.png',
    to: '/about',
    action: 'Подробнее',
  },
  {
    label: 'Лимитированный дроп',
    title: 'Лимитированный дроп',
    text: 'Редкие предметы и коллекции, доступные ограниченное время.',
    image: '/images/site/home/home-feature-banner-2.png',
    to: '/collections',
    action: 'Смотреть коллекцию',
  },
];

export default function HomeEditorialBanners() {
  return (
    <section className="home-editorial" aria-label="Баннеры VYBE">
      {banners.map((banner) => (
        <article
          className="home-editorial__banner"
          key={banner.title}
          style={{ '--banner-image': `url("${banner.image}")` }}
        >
          <p className="section-label">{banner.label}</p>
          <h2>{banner.title}</h2>
          <p>{banner.text}</p>
          <Link to={banner.to}>{banner.action} →</Link>
        </article>
      ))}
    </section>
  );
}
