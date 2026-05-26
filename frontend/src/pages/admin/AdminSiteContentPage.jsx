import React, { useEffect, useMemo, useState } from 'react';
import { useSiteAssetStore } from '../../store/siteAssetStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const requiredAssets = [
  {
    key: 'enter_screen_image',
    title: 'Enter Screen Image',
    description: 'Background image for the ritual enter screen.',
    fallback: '/images/placeholders/product-placeholder.png',
  },
  {
    key: 'home_hero_image',
    title: 'Home Hero Image',
    description: 'Main image for the storefront hero.',
    fallback: '/images/placeholders/product-placeholder.png',
  },
  {
    key: 'about_main_image',
    title: 'About Main Image',
    description: 'Story image for the about page.',
    fallback: '/images/placeholders/product-placeholder.png',
  },
  {
    key: 'collectibles_hero_image',
    title: 'Collectibles Hero Image',
    description: 'Hero image for collectible relics.',
    fallback: '/images/placeholders/collectible-placeholder.png',
  },
];

export default function AdminSiteContentPage() {
  const { assets, fetchAssets, updateAsset, uploadImage, isLoading, error, success, clearMessages } = useSiteAssetStore();
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    fetchAssets().catch(() => {});
  }, [fetchAssets]);

  const assetMap = useMemo(() => new Map(assets.map((asset) => [asset.key, asset])), [assets]);

  function getDraft(config) {
    return drafts[config.key] || assetMap.get(config.key) || config;
  }

  function updateDraft(key, field, value) {
    clearMessages();
    setDrafts((current) => ({
      ...current,
      [key]: {
        ...(assetMap.get(key) || requiredAssets.find((asset) => asset.key === key)),
        ...(current[key] || {}),
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

  async function handleSave(config) {
    const draft = getDraft(config);
    await updateAsset(config.key, {
      title: draft.title || config.title,
      url: draft.url || config.fallback,
      description: draft.description || config.description,
    });
  }

  return (
    <div className="admin-site-content-page">
      <section className="admin-page-head">
        <div>
          <p className="eyebrow">Site Content</p>
          <h1>SITE CONTENT</h1>
          <p>Manage EnterScreen, hero and key public-page images through SiteAsset records.</p>
        </div>
      </section>

      {(error || success) && <p className={`state-text ${error ? 'danger' : 'success'}`}>{error || success}</p>}

      <section className="site-assets-grid">
        {requiredAssets.map((config) => {
          const draft = getDraft(config);
          const preview = draft.url || config.fallback;

          return (
            <article className="site-asset-card" key={config.key}>
              <div className="admin-upload-preview">
                <img src={mediaUrl(preview, config.fallback)} alt={draft.title || config.title} />
              </div>
              <div className="site-asset-card__body">
                <p className="eyebrow">{config.key}</p>
                <label>
                  Title
                  <input value={draft.title || ''} onChange={(event) => updateDraft(config.key, 'title', event.target.value)} />
                </label>
                <label>
                  Description
                  <textarea value={draft.description || ''} onChange={(event) => updateDraft(config.key, 'description', event.target.value)} />
                </label>
                <label className="admin-upload-zone">
                  Upload new image
                  <input accept="image/jpeg,image/png,image/webp" type="file" onChange={(event) => handleUpload(config.key, event)} />
                </label>
                <button className="gold-button" type="button" disabled={isLoading} onClick={() => handleSave(config)}>
                  Save
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
