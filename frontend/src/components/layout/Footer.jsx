import React from 'react';
import { Link } from 'react-router-dom';

const columns = [
  ['Магазин', [['Каталог', '/catalog'], ['Коллекционные предметы', '/collectibles'], ['Корзина', '/cart']]],
  ['Коллекции', [['Коллекции', '/collections'], ['Артворки', '/artworks'], ['Проект', '/project']]],
  ['Компания', [['О VYBE', '/about'], ['Визуальный архив', '/artworks'], ['Описание проекта', '/project']]],
  ['Поддержка', [['Профиль', '/profile'], ['Заказы', '/profile/orders'], ['Настройки', '/profile/settings']]],
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
          Дизайнерские вещи, предметы и визуальные фрагменты в эстетике dark fantasy.
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
        <h3>Присоединиться к VYBE</h3>
        <p>Получайте новости о дропах, коллекциях и визуальном архиве.</p>
        <div>
          <input placeholder="Ваш email" type="email" />
          <button type="button">Подписаться</button>
        </div>
      </form>

      <div className="footer-bottom">
        <span>© 2026 VYBE</span>
        <Link to="/project">Условия</Link>
        <Link to="/project">Приватность</Link>
        <Link to="/project">Cookies</Link>
      </div>
    </footer>
  );
}
