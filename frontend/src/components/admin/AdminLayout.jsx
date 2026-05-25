import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <div>
          <p className="eyebrow">VYBE Control</p>
          <h2>Admin</h2>
        </div>
        <NavLink end to="/admin">Dashboard</NavLink>
        <NavLink to="/admin/products">Управление товарами</NavLink>
        <NavLink to="/admin/products/create">Добавить товар</NavLink>
        <NavLink to="/admin/stock">Учёт остатков</NavLink>
        <NavLink to="/admin/orders">Заказы</NavLink>
        <NavLink to="/admin/users">Пользователи</NavLink>
        <NavLink to="/admin/artworks">Artworks</NavLink>
        <NavLink to="/admin/site-content">Контент сайта</NavLink>
        <div className="admin-sidebar-actions">
          <NavLink to="/">Back to site</NavLink>
          <button type="button" onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      <section className="admin-content">
        <Outlet />
      </section>
    </main>
  );
}
