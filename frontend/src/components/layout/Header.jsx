import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const navItems = [
  ['SHOP', '/catalog'],
  ['COLLECTIONS', '/collections'],
  ['COLLECTIBLES', '/collectibles'],
  ['ARTWORKS', '/artworks'],
  ['ABOUT', '/about'],
];

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuth, logout } = useAuthStore();
  const { closeCart, totalQuantity } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const avatar = user?.avatar ? mediaUrl(user.avatar) : null;

  function goTo(path) {
    setIsMenuOpen(false);
    setIsMobileOpen(false);
    closeCart();
    navigate(path);
  }

  function handleMenuLink(event, path) {
    event.preventDefault();
    goTo(path);
  }

  function handleLogout() {
    logout();
    setIsMenuOpen(false);
    setIsMobileOpen(false);
    closeCart();
    navigate('/');
  }

  function handleCartClick() {
    goTo(isAuth ? '/cart' : '/login');
  }

  return (
    <header className="site-header ornamental-header">
      <Link className="logo-mark" to="/" onClick={() => setIsMobileOpen(false)}>
        <span className="logo-sigil">V</span>
        <span>VYBE</span>
      </Link>

      <button
        className="mobile-menu-button"
        type="button"
        aria-expanded={isMobileOpen}
        onClick={() => setIsMobileOpen((value) => !value)}
      >
        MENU
      </button>

      <nav className={`main-nav${isMobileOpen ? ' is-open' : ''}`} aria-label="Main navigation">
        {navItems.map(([label, to]) => (
          <NavLink
            key={label}
            to={to}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="header-actions">
        <button className="header-icon-button" type="button" aria-label="Open catalog search" onClick={() => goTo('/catalog')}>
          Search
        </button>

        {isAuth ? (
          <div className="user-menu">
            <button
              type="button"
              className="user-menu-trigger"
              onClick={() => setIsMenuOpen((value) => !value)}
              aria-expanded={isMenuOpen}
              aria-label="Open profile menu"
            >
              <span className="avatar-orb">
                {avatar ? <img src={avatar} alt={user?.username || 'Avatar'} /> : user?.username?.[0]?.toUpperCase() || 'V'}
              </span>
            </button>

            {isMenuOpen && (
              <div className="user-dropdown">
                <a href="/profile" onMouseDown={(event) => handleMenuLink(event, '/profile')} onClick={(event) => handleMenuLink(event, '/profile')}>
                  Profile
                </a>
                <a href="/profile/settings" onMouseDown={(event) => handleMenuLink(event, '/profile/settings')} onClick={(event) => handleMenuLink(event, '/profile/settings')}>
                  Settings
                </a>
                {user?.role === 'ADMIN' && (
                  <a href="/admin" onMouseDown={(event) => handleMenuLink(event, '/admin')} onClick={(event) => handleMenuLink(event, '/admin')}>
                    Admin
                  </a>
                )}
                <button type="button" onMouseDown={handleLogout} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="header-icon-button" type="button" onClick={() => goTo('/login')} aria-label="Login">
            Profile
          </button>
        )}

        <button className="cart-button" type="button" onClick={handleCartClick}>
          <span>Cart</span>
          <strong>{totalQuantity}</strong>
        </button>
      </div>
    </header>
  );
}
