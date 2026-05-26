import React from 'react';
import { Link } from 'react-router-dom';
import EnterScreen from '../../components/home/EnterScreen.jsx';
import HeroSection from '../../components/home/HeroSection.jsx';
import HomeCategoryTiles from '../../components/home/HomeCategoryTiles.jsx';
import HomeEditorialBanners from '../../components/home/HomeEditorialBanners.jsx';
import TrustStrip from '../../components/home/TrustStrip.jsx';
import ProductCard from '../../components/product/ProductCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { useCategoryStore } from '../../store/categoryStore.js';
import { useCollectionStore } from '../../store/collectionStore.js';
import { useProductStore } from '../../store/productStore.js';
import { useSiteAssetStore } from '../../store/siteAssetStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

export default function HomePage() {
  const { featuredProducts, fetchFeaturedProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { collections, fetchCollections } = useCollectionStore();
  const { fetchAssets, getAsset } = useSiteAssetStore();
  const enterImage = mediaUrl(getAsset('enter_screen_image')?.url);
  const heroImage = mediaUrl(getAsset('home_hero_image')?.url, '/images/placeholders/product-placeholder.png');

  React.useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
    fetchCollections();
    fetchAssets().catch(() => {});
  }, [fetchFeaturedProducts, fetchCategories, fetchCollections, fetchAssets]);

  const featured = featuredProducts.slice(0, 6);

  return (
    <main className="home-page home-storefront-page">
      <EnterScreen image={enterImage} />
      <HeroSection image={heroImage} />
      <HomeCategoryTiles categories={categories} />

      <section className="home-featured">
        <div className="home-section-head">
          <h2>FEATURED PIECES</h2>
          <Link to="/catalog">VIEW ALL PRODUCTS {'\u2192'}</Link>
        </div>

        {featured.length === 0 ? (
          <EmptyState
            label="Featured"
            title="No featured relics yet."
            message="Mark products as FEATURED in admin to fill this shelf."
          />
        ) : (
          <div className="product-grid home-featured__grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <HomeEditorialBanners collections={collections} />
      <TrustStrip />
    </main>
  );
}
