import React from 'react';
import ProductCard from '../../components/product/ProductCard.jsx';
import ProfileMenu from '../../components/profile/ProfileMenu.jsx';
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

        {isLoading && <p className="state-text">Loading favorites...</p>}
        {error && <p className="state-text danger">{error}</p>}

        {!isLoading && products.length === 0 ? (
          <div className="profile-placeholder empty-favorites">
            <h2>В избранном пока пусто</h2>
            <p>Добавь товар через кнопку сердца в каталоге или на странице товара.</p>
          </div>
        ) : (
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
