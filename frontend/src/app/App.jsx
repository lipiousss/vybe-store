import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import { useAuthStore } from '../store/authStore.js';

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <RouterProvider router={router} />;
}
