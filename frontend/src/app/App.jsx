import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import { useAuthStore } from '../store/authStore.js';
import { useCartStore } from '../store/cartStore.js';
import { useFavoriteStore } from '../store/favoriteStore.js';

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuth = useAuthStore((state) => state.isAuth);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchFavorites = useFavoriteStore((state) => state.fetchFavorites);

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  React.useEffect(() => {
    if (isAuth) {
      fetchCart().catch(() => {});
      fetchFavorites().catch(() => {});
    } else {
      useCartStore.setState({
        cart: null,
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
        isCartOpen: false,
      });
      useFavoriteStore.setState({
        favorites: [],
        favoriteIds: [],
      });
    }
  }, [fetchCart, fetchFavorites, isAuth]);

  return <RouterProvider router={router} />;
}
