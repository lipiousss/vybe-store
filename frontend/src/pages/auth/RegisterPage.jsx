import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;

function validateForm(form) {
  if (!emailPattern.test(form.email.trim())) {
    return 'Некорректный email.';
  }

  if (!usernamePattern.test(form.username.trim())) {
    return 'Имя пользователя: 3-20 символов, латиница, цифры или underscore.';
  }

  if (
    form.password.length < 8
    || !/[A-Z]/.test(form.password)
    || !/[a-z]/.test(form.password)
    || !/\d/.test(form.password)
  ) {
    return 'Пароль должен содержать большую букву, маленькую букву, цифру и минимум 8 символов.';
  }

  if (form.password !== form.repeatPassword) {
    return 'Пароли не совпадают.';
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
        <p className="eyebrow">Новый сигнал</p>
        <h1>Создание аккаунта</h1>
        <p>Зарегистрируйте профиль VYBE для избранного, заказов и доступа к архиву.</p>
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
          Имя пользователя
          <input
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
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
        <label>
          Повторите пароль
          <input
            type="password"
            value={form.repeatPassword}
            onChange={(event) => setForm({ ...form, repeatPassword: event.target.value })}
            required
          />
        </label>
        {(localError || error) && <p className="state-text danger">{localError || error}</p>}
        <button className="gold-button" type="submit" disabled={isLoading}>
          {isLoading ? 'Создаём...' : 'Зарегистрироваться'}
        </button>
        <Link className="auth-link" to="/login">Уже есть аккаунт?</Link>
      </form>
    </main>
  );
}
