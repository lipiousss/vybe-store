import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;

function validateForm(form) {
  if (!emailPattern.test(form.email.trim())) {
    return 'Email is invalid.';
  }

  if (!usernamePattern.test(form.username.trim())) {
    return 'Username must be 3-20 characters: latin letters, numbers, underscore.';
  }

  if (
    form.password.length < 8
    || !/[A-Z]/.test(form.password)
    || !/[a-z]/.test(form.password)
    || !/\d/.test(form.password)
  ) {
    return 'Password must include uppercase, lowercase, number, and 8+ characters.';
  }

  if (form.password !== form.repeatPassword) {
    return 'Passwords do not match.';
  }

  return null;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
  const [form, setForm] = React.useState({
    email: '',
    username: '',
    password: '',
    repeatPassword: '',
  });
  const [localError, setLocalError] = React.useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateForm(form);

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    await register({
      email: form.email,
      username: form.username,
      password: form.password,
    });
    navigate('/', { replace: true });
  }

  return (
    <main className="auth-page">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <p className="eyebrow">New signal</p>
        <h1>Create account</h1>
        <p>Register a VYBE profile for future favorites, orders, and archive access.</p>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>
        <label>
          Username
          <input
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>
        <label>
          Repeat password
          <input
            type="password"
            value={form.repeatPassword}
            onChange={(event) => setForm({ ...form, repeatPassword: event.target.value })}
            required
          />
        </label>
        {(localError || error) && <p className="state-text danger">{localError || error}</p>}
        <button className="gold-button" type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Register'}
        </button>
        <Link className="auth-link" to="/login">Already have access?</Link>
      </form>
    </main>
  );
}
