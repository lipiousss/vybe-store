import React from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../../components/cart/CartItem.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useCartStore } from '../../store/cartStore.js';

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export default function CartPage() {
  const {
    items,
    totalPrice,
    totalQuantity,
    fetchCart,
    clearCart,
    isLoading,
    error,
  } = useCartStore();

  React.useEffect(() => {
    fetchCart().catch(() => {});
  }, [fetchCart]);

  return (
    <main className="cart-page">
      <section className="cart-page__head fantasy-card">
        <p className="section-label">Cart</p>
        <h1>Корзина</h1>
        <p>Проверь выбранные артефакты перед оформлением demo-заказа.</p>
      </section>

      {isLoading && items.length === 0 && <Loader text="Loading cart..." />}
      {error && <ErrorState title="Cart is unavailable" message={error} />}

      {!isLoading && !error && items.length === 0 ? (
        <EmptyState
          label="Cart"
          title="Корзина пуста"
          message="Добавь товар из каталога, чтобы перейти к оформлению заказа."
          action={<Link className="gold-button" to="/catalog">В каталог</Link>}
        />
      ) : null}

      {items.length > 0 && (
        <section className="cart-page__layout">
          <div className="cart-page__items">
            {items.map((item) => (
              <CartItem item={item} key={item.id} />
            ))}
          </div>

          <aside className="cart-page__summary fantasy-card">
            <h2>Summary</h2>
            <div>
              <span>Total items</span>
              <strong>{totalQuantity}</strong>
            </div>
            <div>
              <span>Total</span>
              <strong>{money(totalPrice)}</strong>
            </div>
            <Link className="gold-button" to="/checkout">Checkout</Link>
            <button className="ghost-button danger" type="button" onClick={clearCart} disabled={isLoading}>
              Clear cart
            </button>
          </aside>
        </section>
      )}
    </main>
  );
}
