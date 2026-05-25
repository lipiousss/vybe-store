import React from 'react';
import { useSiteAssetStore } from '../../store/siteAssetStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

export default function AboutPage() {
  const { fetchAssets, getAsset } = useSiteAssetStore();
  const aboutImage = mediaUrl(getAsset('about_main_image')?.url);

  React.useEffect(() => {
    fetchAssets().catch(() => {});
  }, [fetchAssets]);

  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <p className="eyebrow">About VYBE</p>
        <h1>A store built like a dark visual world.</h1>
        <p>
          VYBE blends designer goods, collectible drops, and cinematic archive language into
          one diploma project storefront.
        </p>
      </section>
      <section className="about-asset-panel">
        <img src={aboutImage} alt="VYBE project visual" />
      </section>
    </main>
  );
}
