import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../ui/Loader.jsx';
import { useAuthStore } from '../../store/authStore.js';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const location = useLocation();
  const { user, isAuth, token, isLoading } = useAuthStore();

  if ((isLoading || (token && !user)) && token) {
    return (
      <main className="page-shell">
        <Loader text="Checking access..." />
      </main>
    );
  }

  if (!isAuth && !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
