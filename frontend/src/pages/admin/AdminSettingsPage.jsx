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
          <p className="eyebrow">Settings</p>
          <h1>STORE SETTINGS</h1>
          <p>Demo configuration panel for diploma presentation. Values are stored locally until a settings model is added.</p>
        </div>
      </section>

      {saved && <p className="state-text success">Settings saved locally.</p>}

      <form className="admin-panel admin-settings-form" onSubmit={handleSave}>
        <label>Store name<input value={settings.storeName} onChange={(event) => update('storeName', event.target.value)} /></label>
        <label>Theme<input value={settings.theme} onChange={(event) => update('theme', event.target.value)} /></label>
        <label>Currency
          <select value={settings.currency} onChange={(event) => update('currency', event.target.value)}>
            <option value="RUB">RUB</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
        <label>Email verification mode
          <select value={settings.emailVerification} onChange={(event) => update('emailVerification', event.target.value)}>
            <option value="demo">demo</option>
            <option value="disabled">disabled</option>
            <option value="planned">planned</option>
          </select>
        </label>
        <label>1C integration
          <select value={settings.oneCIntegration} onChange={(event) => update('oneCIntegration', event.target.value)}>
            <option value="disabled">disabled</option>
            <option value="planned">planned</option>
          </select>
        </label>
        <label className="check-row">
          <input checked={settings.demoPayment} type="checkbox" onChange={(event) => update('demoPayment', event.target.checked)} />
          Demo payment mode enabled
        </label>
        <button className="gold-button" type="submit">Save Settings</button>
      </form>
    </div>
  );
}
