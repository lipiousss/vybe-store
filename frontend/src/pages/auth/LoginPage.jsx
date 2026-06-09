import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuthStore();
  const [form, setForm] = React.useState({ email: 'admin@vybe.com', password: 'Admin1234' });

  async function handleSubmit(event) {
    event.preventDefault();
    await login(form);
    navigate(location.state?.from?.pathname || '/', { replace: true });
  }

  return (
    <main className="auth-page">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <p className="eyebrow">Доступ к архиву</p>
        <h1>Вход в VYBE</h1>
        <p>Введите email и пароль, чтобы открыть профиль, корзину и заказы.</p>
        <label>
          Электронная почта
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>
        {error && <p className="state-text danger">{error}</p>}
        <button className="gold-button" type="submit" disabled={isLoading}>
          {isLoading ? 'Входим...' : 'Войти'}
        </button>
        <Link className="auth-link" to="/register">Создать аккаунт</Link>
      </form>
    </main>
  );
}
