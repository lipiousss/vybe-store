import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

const links = [
  ['Dashboard', '/profile', true],
  ['Orders', '/profile/orders'],
  ['Saved Relics', '/profile/favorites'],
  ['Account Settings', '/profile/settings'],
  ['Security', '/profile/settings'],
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
      <p className="section-label">Keeper Menu</p>
      {links.map(([label, to, end]) => (
        <NavLink key={label} to={to} end={Boolean(end)}>{label}</NavLink>
      ))}
      <button type="button" onClick={handleLogout}>Logout</button>
    </aside>
  );
}
