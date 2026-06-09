import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

const links = [
  ['Профиль', '/profile', true],
  ['Заказы', '/profile/orders'],
  ['Избранное', '/profile/favorites'],
  ['Настройки', '/profile/settings'],
  ['Безопасность', '/profile/settings'],
];

export default function ProfileMenu() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <aside className="profile-menu archive-card">
      <p className="section-label">Меню профиля</p>
      {links.map(([label, to, end]) => (
        <NavLink key={label} to={to} end={Boolean(end)}>{label}</NavLink>
      ))}
      <button type="button" onClick={handleLogout}>Выйти</button>
    </aside>
  );
}
