import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const navItems = [
  ['Главная', '/'],
  ['Каталог', '/catalog'],
  ['Collectibles', '/collectibles'],
  ['Artworks', '/artworks'],
  ['О нас', '/about'],
];

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuth, logout } = useAuthStore();
  const { openCart, totalQuantity } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const avatar = user?.avatar ? mediaUrl(user.avatar) : null;

  function goTo(path) {
    setIsMenuOpen(false);
    navigate(path);
  }

  function handleMenuLink(event, path) {
    event.preventDefault();
    goTo(path);
  }

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
                <a href="/profile" onMouseDown={(event) => handleMenuLink(event, '/profile')} onClick={(event) => handleMenuLink(event, '/profile')}>
                  Профиль
                </a>
                <a href="/profile/settings" onMouseDown={(event) => handleMenuLink(event, '/profile/settings')} onClick={(event) => handleMenuLink(event, '/profile/settings')}>
                  Настройки
                </a>
                {user?.role === 'ADMIN' && (
                  <a href="/admin" onMouseDown={(event) => handleMenuLink(event, '/admin')} onClick={(event) => handleMenuLink(event, '/admin')}>
                    Admin
                  </a>
                )}
                <button type="button" onMouseDown={handleLogout} onClick={handleLogout}>
                  Выйти
                </button>
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
