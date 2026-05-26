import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

const menuGroups = [
  {
    title: 'MAIN',
    links: [
      { label: 'Dashboard', to: '/admin', end: true },
      { label: 'Orders', to: '/admin/orders' },
      { label: 'Products', to: '/admin/products' },
      { label: 'Collections', to: '/admin/collections' },
      { label: 'Customers', to: '/admin/users' },
      { label: 'Analytics', to: '/admin/analytics' },
    ],
  },
  {
    title: 'CATALOGUE',
    links: [
      { label: 'Categories', to: '/admin/categories' },
      { label: 'Inventory', to: '/admin/stock' },
      { label: 'Artworks', to: '/admin/artworks' },
      { label: 'Site Content', to: '/admin/site-content' },
    ],
  },
  {
    title: 'STORE MANAGEMENT',
    links: [
      { label: 'Pages', to: '/admin/pages' },
      { label: 'Banners', to: '/admin/banners' },
      { label: 'Settings', to: '/admin/settings' },
    ],
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  function handleLogout() {
    logout();
    navigate('/');
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
          <p>WEAR THE SHADOW.</p>
          <strong>COMMAND THE SILENCE.</strong>
          <button type="button" onClick={() => navigate('/')}>View Store</button>
          <button type="button" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar">
          <label className="admin-command-input">
            <span>Search</span>
            <input placeholder="Search orders, products, customers..." />
          </label>

          <div className="admin-topbar__actions">
            <button type="button">Bell</button>
            <button type="button">Inbox</button>
            <select defaultValue="30">
              <option value="30">Last 30 Days</option>
              <option value="7">Last 7 Days</option>
              <option value="all">All Time</option>
            </select>
            <button type="button">Export Report</button>
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
