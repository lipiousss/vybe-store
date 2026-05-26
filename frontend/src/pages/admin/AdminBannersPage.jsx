import React, { useEffect, useMemo, useState } from 'react';
import { useSiteAssetStore } from '../../store/siteAssetStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const bannerAssets = [
  ['enter_screen_image', 'Enter Screen Image', 'Ritual gate image shown before the storefront opens.', '/images/placeholders/product-placeholder.png'],
  ['home_hero_image', 'Home Hero Image', 'Main cinematic storefront banner.', '/images/placeholders/product-placeholder.png'],
  ['about_main_image', 'About Main Image', 'Storytelling image for the brand page.', '/images/placeholders/product-placeholder.png'],
  ['collectibles_hero_image', 'Collectibles Hero Image', 'Archive hero image for collectible relics.', '/images/placeholders/collectible-placeholder.png'],
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
          <p className="eyebrow">Banners</p>
          <h1>BANNER VAULT</h1>
          <p>Manage public hero and ritual images through the existing SiteAsset API.</p>
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
                <label>Title<input value={draft.title || title} onChange={(event) => updateDraft(key, 'title', event.target.value)} /></label>
                <label>Description<textarea value={draft.description || description} onChange={(event) => updateDraft(key, 'description', event.target.value)} /></label>
                <label className="admin-upload-zone">Upload new image<input accept="image/jpeg,image/png,image/webp" type="file" onChange={(event) => handleUpload(key, event)} /></label>
                <button className="gold-button" type="button" disabled={isLoading} onClick={() => saveBanner(key, title, description, fallback)}>Save Banner</button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
