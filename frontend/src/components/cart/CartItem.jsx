import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore.js';
import { money } from '../../utils/formatters.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

export default function CartItem({ item }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const image = mediaUrl(item.product?.images?.[0]?.url);
  const price = Number(item.product?.finalPrice || item.product?.price || 0);
  const variantLabel = [item.variant?.size, item.variant?.color].filter(Boolean).join(' / ');
  const maxStock = item.variant?.stock ?? 999;

  return (
    <article className="cart-item">
      <Link className="cart-item__image" to={`/product/${item.product.slug}`}>
        <img src={image} alt={item.product.name} />
      </Link>
      <div className="cart-item__body">
        <div>
          <h3>{item.product.name}</h3>
          {variantLabel && <p>{variantLabel}</p>}
          <span>{money(price)}</span>
        </div>
        <div className="cart-item__controls">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= maxStock}
          >
            +
          </button>
          <button className="cart-item__remove" type="button" onClick={() => removeFromCart(item.id)}>
            Удалить
          </button>
        </div>
      </div>
    </article>
  );
}
