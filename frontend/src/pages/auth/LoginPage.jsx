import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuthStore();
  const [form, setForm] = React.useState({ email: 'admin@vybe.com', password: 'Admin1234' });
  const [showPassword, setShowPassword] = React.useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch {
      // Ошибка уже записана в authStore и выводится в форме.
    }
  }

  return (
    <main className="auth-page auth-page--login">
      <section className="auth-shell" aria-label="Вход в аккаунт VYBE">
        <aside className="auth-brand-panel">
          <div className="auth-brand-mark">V</div>
          <p className="section-label">Личный архив</p>
          <h1>Вернитесь в пространство VYBE</h1>
          <p>
            Войдите, чтобы открыть профиль, избранные предметы, корзину и историю заказов.
          </p>
          <div className="auth-benefits">
            <span>Избранное</span>
            <span>Заказы</span>
            <span>Админ-доступ</span>
          </div>
        </aside>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-card__ornament" aria-hidden="true">
            <span>VYBE</span>
            <i />
            <span>ARCHIVE ACCESS</span>
          </div>

          <div className="auth-card__head">
            <p className="section-label">Авторизация</p>
            <h2>Вход в VYBE</h2>
            <p>Используйте email и пароль, созданные при регистрации.</p>
          </div>

          <label className="auth-field">
            <span>Email</span>
            <input
              autoComplete="email"
              inputMode="email"
              placeholder="admin@vybe.com"
              required
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
          </label>

          <label className="auth-field">
            <span>Пароль</span>
            <div className="auth-password-control">
              <input
                autoComplete="current-password"
                placeholder="Введите пароль"
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

          {error && <p className="auth-message auth-message--error" role="alert">{error}</p>}

          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Входим...' : 'Войти'}
          </button>

          <div className="auth-card__footer">
            <span>Нет аккаунта?</span>
            <Link to="/register">Создать аккаунт</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
