import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem.jsx';
import { useCartStore } from '../../store/cartStore.js';
import { money } from '../../utils/formatters.js';

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
          <button className="cart-drawer__overlay" type="button" aria-label="Закрыть корзину" onClick={closeCart} />
          <motion.aside
            className="cart-drawer__panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <header className="cart-drawer__header">
              <div>
                <p className="eyebrow">Корзина</p>
                <h2>Ваши реликвии</h2>
              </div>
              <button type="button" onClick={closeCart} aria-label="Закрыть корзину">x</button>
            </header>

            {error && <p className="state-text danger">{error}</p>}

            {items.length === 0 ? (
              <div className="cart-empty">
                <h3>Корзина пуста</h3>
                <p>Добавьте товар из каталога, чтобы начать оформление.</p>
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
                <span>Количество</span>
                <strong>{totalQuantity}</strong>
              </div>
              <div>
                <span>Итого</span>
                <strong>{money(totalPrice)}</strong>
              </div>
              <button className="gold-button" type="button" onClick={handleCheckout} disabled={items.length === 0}>
                Оформить заказ
              </button>
              <button className="ghost-button danger" type="button" onClick={clearCart} disabled={items.length === 0}>
                Очистить корзину
              </button>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
