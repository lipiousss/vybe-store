import React, { useState } from 'react';

const initialSettings = {
  storeName: 'VYBE',
  theme: 'Nightreign Blue',
  currency: 'RUB',
  demoPayment: true,
  emailVerification: 'demo',
  oneCIntegration: 'planned',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  function update(field, value) {
    setSaved(false);
    setSettings((current) => ({ ...current, [field]: value }));
  }

  function handleSave(event) {
    event.preventDefault();
    localStorage.setItem('vybe_admin_demo_settings', JSON.stringify(settings));
    setSaved(true);
  }

  return (
    <div className="admin-settings-page">
      <section className="admin-page-head">
        <div>
          <p className="eyebrow">Настройки</p>
          <h1>НАСТРОЙКИ МАГАЗИНА</h1>
          <p>Demo-панель конфигурации для презентации диплома. Значения хранятся локально до появления модели настроек.</p>
        </div>
      </section>

      {saved && <p className="state-text success">Настройки сохранены локально.</p>}

      <form className="admin-panel admin-settings-form" onSubmit={handleSave}>
        <label>Название магазина<input value={settings.storeName} onChange={(event) => update('storeName', event.target.value)} /></label>
        <label>Тема<input value={settings.theme} onChange={(event) => update('theme', event.target.value)} /></label>
        <label>Валюта
          <select value={settings.currency} onChange={(event) => update('currency', event.target.value)}>
            <option value="RUB">RUB</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
        <label>Режим подтверждения email
          <select value={settings.emailVerification} onChange={(event) => update('emailVerification', event.target.value)}>
            <option value="demo">Демо</option>
            <option value="disabled">Отключено</option>
            <option value="planned">Запланировано</option>
          </select>
        </label>
        <label>Интеграция 1C
          <select value={settings.oneCIntegration} onChange={(event) => update('oneCIntegration', event.target.value)}>
            <option value="disabled">Отключена</option>
            <option value="planned">Запланирована</option>
          </select>
        </label>
        <label className="check-row">
          <input checked={settings.demoPayment} type="checkbox" onChange={(event) => update('demoPayment', event.target.checked)} />
          Demo-оплата включена
        </label>
        <button className="gold-button" type="submit">Сохранить настройки</button>
      </form>
    </div>
  );
}
