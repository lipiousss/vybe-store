import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdminOrderStore } from '../../store/adminOrderStore.js';
import { useAdminProductStore } from '../../store/adminProductStore.js';
import { useAdminStockStore } from '../../store/adminStockStore.js';

function flattenVariants(products) {
  return products.flatMap((product) =>
    (product.variants || []).map((variant) => ({
      ...variant,
      product,
    })),
  );
}

export default function AdminDashboardPage() {
  const { products, fetchProducts } = useAdminProductStore();
  const { stockItems, fetchStock } = useAdminStockStore();
  const { orders, fetchAdminOrders } = useAdminOrderStore();

  useEffect(() => {
    fetchProducts();
    fetchStock();
    fetchAdminOrders();
  }, [fetchProducts, fetchStock, fetchAdminOrders]);

  const variants = useMemo(() => flattenVariants(stockItems), [stockItems]);
  const lowStock = variants.filter((variant) => variant.stock > 0 && variant.stock <= 5).length;
  const outOfStock = variants.filter((variant) => variant.stock === 0).length;
  const latestOrders = orders.slice(0, 5);

  return (
    <div className="admin-dashboard">
      <section className="admin-page-head">
        <p className="eyebrow">Dashboard</p>
        <h1>Панель управления VYBE</h1>
        <p>Базовый центр управления товарами, остатками и заказами.</p>
      </section>

      <section className="admin-stats">
        <article>
          <span>{products.length}</span>
          <p>Products</p>
        </article>
        <article>
          <span>{orders.length}</span>
          <p>Orders</p>
        </article>
        <article>
          <span>{lowStock}</span>
          <p>Low stock</p>
        </article>
        <article>
          <span>{outOfStock}</span>
          <p>Out of stock</p>
        </article>
      </section>

      <section className="admin-quick-actions">
        <Link className="gold-button" to="/admin/products/create">Добавить товар</Link>
        <Link className="ghost-button" to="/admin/stock">Учёт остатков</Link>
        <Link className="ghost-button" to="/admin/orders">Заказы</Link>
      </section>

      <section className="admin-panel">
        <div>
          <p className="eyebrow">Recent Orders</p>
          <h2>Последние заказы</h2>
        </div>
        {latestOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="admin-mini-list">
            {latestOrders.map((order) => (
              <article key={order.id}>
                <strong>#{order.id.slice(0, 8)}</strong>
                <span>{order.customerName}</span>
                <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                <b>{Number(order.totalPrice).toLocaleString('ru-RU')} ₽</b>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
