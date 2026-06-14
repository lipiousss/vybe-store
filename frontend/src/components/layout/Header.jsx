import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const navItems = [
  ['Главная', '/'],
  ['Каталог', '/catalog'],
  ['Коллекции', '/collections'],
  ['Коллекционные предметы', '/collectibles'],
  ['Артворки', '/artworks'],
  ['О нас', '/about'],
];

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuth, logout } = useAuthStore();
  const { closeCart, totalQuantity } = useCartStore();
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

    closeCart();
    navigate('/cart');
  }

  React.useEffect(() => {
    function handleDocumentPointerDown(event) {
      if (!isMenuOpen) return;

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
      <div className="site-topbar" aria-label="Объявление магазина">
        <span />
        <p>Бесплатная доставка при заказе от 15 000 ₽</p>
        <span />
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
          Меню
        </button>

        <nav className={`main-nav${isMobileOpen ? ' is-open' : ''}`} aria-label="Основная навигация">
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
          <button className="header-icon-button header-search-button" type="button" aria-label="Открыть поиск по каталогу" onClick={() => goTo('/catalog')}>
            Поиск
          </button>

          <button className="header-icon-button header-favorite-button" type="button" aria-label="Открыть избранное" onClick={() => goTo(isAuth ? '/profile/favorites' : '/login')}>
            Избранное
          </button>

          <button className="cart-button" type="button" onClick={handleCartClick}>
            <span>Корзина</span>
            <strong>{totalQuantity}</strong>
          </button>

          <div className="user-menu" ref={userMenuRef}>
            {isAuth ? (
              <button
                type="button"
                className="user-menu-trigger"
                onClick={() => setIsMenuOpen((value) => !value)}
                aria-expanded={isMenuOpen}
                aria-label="Открыть меню профиля"
              >
                <span className="avatar-orb">
                  {avatar ? <img src={avatar} alt={user?.username || 'Аватар'} /> : user?.username?.[0]?.toUpperCase() || 'V'}
                </span>
              </button>
            ) : (
              <button
                className="header-icon-button header-profile-button"
                type="button"
                onClick={() => setIsMenuOpen((value) => !value)}
                aria-expanded={isMenuOpen}
                aria-label="Открыть меню гостя"
              >
                Войти
              </button>
            )}

            {isMenuOpen && (
              <nav
                className="user-dropdown"
                aria-label="Меню профиля"
                onPointerDown={(event) => event.stopPropagation()}
              >
                {isAuth ? (
                  <>
                    <Link to="/profile" onMouseDown={(event) => handleDropdownNavigate(event, '/profile')} onPointerDown={(event) => handleDropdownNavigate(event, '/profile')} onClick={(event) => handleDropdownNavigate(event, '/profile')}>
                      Профиль
                    </Link>
                    <Link to="/profile/settings" onMouseDown={(event) => handleDropdownNavigate(event, '/profile/settings')} onPointerDown={(event) => handleDropdownNavigate(event, '/profile/settings')} onClick={(event) => handleDropdownNavigate(event, '/profile/settings')}>
                      Настройки
                    </Link>
                    {!isAdmin && (
                      <Link to="/profile/favorites" onMouseDown={(event) => handleDropdownNavigate(event, '/profile/favorites')} onPointerDown={(event) => handleDropdownNavigate(event, '/profile/favorites')} onClick={(event) => handleDropdownNavigate(event, '/profile/favorites')}>
                        Избранное
                      </Link>
                    )}
                    {isAdmin && (
                      <Link to="/admin" onMouseDown={(event) => handleDropdownNavigate(event, '/admin')} onPointerDown={(event) => handleDropdownNavigate(event, '/admin')} onClick={(event) => handleDropdownNavigate(event, '/admin')}>
                        Админ-панель
                      </Link>
                    )}
                    <Link to="/profile/orders" onMouseDown={(event) => handleDropdownNavigate(event, '/profile/orders')} onPointerDown={(event) => handleDropdownNavigate(event, '/profile/orders')} onClick={(event) => handleDropdownNavigate(event, '/profile/orders')}>
                      Заказы
                    </Link>
                    <button type="button" onClick={handleLogout}>Выйти</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onMouseDown={(event) => handleDropdownNavigate(event, '/login')} onPointerDown={(event) => handleDropdownNavigate(event, '/login')} onClick={(event) => handleDropdownNavigate(event, '/login')}>
                      Войти
                    </Link>
                    <Link to="/register" onMouseDown={(event) => handleDropdownNavigate(event, '/register')} onPointerDown={(event) => handleDropdownNavigate(event, '/register')} onClick={(event) => handleDropdownNavigate(event, '/register')}>
                      Регистрация
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
