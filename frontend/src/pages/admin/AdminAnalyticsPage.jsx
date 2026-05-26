import React, { useEffect } from 'react';
import { useAdminAnalyticsStore } from '../../store/adminAnalyticsStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

function money(value) {
  return `${Number(value || 0).toLocaleString('ru-RU')} ₽`;
}

function date(value) {
  return value ? new Date(value).toLocaleString('ru-RU') : '-';
}

function qty(value) {
  return Number(value) > 0 ? `+${value}` : value;
}

export default function AdminAnalyticsPage() {
  const {
    overview,
    recentOrders,
    lowStock,
    topProducts,
    stockMovements,
    fetchDashboardData,
    error,
  } = useAdminAnalyticsStore();

  useEffect(() => {
    fetchDashboardData().catch(() => {});
  }, [fetchDashboardData]);

  return (
    <div className="admin-analytics-page">
      <section className="admin-page-head">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>REALM INTELLIGENCE</h1>
          <p>Live revenue, orders, inventory alerts and stock movement signals from the database.</p>
        </div>
      </section>

      {error && <p className="state-text danger">{error}</p>}

      <section className="admin-dashboard-grid admin-dashboard-grid--stats">
        {[
          ['Revenue', money(overview?.totalRevenue)],
          ['Average Order', money(overview?.averageOrderValue)],
          ['Low Stock', overview?.lowStockCount || 0],
          ['Out of Stock', overview?.outOfStockCount || 0],
          ['Collectibles', overview?.collectibleProductsCount || 0],
        ].map(([label, value]) => (
          <article className="admin-stat-card" key={label}>
            <span className="admin-mini-icon">◇</span>
            <p>{label}</p>
            <strong>{value}</strong>
            <small>database signal</small>
          </article>
        ))}
      </section>

      <section className="admin-analytics-grid">
        <article className="admin-panel">
          <header className="admin-panel__head"><div><p className="section-label">Recent Orders</p><h2>Orders</h2></div></header>
          <div className="admin-table-wrap compact">
            <table className="admin-table admin-table--compact">
              <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Items</th><th>Status</th></tr></thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id.slice(0, 8)}</td>
                    <td>{order.customerName}</td>
                    <td>{money(order.totalPrice)}</td>
                    <td>{order.itemsCount}</td>
                    <td><span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                  </tr>
                ))}
                {recentOrders.length === 0 && <tr><td colSpan="5">No orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel">
          <header className="admin-panel__head"><div><p className="section-label">Top Products</p><h2>Best sellers</h2></div></header>
          <div className="admin-mini-list admin-mini-list--media">
            {topProducts.map((product) => (
              <article className="admin-mini-card with-image" key={product.productId}>
                <img src={mediaUrl(product.image, '/images/placeholders/product-placeholder.png')} alt={product.name} />
                <strong>{product.name}</strong>
                <span>{product.soldQuantity} sold</span>
                <span>{money(product.revenue)}</span>
              </article>
            ))}
            {topProducts.length === 0 && <p>No sales data yet.</p>}
          </div>
        </article>

        <article className="admin-panel">
          <header className="admin-panel__head"><div><p className="section-label">Low Stock</p><h2>Alerts</h2></div></header>
          <div className="admin-mini-list">
            {lowStock.map((variant) => (
              <article className="admin-mini-card" key={variant.id}>
                <strong>{variant.product?.name}</strong>
                <span>{variant.size || variant.color || variant.sku}</span>
                <span className={`stock-status ${variant.stock === 0 ? 'out' : 'low'}`}>{variant.stock} left</span>
              </article>
            ))}
            {lowStock.length === 0 && <p>No inventory alerts.</p>}
          </div>
        </article>

        <article className="admin-panel">
          <header className="admin-panel__head"><div><p className="section-label">Stock Movements</p><h2>Warehouse journal</h2></div></header>
          <div className="admin-table-wrap compact">
            <table className="admin-table admin-table--compact">
              <thead><tr><th>Product</th><th>Variant</th><th>Type</th><th>Qty</th><th>Date</th></tr></thead>
              <tbody>
                {stockMovements.map((movement) => (
                  <tr key={movement.id}>
                    <td>{movement.product?.name}</td>
                    <td>{movement.variant?.sku}</td>
                    <td><span className={`stock-movement ${movement.type.toLowerCase()}`}>{movement.type}</span></td>
                    <td>{qty(movement.quantity)}</td>
                    <td>{date(movement.createdAt)}</td>
                  </tr>
                ))}
                {stockMovements.length === 0 && <tr><td colSpan="5">No stock movements yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
