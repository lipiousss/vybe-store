import React from 'react';
import { Link } from 'react-router-dom';

const pages = [
  ['Главная', '/', 'Витрина, избранные товары и редакционные баннеры.'],
  ['О бренде', '/about', 'История бренда, материалы и идея проекта.'],
  ['Артворки', '/artworks', 'Визуальный архив и полноэкранный просмотр работ.'],
  ['Коллекционные', '/collectibles', 'Редкие объекты и архивные реликвии.'],
  ['Каталог', '/catalog', 'Основной каталог товаров с фильтрами.'],
];

export default function AdminPagesPage() {
  return (
    <div className="admin-pages-page">
      <section className="admin-page-head">
        <div>
          <p className="eyebrow">Страницы</p>
          <h1>МЕНЕДЖЕР СТАТИЧЕСКИХ СТРАНИЦ</h1>
          <p>Demo-панель публичных маршрутов. Полное редактирование контента можно добавить позже через SiteAsset и модели страниц.</p>
        </div>
      </section>

      <section className="admin-card-grid">
        {pages.map(([title, route, description]) => (
          <article className="admin-panel admin-page-card" key={route}>
            <p className="section-label">{route}</p>
            <h2>{title}</h2>
            <p>{description}</p>
            <span className="admin-status active">Активна</span>
            <Link className="ghost-button" to={route}>Открыть страницу</Link>
          </article>
        ))}
      </section>
    </div>
  );
}
