import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';

const backendUrl = 'http://localhost:4000';

const navItems = [
  ['Главная', '/'],
  ['Каталог', '/catalog'],
  ['Collectibles', '/collectibles'],
  ['Artworks', '/artworks'],
  ['О нас', '/about'],
];

function resolveAvatarUrl(avatar) {
  if (!avatar) {
    return null;
  }

  return avatar.startsWith('/uploads') ? `${backendUrl}${avatar}` : avatar;
}

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuth, logout } = useAuthStore();
  const { openCart, totalQuantity } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const avatar = resolveAvatarUrl(user?.avatar);

  function handleLogout() {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  }

  function handleCartClick() {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    openCart();
  }

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
        <button className="cart-button" type="button" onClick={handleCartClick}>
          <span>Cart</span>
          <strong>{totalQuantity}</strong>
        </button>

        {isAuth ? (
          <div className="user-menu">
            <button
              type="button"
              className="user-menu-trigger"
              onClick={() => setIsMenuOpen((value) => !value)}
              aria-expanded={isMenuOpen}
            >
              <span className="avatar-orb">
                {avatar ? <img src={avatar} alt={user?.username || 'Avatar'} /> : user?.username?.[0]?.toUpperCase() || 'V'}
              </span>
              <span>{user?.username || 'profile'}</span>
            </button>
            {isMenuOpen && (
              <div className="user-dropdown">
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Профиль</Link>
                <Link to="/profile/settings" onClick={() => setIsMenuOpen(false)}>Настройки</Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin/orders" onClick={() => setIsMenuOpen(false)}>Admin Orders</Link>
                )}
                <button type="button" onClick={handleLogout}>Выйти</button>
              </div>
            )}
          </div>
        ) : (
          <Link className="gold-button small" to="/login">
            Войти
          </Link>
        )}
      </div>
    </header>
  );
}
