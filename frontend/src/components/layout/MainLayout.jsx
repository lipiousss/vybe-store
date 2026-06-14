import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import PageTransition from './PageTransition.jsx';
import CartDrawer from '../cart/CartDrawer.jsx';
import Atmosphere from '../ui/Atmosphere.jsx';

export default function MainLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={`site-frame${isAdmin ? ' site-frame--admin' : ' site-frame--public'}`}>
      {!isAdmin && <Atmosphere />}
      {!isAdmin && <Header />}
      <PageTransition key={location.pathname}>
        <Outlet />
      </PageTransition>
      {!isAdmin && <Footer />}
      {!isAdmin && <CartDrawer />}
    </div>
  );
}
