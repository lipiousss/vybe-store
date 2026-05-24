import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

export default function ProfilePage() {
  const { user, isAuth } = useAuthStore();

  if (!isAuth) {
    return (
      <main className="page-shell">
        <section className="page-hero compact">
          <p className="eyebrow">Profile</p>
          <h1>Access requires a token.</h1>
          <Link className="gold-button" to="/login">Login</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <p className="eyebrow">Profile</p>
        <h1>{user?.username || 'VYBE user'}</h1>
        <p>{user?.email}</p>
      </section>
    </main>
  );
}
