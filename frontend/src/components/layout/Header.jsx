import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

const navItems = [
  ['Главная', '/'],
  ['Каталог', '/catalog'],
  ['Collectibles', '/collectibles'],
  ['Artworks', '/artworks'],
  ['О нас', '/about'],
];

export default function Header() {
  const { user, isAuth, logout } = useAuthStore();

  return (
    <header className="site-header">
      <Link className="logo-mark" to="/">
        <span>VYBE</span>
      </Link>

      <nav className="main-nav" aria-label="Main navigation">
        {navItems.map(([label, to]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="header-actions">
        {isAuth ? (
          <>
            <Link className="user-chip" to="/profile">
              <span className="avatar-orb">{user?.username?.[0]?.toUpperCase() || 'V'}</span>
              <span>{user?.username || 'profile'}</span>
            </Link>
            <button className="ghost-button" type="button" onClick={logout}>
              Выйти
            </button>
          </>
        ) : (
          <Link className="gold-button small" to="/login">
            Войти
          </Link>
        )}
      </div>
    </header>
  );
}
