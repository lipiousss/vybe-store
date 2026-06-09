import React, { useEffect, useMemo, useState } from 'react';
import { useSiteAssetStore } from '../../store/siteAssetStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const bannerAssets = [
  ['enter_screen_image', 'Изображение входного экрана', 'Ритуальный экран перед открытием витрины.', '/images/placeholders/product-placeholder.png'],
  ['home_hero_image', 'Главное изображение витрины', 'Кинематографичный баннер главной страницы.', '/images/placeholders/product-placeholder.png'],
  ['about_main_image', 'Изображение страницы о бренде', 'Сюжетный визуал для страницы о проекте.', '/images/placeholders/product-placeholder.png'],
  ['collectibles_hero_image', 'Изображение коллекционных предметов', 'Hero-изображение для архивных реликвий.', '/images/placeholders/collectible-placeholder.png'],
];

export default function AdminBannersPage() {
  const { assets, fetchAssets, updateAsset, uploadImage, isLoading, error, success, clearMessages } = useSiteAssetStore();
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    fetchAssets().catch(() => {});
  }, [fetchAssets]);

  const assetMap = useMemo(() => new Map(assets.map((asset) => [asset.key, asset])), [assets]);

  function getDraft(key, title, description, fallback) {
    return drafts[key] || assetMap.get(key) || { key, title, description, url: fallback };
  }

  function updateDraft(key, field, value) {
    clearMessages();
    setDrafts((current) => ({
      ...current,
      [key]: {
        ...(assetMap.get(key) || {}),
        ...(current[key] || {}),
        key,
        [field]: value,
      },
    }));
  }

  async function handleUpload(key, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    updateDraft(key, 'url', url);
    event.target.value = '';
  }

  async function saveBanner(key, title, description, fallback) {
    const draft = getDraft(key, title, description, fallback);
    await updateAsset(key, {
      title: draft.title || title,
      url: draft.url || fallback,
      description: draft.description || description,
    });
  }

  return (
    <div className="admin-banners-page">
      <section className="admin-page-head">
        <div>
          <p className="eyebrow">Баннеры</p>
          <h1>ХРАНИЛИЩЕ БАННЕРОВ</h1>
          <p>Управляйте публичными hero-изображениями через существующий SiteAsset API.</p>
        </div>
      </section>

      {(error || success) && <p className={`state-text ${error ? 'danger' : 'success'}`}>{error || success}</p>}

      <section className="site-assets-grid">
        {bannerAssets.map(([key, title, description, fallback]) => {
          const draft = getDraft(key, title, description, fallback);
          return (
            <article className="site-asset-card" key={key}>
              <div className="admin-upload-preview">
                <img src={mediaUrl(draft.url, fallback)} alt={draft.title || title} />
              </div>
              <div className="site-asset-card__body">
                <p className="eyebrow">{key}</p>
                <label>Заголовок<input value={draft.title || title} onChange={(event) => updateDraft(key, 'title', event.target.value)} /></label>
                <label>Описание<textarea value={draft.description || description} onChange={(event) => updateDraft(key, 'description', event.target.value)} /></label>
                <label className="admin-upload-zone">Загрузить новое изображение<input accept="image/jpeg,image/png,image/webp" type="file" onChange={(event) => handleUpload(key, event)} /></label>
                <button className="gold-button" type="button" disabled={isLoading} onClick={() => saveBanner(key, title, description, fallback)}>Сохранить баннер</button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
