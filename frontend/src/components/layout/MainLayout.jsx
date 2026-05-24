import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function MainLayout() {
  return (
    <div className="site-frame">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
