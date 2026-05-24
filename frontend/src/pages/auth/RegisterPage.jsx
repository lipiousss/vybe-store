import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
  const [form, setForm] = React.useState({ email: '', username: '', password: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    await register(form);
    navigate('/profile');
  }

  return (
    <main className="auth-page">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <p className="eyebrow">New signal</p>
        <h1>Create account</h1>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label>
          Username
          <input
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
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
          {isLoading ? 'Creating...' : 'Register'}
        </button>
        <Link to="/login">Already have access?</Link>
      </form>
    </main>
  );
}
