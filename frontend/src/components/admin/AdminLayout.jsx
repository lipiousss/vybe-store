import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useAdminStockStore } from '../../store/adminStockStore.js';

const menuGroups = [
  {
    title: 'ОСНОВНОЕ',
    links: [
      { label: 'Панель', to: '/admin', end: true },
      { label: 'Заказы', to: '/admin/orders' },
      { label: 'Товары', to: '/admin/products' },
      { label: 'Коллекции', to: '/admin/collections' },
      { label: 'Пользователи', to: '/admin/users' },
      { label: 'Аналитика', to: '/admin/analytics' },
    ],
  },
  {
    title: 'КАТАЛОГ',
    links: [
      { label: 'Категории', to: '/admin/categories' },
      { label: 'Склад', to: '/admin/stock' },
      { label: 'Артворки', to: '/admin/artworks' },
      { label: 'Контент сайта', to: '/admin/site-content' },
    ],
  },
  {
    title: 'УПРАВЛЕНИЕ',
    links: [
      { label: 'Страницы', to: '/admin/pages' },
      { label: 'Баннеры', to: '/admin/banners' },
      { label: 'Настройки', to: '/admin/settings' },
    ],
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const exportStock = useAdminStockStore((state) => state.exportStock);
  const isExporting = useAdminStockStore((state) => state.isExporting);

  function handleLogout() {
    logout();
    navigate('/');
  }

  async function handleExportReport() {
    try {
      await exportStock();
    } catch {
      // Ошибка уже сохраняется в adminStockStore.
    }
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__sigil">V</span>
          <strong>VYBE</strong>
        </div>

        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          {menuGroups.map((group) => (
            <section className="admin-sidebar__section" key={group.title}>
              <p>{group.title}</p>
              {group.links.map((link) => (
                link.placeholder ? (
                  <span className="admin-sidebar__link admin-sidebar__link--placeholder" key={`${group.title}-${link.label}`}>
                    <span>{link.label}</span>
                  </span>
                ) : (
                  <NavLink className="admin-sidebar__link" end={Boolean(link.end)} key={`${group.title}-${link.label}`} to={link.to}>
                    <span>{link.label}</span>
                  </NavLink>
                )
              ))}
            </section>
          ))}
        </nav>

        <div className="admin-promo-card">
          <p>НОСИ ЛЕГЕНДУ.</p>
          <strong>УПРАВЛЯЙ ТИШИНОЙ.</strong>
          <button type="button" onClick={() => navigate('/')}>На сайт</button>
          <button type="button" onClick={handleLogout}>Выйти</button>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar">
          <label className="admin-command-input">
            <span>Поиск</span>
            <input placeholder="Искать заказы, товары, пользователей..." />
          </label>

          <div className="admin-topbar__actions">
            <button type="button">Уведомления</button>
            <button type="button">Входящие</button>
            <select defaultValue="30">
              <option value="30">Последние 30 дней</option>
              <option value="7">Последние 7 дней</option>
              <option value="all">Всё время</option>
            </select>
            <button className="admin-export-report-button" type="button" onClick={handleExportReport} disabled={isExporting}>
              {isExporting ? 'Экспорт...' : 'Экспорт отчёта'}
            </button>
            <div className="admin-topbar__user">
              <span className="avatar-orb">{user?.username?.[0]?.toUpperCase() || 'A'}</span>
              <div>
                <strong>{user?.username || 'Admin'}</strong>
                <small>{user?.role || 'ADMIN'}</small>
              </div>
            </div>
          </div>
        </header>

        <Outlet />
      </section>
    </main>
  );
}
