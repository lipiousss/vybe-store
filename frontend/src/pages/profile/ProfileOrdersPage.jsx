import React from 'react';
import { useLocation } from 'react-router-dom';
import ProfileMenu from '../../components/profile/ProfileMenu.jsx';
import { useOrderStore } from '../../store/orderStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString();
}

function getItemsCount(order) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

export default function ProfileOrdersPage() {
  const location = useLocation();
  const { orders, fetchMyOrders, isLoading, error } = useOrderStore();
  const [openOrderId, setOpenOrderId] = React.useState(null);

  React.useEffect(() => {
    fetchMyOrders().catch(() => {});
  }, [fetchMyOrders]);

  return (
    <main className="profile-page">
      <ProfileMenu />
      <section className="profile-content">
        <div className="section-heading">
          <p className="eyebrow">Orders</p>
          <h1>История заказов</h1>
          <p>Demo-mode заказы, созданные из корзины.</p>
        </div>

        {location.state?.success && <p className="state-text success">{location.state.success}</p>}
        {isLoading && <p className="state-text">Loading orders...</p>}
        {error && <p className="state-text danger">{error}</p>}

        {!isLoading && orders.length === 0 ? (
          <div className="profile-placeholder">
            <h2>Заказов пока нет</h2>
            <p>После оформления корзины заказ появится здесь.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <button
                  type="button"
                  className="order-card__summary"
                  onClick={() => setOpenOrderId(openOrderId === order.id ? null : order.id)}
                >
                  <span>#{order.id.slice(0, 8)}</span>
                  <span>{formatDate(order.createdAt)}</span>
                  <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                  <strong>{money(order.totalPrice)}</strong>
                  <span>{getItemsCount(order)} items</span>
                </button>

                {openOrderId === order.id && (
                  <div className="order-card__items">
                    {order.items.map((item) => {
                      const image = mediaUrl(item.product?.images?.[0]?.url);
                      const variant = [item.variant?.size, item.variant?.color].filter(Boolean).join(' / ');

                      return (
                        <div className="order-line" key={item.id}>
                          <img src={image} alt={item.product.name} />
                          <div>
                            <h3>{item.product.name}</h3>
                            {variant && <p>{variant}</p>}
                            <span>{item.quantity} x {money(item.price)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
