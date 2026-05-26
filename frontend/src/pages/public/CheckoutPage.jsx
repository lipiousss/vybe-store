import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';
import { useOrderStore } from '../../store/orderStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';
import { maskRuPhone } from '../../utils/phoneMask.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function validateForm(form) {
  if (!form.customerName.trim()) return 'Name is required.';
  if (!phonePattern.test(form.customerPhone.trim())) return 'Phone format must be +7 (999) 999-99-99.';
  if (!emailPattern.test(form.customerEmail.trim())) return 'Email is invalid.';
  if (!form.deliveryCity.trim()) return 'City is required.';
  if (!form.deliveryAddress.trim()) return 'Delivery address is required.';
  return null;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { items, totalPrice, fetchCart } = useCartStore();
  const { createOrder, isLoading, error } = useOrderStore();
  const [localError, setLocalError] = React.useState(null);
  const [form, setForm] = React.useState({
    customerName: user?.username || '',
    customerPhone: user?.phone || '',
    customerEmail: user?.email || '',
    deliveryCity: '',
    deliveryAddress: '',
    comment: '',
  });

  React.useEffect(() => {
    fetchCart().catch(() => {});
  }, [fetchCart]);

  React.useEffect(() => {
    setForm((current) => ({
      ...current,
      customerName: current.customerName || user?.username || '',
      customerPhone: current.customerPhone || user?.phone || '',
      customerEmail: current.customerEmail || user?.email || '',
    }));
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateForm(form);

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    await createOrder(form);
    navigate('/profile/orders', { replace: true, state: { success: 'Order created.' } });
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page checkout-page--empty">
        <EmptyState
          label="Checkout"
          title="Корзина пуста"
          message="Добавь товары из каталога, чтобы создать demo-order."
          action={<Link className="gold-button" to="/catalog">В каталог</Link>}
        />
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-form-wrap">
        <div className="section-heading">
          <p className="eyebrow">Demo checkout</p>
          <h1>Create Order</h1>
          <p>Payment is disabled in demo mode. The order will be created without a payment gateway.</p>
        </div>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Customer name
            <input
              value={form.customerName}
              onChange={(event) => setForm({ ...form, customerName: event.target.value })}
            />
          </label>
          <label>
            Phone
            <input
              type="tel"
              placeholder="+7 (999) 999-99-99"
              maxLength="18"
              value={form.customerPhone}
              onChange={(event) => setForm({ ...form, customerPhone: maskRuPhone(event.target.value) })}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.customerEmail}
              onChange={(event) => setForm({ ...form, customerEmail: event.target.value })}
            />
          </label>
          <label>
            City
            <input
              value={form.deliveryCity}
              onChange={(event) => setForm({ ...form, deliveryCity: event.target.value })}
            />
          </label>
          <label className="checkout-wide">
            Delivery address
            <input
              value={form.deliveryAddress}
              onChange={(event) => setForm({ ...form, deliveryAddress: event.target.value })}
            />
          </label>
          <label className="checkout-wide">
            Comment
            <textarea
              value={form.comment}
              onChange={(event) => setForm({ ...form, comment: event.target.value })}
              rows="4"
            />
          </label>

          {(localError || error) && <p className="state-text danger checkout-wide">{localError || error}</p>}
          <button className="gold-button checkout-wide" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Order'}
          </button>
        </form>
      </section>

      <aside className="checkout-summary">
        <h2>Summary</h2>
        <div className="checkout-summary-items">
          {items.map((item) => {
            const image = mediaUrl(item.product?.images?.[0]?.url);
            const variant = [item.variant?.size, item.variant?.color].filter(Boolean).join(' / ');
            const price = Number(item.product?.finalPrice || item.product?.price || 0);

            return (
              <article className="checkout-summary-item" key={item.id}>
                <img src={image} alt={item.product.name} />
                <div>
                  <h3>{item.product.name}</h3>
                  {variant && <p>{variant}</p>}
                  <span>{item.quantity} x {money(price)}</span>
                </div>
              </article>
            );
          })}
        </div>
        <div className="checkout-total">
          <span>Total</span>
          <strong>{money(totalPrice)}</strong>
        </div>
      </aside>
    </main>
  );
}
