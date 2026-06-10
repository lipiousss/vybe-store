import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;

function getPasswordRules(password) {
  return [
    ['Минимум 8 символов', password.length >= 8],
    ['Большая буква', /[A-Z]/.test(password)],
    ['Маленькая буква', /[a-z]/.test(password)],
    ['Цифра', /\d/.test(password)],
  ];
}

function validateForm(form) {
  if (!emailPattern.test(form.email.trim())) {
    return 'Введите корректный email.';
  }

  if (!usernamePattern.test(form.username.trim())) {
    return 'Имя пользователя: 3-20 символов, латиница, цифры или underscore.';
  }

  if (getPasswordRules(form.password).some(([, passed]) => !passed)) {
    return 'Пароль не соответствует требованиям безопасности.';
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
  const [showPassword, setShowPassword] = React.useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = React.useState(false);
  const passwordRules = getPasswordRules(form.password);
  const isPasswordReady = passwordRules.every(([, passed]) => passed);
  const passwordsMatch = form.repeatPassword.length > 0 && form.password === form.repeatPassword;

  function updateField(field, value) {
    setLocalError(null);
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateForm(form);

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      await register({
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
      });
      navigate('/', { replace: true });
    } catch {
      // Ошибка уже записана в authStore и выводится в форме.
    }
  }

  return (
    <main className="auth-page auth-page--register">
      <section className="auth-shell" aria-label="Регистрация VYBE">
        <aside className="auth-brand-panel">
          <div className="auth-brand-mark">V</div>
          <p className="section-label">Новый сигнал</p>
          <h1>Создайте свой архив VYBE</h1>
          <p>
            Аккаунт нужен для избранного, корзины, заказов и сохранения личных данных профиля.
          </p>
          <div className="auth-benefits">
            <span>Безопасный вход</span>
            <span>История заказов</span>
            <span>Личный профиль</span>
          </div>
        </aside>

        <form className="auth-card auth-card--wide" onSubmit={handleSubmit}>
          <div className="auth-card__ornament" aria-hidden="true">
            <span>VYBE</span>
            <i />
            <span>ACCESS</span>
          </div>

          <div className="auth-card__head">
            <p className="section-label">Регистрация</p>
            <h2>Создание аккаунта</h2>
            <p>Заполните данные, чтобы открыть личный кабинет магазина.</p>
          </div>

          <div className="auth-field-grid">
            <label className="auth-field">
              <span>Email</span>
              <input
                autoComplete="email"
                inputMode="email"
                placeholder="you@vybe.com"
                required
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
              />
            </label>

            <label className="auth-field">
              <span>Имя пользователя</span>
              <input
                autoComplete="username"
                placeholder="night_walker"
                required
                value={form.username}
                onChange={(event) => updateField('username', event.target.value)}
              />
            </label>
          </div>

          <label className="auth-field">
            <span>Пароль</span>
            <div className="auth-password-control">
              <input
                autoComplete="new-password"
                placeholder="Минимум 8 символов"
                required
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? 'Скрыть' : 'Показать'}
              </button>
            </div>
          </label>

          <div className="auth-password-rules" aria-label="Требования к паролю">
            {passwordRules.map(([label, passed]) => (
              <span className={passed ? 'is-passed' : ''} key={label}>
                {label}
              </span>
            ))}
          </div>

          <label className="auth-field">
            <span>Повторите пароль</span>
            <div className="auth-password-control">
              <input
                autoComplete="new-password"
                placeholder="Повторите пароль"
                required
                type={showRepeatPassword ? 'text' : 'password'}
                value={form.repeatPassword}
                onChange={(event) => updateField('repeatPassword', event.target.value)}
              />
              <button type="button" onClick={() => setShowRepeatPassword((value) => !value)}>
                {showRepeatPassword ? 'Скрыть' : 'Показать'}
              </button>
            </div>
          </label>

          {form.password && form.repeatPassword && (
            <p className={`auth-message ${passwordsMatch ? 'auth-message--success' : 'auth-message--error'}`} aria-live="polite">
              {passwordsMatch ? 'Пароли совпадают.' : 'Пароли пока не совпадают.'}
            </p>
          )}

          {(localError || error) && <p className="auth-message auth-message--error" role="alert">{localError || error}</p>}

          <button className="auth-submit" type="submit" disabled={isLoading || !isPasswordReady || !passwordsMatch}>
            {isLoading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
          </button>

          <div className="auth-card__footer">
            <span>Уже есть аккаунт?</span>
            <Link to="/login">Войти</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
