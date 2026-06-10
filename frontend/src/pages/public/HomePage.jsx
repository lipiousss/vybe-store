import React from 'react';
import { Link } from 'react-router-dom';
import EnterScreen from '../../components/home/EnterScreen.jsx';
import HeroSection from '../../components/home/HeroSection.jsx';
import HomeCategoryTiles from '../../components/home/HomeCategoryTiles.jsx';
import HomeEditorialBanners from '../../components/home/HomeEditorialBanners.jsx';
import HomeSetupShowcase from '../../components/home/HomeSetupShowcase.jsx';
import TrustStrip from '../../components/home/TrustStrip.jsx';
import ProductCard from '../../components/product/ProductCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { useCategoryStore } from '../../store/categoryStore.js';
import { useCollectionStore } from '../../store/collectionStore.js';
import { useProductStore } from '../../store/productStore.js';

const enterImage = '/images/site/enter/enter-screen-bg.png';
const heroImage = '/images/site/home/home-hero-bg.png';

export default function HomePage() {
  const { featuredProducts, fetchFeaturedProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { fetchCollections } = useCollectionStore();

  React.useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
    fetchCollections();
  }, [fetchFeaturedProducts, fetchCategories, fetchCollections]);

  const featured = featuredProducts.slice(0, 6);

  return (
    <main className="home-page home-storefront-page">
      <EnterScreen image={enterImage} />
      <HeroSection image={heroImage} />
      <HomeCategoryTiles categories={categories} />

      <section className="home-featured">
        <div className="home-section-head">
          <div>
            <p className="section-label">Витрина</p>
            <h2>Избранные товары</h2>
            <p>Подборка вещей, которые лучше всего раскрывают эстетику магазина.</p>
          </div>
          <Link to="/catalog">Смотреть все товары →</Link>
        </div>

        {featured.length === 0 ? (
          <EmptyState
            label="Рекомендации"
            title="Пока нет избранных товаров"
            message="Отметьте товары как рекомендуемые в админ-панели, чтобы заполнить эту секцию."
          />
        ) : (
          <div className="home-featured__grid vybe-product-grid vybe-product-grid--compact">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} variant="compact" />
            ))}
          </div>
        )}
      </section>

      <HomeEditorialBanners />
      <HomeSetupShowcase />
      <TrustStrip />
    </main>
  );
}
