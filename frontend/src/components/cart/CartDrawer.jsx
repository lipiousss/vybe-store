import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem.jsx';
import { useCartStore } from '../../store/cartStore.js';

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    isCartOpen,
    closeCart,
    items,
    totalPrice,
    totalQuantity,
    clearCart,
    error,
  } = useCartStore();

  function handleCheckout() {
    closeCart();
    navigate('/checkout');
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          className="cart-drawer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button className="cart-drawer__overlay" type="button" aria-label="Close cart" onClick={closeCart} />
          <motion.aside
            className="cart-drawer__panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <header className="cart-drawer__header">
              <div>
                <p className="eyebrow">Cart</p>
                <h2>Your relics</h2>
              </div>
              <button type="button" onClick={closeCart} aria-label="Close cart">x</button>
            </header>

            {error && <p className="state-text danger">{error}</p>}

            {items.length === 0 ? (
              <div className="cart-empty">
                <h3>The cart is empty.</h3>
                <p>Add an item from the catalog to begin the ritual.</p>
              </div>
            ) : (
              <motion.div
                className="cart-drawer__items"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.04 },
                  },
                }}
              >
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      show: { opacity: 1, x: 0 },
                    }}
                  >
                    <CartItem item={item} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            <footer className="cart-drawer__footer">
              <div>
                <span>Total items</span>
                <strong>{totalQuantity}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>{money(totalPrice)}</strong>
              </div>
              <button className="gold-button" type="button" onClick={handleCheckout} disabled={items.length === 0}>
                Checkout
              </button>
              <button className="ghost-button danger" type="button" onClick={clearCart} disabled={items.length === 0}>
                Clear cart
              </button>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
