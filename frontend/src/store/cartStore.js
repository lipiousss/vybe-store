import { create } from 'zustand';
import { cartApi } from '../api/cartApi.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Не удалось выполнить запрос корзины';
}

function applyCartState(set, cart) {
  set({
    cart,
    items: cart?.items || [],
    totalQuantity: cart?.totalQuantity || 0,
    totalPrice: Number(cart?.totalPrice || 0),
    isLoading: false,
  });
}

function findDefaultVariant(product, variantId) {
  if (variantId !== undefined) {
    return variantId || null;
  }

  const availableVariant = product?.variants?.find((variant) => variant.stock > 0);
  return availableVariant?.id || null;
}

export const useCartStore = create((set, get) => ({
  cart: null,
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isCartOpen: false,
  isLoading: false,
  error: null,

  openCart() {
    set({ isCartOpen: true });
  },

  closeCart() {
    set({ isCartOpen: false });
  },

  toggleCart() {
    set((state) => ({ isCartOpen: !state.isCartOpen }));
  },

  async fetchCart() {
    set({ isLoading: true, error: null });

    try {
      const data = await cartApi.getCart();
      applyCartState(set, data.cart);
      return data.cart;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async addToCart(product, variantId, quantity = 1) {
    set({ isLoading: true, error: null });

    try {
      const data = await cartApi.addItem({
        productId: product.id,
        variantId: findDefaultVariant(product, variantId),
        quantity,
      });
      applyCartState(set, data.cart);
      set({ isCartOpen: true });
      return data.cart;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async updateQuantity(itemId, quantity) {
    set({ isLoading: true, error: null });

    try {
      const data = await cartApi.updateItem(itemId, { quantity });
      applyCartState(set, data.cart);
      return data.cart;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async removeFromCart(itemId) {
    set({ isLoading: true, error: null });

    try {
      const data = await cartApi.removeItem(itemId);
      applyCartState(set, data.cart);
      return data.cart;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async clearCart() {
    set({ isLoading: true, error: null });

    try {
      const data = await cartApi.clearCart();
      applyCartState(set, data.cart);
      return data.cart;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },
}));
