import React from 'react';
import ProductCard from '../../components/product/ProductCard.jsx';
import ProfileMenu from '../../components/profile/ProfileMenu.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useFavoriteStore } from '../../store/favoriteStore.js';

export default function ProfileFavoritesPage() {
  const { favorites, fetchFavorites, isLoading, error } = useFavoriteStore();
  const products = favorites.map((favorite) => favorite.product).filter(Boolean);

  React.useEffect(() => {
    fetchFavorites().catch(() => {});
  }, [fetchFavorites]);

  return (
    <main className="profile-page">
      <ProfileMenu />
      <section className="profile-content">
        <div className="section-heading">
          <p className="eyebrow">Favorites</p>
          <h1>Избранное</h1>
          <p>Сохранённые товары из архива VYBE.</p>
        </div>

        {isLoading && <Loader text="Loading favorites..." />}
        {error && <ErrorState title="Favorites are unavailable" message={error} />}

        {!isLoading && !error && products.length === 0 ? (
          <EmptyState
            label="Favorites"
            title="В избранном пока пусто"
            message="Добавь товар через кнопку сердца в каталоге или на странице товара."
          />
        ) : null}

        {!isLoading && !error && products.length > 0 && (
          <div className="product-grid favorites-grid">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
