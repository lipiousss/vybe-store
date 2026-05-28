import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout.jsx';
import HomePage from '../pages/public/HomePage.jsx';
import CatalogPage from '../pages/public/CatalogPage.jsx';
import CollectionsPage from '../pages/public/CollectionsPage.jsx';
import ProductPage from '../pages/public/ProductPage.jsx';
import CollectiblesPage from '../pages/public/CollectiblesPage.jsx';
import ArtworksPage from '../pages/public/ArtworksPage.jsx';
import AboutPage from '../pages/public/AboutPage.jsx';
import ProjectPage from '../pages/public/ProjectPage.jsx';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import AdminLayout from '../components/admin/AdminLayout.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import AdminArtworksPage from '../pages/admin/AdminArtworksPage.jsx';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage.jsx';
import AdminBannersPage from '../pages/admin/AdminBannersPage.jsx';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage.jsx';
import AdminCollectionsPage from '../pages/admin/AdminCollectionsPage.jsx';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage.jsx';
import AdminPagesPage from '../pages/admin/AdminPagesPage.jsx';
import AdminProductCreatePage from '../pages/admin/AdminProductCreatePage.jsx';
import AdminProductEditPage from '../pages/admin/AdminProductEditPage.jsx';
import AdminProductsPage from '../pages/admin/AdminProductsPage.jsx';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage.jsx';
import AdminSiteContentPage from '../pages/admin/AdminSiteContentPage.jsx';
import AdminStockPage from '../pages/admin/AdminStockPage.jsx';
import AdminUsersPage from '../pages/admin/AdminUsersPage.jsx';
import CheckoutPage from '../pages/public/CheckoutPage.jsx';
import CartPage from '../pages/public/CartPage.jsx';
import NotFoundPage from '../pages/public/NotFoundPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import ProfileFavoritesPage from '../pages/profile/ProfileFavoritesPage.jsx';
import ProfileOrdersPage from '../pages/profile/ProfileOrdersPage.jsx';
import ProfilePage from '../pages/profile/ProfilePage.jsx';
import ProfileSettingsPage from '../pages/profile/ProfileSettingsPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'collections', element: <CollectionsPage /> },
      { path: 'product/:slug', element: <ProductPage /> },
      { path: 'collectibles', element: <CollectiblesPage /> },
      { path: 'artworks', element: <ArtworksPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'project', element: <ProjectPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'cart', element: <CartPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'profile/settings', element: <ProfileSettingsPage /> },
          { path: 'profile/favorites', element: <ProfileFavoritesPage /> },
          { path: 'profile/orders', element: <ProfileOrdersPage /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
          {
            path: 'admin',
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              { path: 'analytics', element: <AdminAnalyticsPage /> },
              { path: 'collections', element: <AdminCollectionsPage /> },
              { path: 'categories', element: <AdminCategoriesPage /> },
              { path: 'products', element: <AdminProductsPage /> },
              { path: 'products/create', element: <AdminProductCreatePage /> },
              { path: 'products/:id/edit', element: <AdminProductEditPage /> },
              { path: 'stock', element: <AdminStockPage /> },
              { path: 'orders', element: <AdminOrdersPage /> },
              { path: 'users', element: <AdminUsersPage /> },
              { path: 'artworks', element: <AdminArtworksPage /> },
              { path: 'site-content', element: <AdminSiteContentPage /> },
              { path: 'pages', element: <AdminPagesPage /> },
              { path: 'banners', element: <AdminBannersPage /> },
              { path: 'settings', element: <AdminSettingsPage /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
