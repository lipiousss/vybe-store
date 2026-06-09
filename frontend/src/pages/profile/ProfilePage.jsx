import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard.jsx';
import ProfileMenu from '../../components/profile/ProfileMenu.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useCartStore } from '../../store/cartStore.js';
import { useFavoriteStore } from '../../store/favoriteStore.js';
import { useOrderStore } from '../../store/orderStore.js';
import { useProfileStore } from '../../store/profileStore.js';
import { formatOrderStatus, formatRole, money } from '../../utils/formatters.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

function avatarUrl(avatar) {
  if (!avatar) {
    return null;
  }

  return mediaUrl(avatar);
}

export default function ProfilePage() {
  const { profile, fetchProfile, isLoading, error } = useProfileStore();
  const { favorites, fetchFavorites } = useFavoriteStore();
  const { orders, fetchMyOrders } = useOrderStore();
  const { totalQuantity, fetchCart } = useCartStore();
  const user = profile?.user;
  const userProfile = profile?.profile;
  const stats = profile?.stats || { favorites: 0, orders: 0 };
  const savedProducts = favorites.map((favorite) => favorite.product).filter(Boolean).slice(0, 4);
  const recentOrders = orders.slice(0, 3);

  useEffect(() => {
    fetchProfile().catch(() => {});
    fetchFavorites().catch(() => {});
    fetchMyOrders().catch(() => {});
    fetchCart().catch(() => {});
  }, [fetchProfile, fetchFavorites, fetchMyOrders, fetchCart]);

  return (
    <main className="profile-page profile-archive-page">
      <section className="profile-hero corner-frame">
        <div className="profile-avatar large">
          {avatarUrl(user?.avatar) ? (
            <img src={avatarUrl(user.avatar)} alt={user?.username || 'Аватар пользователя'} />
          ) : (
            <span>{user?.username?.[0]?.toUpperCase() || 'V'}</span>
          )}
        </div>
        <div className="profile-main-info">
          <p className="section-label">Хранитель архива</p>
          <h1>{user?.username || 'VYBEWARDEN'}</h1>
          <p>{userProfile?.bio || 'В тени создаём. В тишине сохраняем.'}</p>
          {isLoading && <Loader text="Загружаем профиль..." />}
          {error && <p className="state-text danger">{error}</p>}
        </div>
      </section>

      <section className="profile-stats profile-archive-stats">
        <article>
          <span>{stats.orders}</span>
          <p>Заказов</p>
        </article>
        <article>
          <span>{stats.favorites}</span>
          <p>В избранном</p>
        </article>
        <article>
          <span>{totalQuantity}</span>
          <p>Товаров в корзине</p>
        </article>
        <article>
          <span>{formatRole(user?.role)}</span>
          <p>Уровень участника</p>
        </article>
      </section>

      <div className="profile-layout">
        <ProfileMenu />
        <section className="profile-content profile-archive-content">
          <div className="section-heading split-heading">
            <div>
              <p className="section-label">Ваш архив</p>
              <h2>Избранное</h2>
            </div>
            <Link className="ghost-button" to="/profile/favorites">Смотреть всё</Link>
          </div>

          <div className="product-grid saved-relic-grid">
            {savedProducts.length > 0 ? (
              savedProducts.map((product) => <ProductCard product={product} key={product.id} variant="compact" />)
            ) : (
              <div className="archive-card profile-empty-inline">Пока нет избранных товаров.</div>
            )}
          </div>

          <div className="section-heading split-heading">
            <div>
              <p className="section-label">Последние заказы</p>
              <h2>Движение архива</h2>
            </div>
            <Link className="ghost-button" to="/profile/orders">Все заказы</Link>
          </div>

          <div className="profile-recent-orders">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <article className="archive-card" key={order.id}>
                  <strong>#{order.id.slice(0, 8)}</strong>
                  <span>{formatOrderStatus(order.status)}</span>
                  <span>{money(order.totalPrice)}</span>
                </article>
              ))
            ) : (
              <div className="archive-card profile-empty-inline">Заказы появятся после оформления корзины.</div>
            )}
          </div>
        </section>

        <aside className="profile-actions archive-card">
          <p className="section-label">Действия аккаунта</p>
          <Link to="/profile/settings">Изменить личные данные -&gt;</Link>
          <Link to="/profile/settings">Изменить почту -&gt;</Link>
          <Link to="/profile/settings">Изменить пароль -&gt;</Link>
          <Link to="/profile/settings">Загрузить аватар -&gt;</Link>
        </aside>
      </div>
    </main>
  );
}
