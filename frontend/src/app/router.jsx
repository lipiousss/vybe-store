import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout.jsx';
import HomePage from '../pages/public/HomePage.jsx';
import CatalogPage from '../pages/public/CatalogPage.jsx';
import ProductPage from '../pages/public/ProductPage.jsx';
import CollectiblesPage from '../pages/public/CollectiblesPage.jsx';
import ArtworksPage from '../pages/public/ArtworksPage.jsx';
import AboutPage from '../pages/public/AboutPage.jsx';
import ProjectPage from '../pages/public/ProjectPage.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import ProfilePage from '../pages/profile/ProfilePage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'product/:slug', element: <ProductPage /> },
      { path: 'collectibles', element: <CollectiblesPage /> },
      { path: 'artworks', element: <ArtworksPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'project', element: <ProjectPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
]);
