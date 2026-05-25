import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

export default function ProfileMenu() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <aside className="profile-menu">
      <NavLink to="/profile" end>Профиль</NavLink>
      <NavLink to="/profile/settings">Настройки</NavLink>
      <NavLink to="/profile/favorites">Избранное</NavLink>
      <NavLink to="/profile/orders">Заказы</NavLink>
      <button type="button" onClick={handleLogout}>Выйти</button>
    </aside>
  );
}
