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
  const { closeCart, openCart, totalQuantity } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const userMenuRef = React.useRef(null);
  const avatar = user?.avatar ? mediaUrl(user.avatar) : null;
  const isAdmin = user?.role === 'ADMIN';

  function goTo(path) {
    setIsMenuOpen(false);
    setIsMobileOpen(false);
    closeCart();
    navigate(path);
  }

  function closeMenus() {
    setIsMenuOpen(false);
    setIsMobileOpen(false);
  }

  function handleDropdownNavigate(event, path) {
    event.preventDefault();
    event.stopPropagation();
    goTo(path);
  }

  function handleLogout() {
    logout();
    closeMenus();
    closeCart();
    navigate('/');
  }

  function handleCartClick() {
    closeMenus();

    if (!isAuth) {
      navigate('/login');
      return;
    }

    openCart();
  }

  React.useEffect(() => {
    function handleDocumentPointerDown(event) {
      if (!isMenuOpen) {
        return;
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsMobileOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleDocumentPointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <div className="site-header-stack">
      <div className="site-topbar" aria-label="Store announcement">
        <span>+</span>
        <p>Free worldwide shipping on demo orders over $150</p>
        <span>+</span>
      </div>

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
          <button className="header-icon-button header-search-button" type="button" aria-label="Open catalog search" onClick={() => goTo('/catalog')}>
            Search
          </button>

          <div className="user-menu" ref={userMenuRef}>
            {isAuth ? (
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
            ) : (
              <button
                className="header-icon-button header-profile-button"
                type="button"
                onClick={() => setIsMenuOpen((value) => !value)}
                aria-expanded={isMenuOpen}
                aria-label="Open guest menu"
              >
                Profile
              </button>
            )}

            {isMenuOpen && (
              <nav
                className="user-dropdown"
                aria-label="Profile menu"
                onPointerDown={(event) => event.stopPropagation()}
              >
                {isAuth ? (
                  <>
                    <Link
                      to="/profile"
                      onMouseDown={(event) => handleDropdownNavigate(event, '/profile')}
                      onPointerDown={(event) => handleDropdownNavigate(event, '/profile')}
                      onClick={(event) => handleDropdownNavigate(event, '/profile')}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/profile/settings"
                      onMouseDown={(event) => handleDropdownNavigate(event, '/profile/settings')}
                      onPointerDown={(event) => handleDropdownNavigate(event, '/profile/settings')}
                      onClick={(event) => handleDropdownNavigate(event, '/profile/settings')}
                    >
                      Settings
                    </Link>
                    {!isAdmin && (
                      <Link
                        to="/profile/favorites"
                        onMouseDown={(event) => handleDropdownNavigate(event, '/profile/favorites')}
                        onPointerDown={(event) => handleDropdownNavigate(event, '/profile/favorites')}
                        onClick={(event) => handleDropdownNavigate(event, '/profile/favorites')}
                      >
                        Favorites
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onMouseDown={(event) => handleDropdownNavigate(event, '/admin')}
                        onPointerDown={(event) => handleDropdownNavigate(event, '/admin')}
                        onClick={(event) => handleDropdownNavigate(event, '/admin')}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/profile/orders"
                      onMouseDown={(event) => handleDropdownNavigate(event, '/profile/orders')}
                      onPointerDown={(event) => handleDropdownNavigate(event, '/profile/orders')}
                      onClick={(event) => handleDropdownNavigate(event, '/profile/orders')}
                    >
                      Orders
                    </Link>
                    <button type="button" onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onMouseDown={(event) => handleDropdownNavigate(event, '/login')}
                      onPointerDown={(event) => handleDropdownNavigate(event, '/login')}
                      onClick={(event) => handleDropdownNavigate(event, '/login')}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onMouseDown={(event) => handleDropdownNavigate(event, '/register')}
                      onPointerDown={(event) => handleDropdownNavigate(event, '/register')}
                      onClick={(event) => handleDropdownNavigate(event, '/register')}
                    >
                      Register
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>

          <button className="cart-button" type="button" onClick={handleCartClick}>
            <span>Cart</span>
            <strong>{totalQuantity}</strong>
          </button>
        </div>
      </header>
    </div>
  );
}
