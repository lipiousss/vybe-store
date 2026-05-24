import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [form, setForm] = React.useState({ email: 'admin@vybe.com', password: 'Admin1234' });

  async function handleSubmit(event) {
    event.preventDefault();
    await login(form);
    navigate('/profile');
  }

  return (
    <main className="auth-page">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <p className="eyebrow">Access</p>
        <h1>Login to VYBE</h1>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </label>
        {error && <p className="state-text danger">{error}</p>}
        <button className="gold-button" type="submit" disabled={isLoading}>
          {isLoading ? 'Entering...' : 'Enter'}
        </button>
        <Link to="/register">Create account</Link>
      </form>
    </main>
  );
}
