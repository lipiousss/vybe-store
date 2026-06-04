import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard.jsx';
import ProfileMenu from '../../components/profile/ProfileMenu.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useCartStore } from '../../store/cartStore.js';
import { useFavoriteStore } from '../../store/favoriteStore.js';
import { useOrderStore } from '../../store/orderStore.js';
import { useProfileStore } from '../../store/profileStore.js';
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
            <img src={avatarUrl(user.avatar)} alt={user?.username || 'User avatar'} />
          ) : (
            <span>{user?.username?.[0]?.toUpperCase() || 'V'}</span>
          )}
        </div>
        <div className="profile-main-info">
          <p className="section-label">Keeper of the Archive</p>
          <h1>{user?.username || 'VYBEWARDEN'}</h1>
          <p>{userProfile?.bio || 'In shadows we forge. In silence we endure.'}</p>
          {isLoading && <Loader text="Loading profile..." />}
          {error && <p className="state-text danger">{error}</p>}
        </div>
      </section>

      <section className="profile-stats profile-archive-stats">
        <article>
          <span>{stats.orders}</span>
          <p>Orders</p>
        </article>
        <article>
          <span>{stats.favorites}</span>
          <p>Saved Relics</p>
        </article>
        <article>
          <span>{totalQuantity}</span>
          <p>Cart Items</p>
        </article>
        <article>
          <span>{user?.role || 'USER'}</span>
          <p>Member Tier</p>
        </article>
      </section>

      <div className="profile-layout">
        <ProfileMenu />
        <section className="profile-content profile-archive-content">
          <div className="section-heading split-heading">
            <div>
              <p className="section-label">Your Relics & Orders</p>
              <h2>Saved relics</h2>
            </div>
            <Link className="ghost-button" to="/profile/favorites">View all saved</Link>
          </div>

          <div className="product-grid saved-relic-grid">
            {savedProducts.length > 0 ? (
              savedProducts.map((product) => <ProductCard product={product} key={product.id} />)
            ) : (
              <div className="archive-card profile-empty-inline">No saved relics yet.</div>
            )}
          </div>

          <div className="section-heading split-heading">
            <div>
              <p className="section-label">Recent Orders</p>
              <h2>Archive movement</h2>
            </div>
            <Link className="ghost-button" to="/profile/orders">View all orders</Link>
          </div>

          <div className="profile-recent-orders">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <article className="archive-card" key={order.id}>
                  <strong>#{order.id.slice(0, 8)}</strong>
                  <span>{order.status}</span>
                  <span>{Number(order.totalPrice).toLocaleString('ru-RU')} RUB</span>
                </article>
              ))
            ) : (
              <div className="archive-card profile-empty-inline">Orders will appear after checkout.</div>
            )}
          </div>
        </section>

        <aside className="profile-actions archive-card">
          <p className="section-label">Account Actions</p>
          <Link to="/profile/settings">Edit personal data -&gt;</Link>
          <Link to="/profile/settings">Change email -&gt;</Link>
          <Link to="/profile/settings">Change password -&gt;</Link>
          <Link to="/profile/settings">Upload new avatar -&gt;</Link>
        </aside>
      </div>
    </main>
  );
}
