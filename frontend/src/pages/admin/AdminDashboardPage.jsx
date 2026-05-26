import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAnalyticsStore } from '../../store/adminAnalyticsStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

function money(value) {
  return `${Number(value || 0).toLocaleString('ru-RU')} ₽`;
}

function shortId(id) {
  return `#${String(id || '').slice(0, 8)}`;
}

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString('ru-RU') : '-';
}

function movementSign(quantity) {
  return Number(quantity) > 0 ? `+${quantity}` : quantity;
}

export default function AdminDashboardPage() {
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

  const stats = [
    ['Total Revenue', money(overview?.totalRevenue), 'Real paid demo orders'],
    ['Orders', overview?.totalOrders || 0, `${overview?.deliveredOrdersCount || 0} delivered`],
    ['Customers', overview?.totalUsers || 0, 'Registered accounts'],
    ['Products', overview?.totalProducts || 0, `${overview?.activeProductsCount || 0} active`],
    ['Average Order Value', money(overview?.averageOrderValue), `${overview?.cancelledOrdersCount || 0} cancelled`],
  ];

  return (
    <div className="admin-dashboard">
      <section className="admin-dashboard__head">
        <p className="section-label">OVERVIEW OF YOUR EMPIRE</p>
        <h1>COMMAND THE REALM</h1>
        {error && <p className="state-text danger">{error}</p>}
      </section>

      <section className="admin-dashboard-grid admin-dashboard-grid--stats">
        {stats.map(([label, value, trend]) => (
          <article className="admin-stat-card" key={label}>
            <span className="admin-mini-icon">◇</span>
            <p>{label}</p>
            <strong>{value}</strong>
            <small>{trend}</small>
          </article>
        ))}
      </section>

      <section className="admin-dashboard-grid admin-dashboard-grid--middle">
        <article className="admin-panel">
          <header className="admin-panel__head">
            <div>
              <p className="section-label">Recent Orders</p>
              <h2>Latest movement</h2>
            </div>
            <Link to="/admin/orders">View All Orders</Link>
          </header>
          <div className="admin-table-wrap compact">
            <table className="admin-table admin-table--compact">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{shortId(order.id)}</td>
                    <td>{order.customerName}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{money(order.totalPrice)}</td>
                    <td><span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                  </tr>
                ))}
                {recentOrders.length === 0 && <tr><td colSpan="5">No orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel">
          <header className="admin-panel__head">
            <div>
              <p className="section-label">Low Stock Alerts</p>
              <h2>Inventory warnings</h2>
            </div>
            <Link to="/admin/stock">View Inventory</Link>
          </header>
          <div className="admin-mini-list">
            {lowStock.slice(0, 8).map((variant) => (
              <article className="admin-mini-card" key={variant.id}>
                <strong>{variant.product?.name}</strong>
                <span>{variant.sku}</span>
                <span className={`stock-status ${variant.stock === 0 ? 'out' : 'low'}`}>
                  {variant.stock === 0 ? 'Out of Stock' : `${variant.stock} left`}
                </span>
              </article>
            ))}
            {lowStock.length === 0 && <p>No low stock alerts.</p>}
          </div>
        </article>

        <article className="admin-panel">
          <header className="admin-panel__head">
            <div>
              <p className="section-label">Top Products</p>
              <h2>Sales signal</h2>
            </div>
            <Link to="/admin/analytics">Analytics</Link>
          </header>
          <div className="admin-mini-list">
            {topProducts.slice(0, 8).map((product) => (
              <article className="admin-mini-card" key={product.productId}>
                <strong>{product.name}</strong>
                <span>{product.soldQuantity} sold</span>
                <span>{money(product.revenue)}</span>
              </article>
            ))}
            {topProducts.length === 0 && <p>No sales data yet.</p>}
          </div>
        </article>
      </section>

      <section className="admin-dashboard-grid admin-dashboard-grid--lower">
        <article className="admin-panel admin-products-mini">
          <header className="admin-panel__head">
            <div>
              <p className="section-label">Stock Movements</p>
              <h2>Last warehouse events</h2>
            </div>
            <Link to="/admin/analytics">Open Analytics</Link>
          </header>
          <div className="admin-table-wrap compact">
            <table className="admin-table admin-table--compact">
              <thead>
                <tr><th>Product</th><th>Type</th><th>Qty</th><th>Comment</th></tr>
              </thead>
              <tbody>
                {stockMovements.slice(0, 8).map((movement) => (
                  <tr key={movement.id}>
                    <td>{movement.product?.name}</td>
                    <td><span className={`stock-movement ${movement.type.toLowerCase()}`}>{movement.type}</span></td>
                    <td>{movementSign(movement.quantity)}</td>
                    <td>{movement.comment || '-'}</td>
                  </tr>
                ))}
                {stockMovements.length === 0 && <tr><td colSpan="4">No stock movements yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel admin-forge-mini">
          <header className="admin-panel__head">
            <div>
              <p className="section-label">Forge the Catalogue</p>
              <h2>Quick actions</h2>
            </div>
          </header>
          <Link className="ghost-button" to="/admin/products/create">Add Product</Link>
          <Link className="ghost-button" to="/admin/collections">Collections</Link>
          <Link className="ghost-button" to="/admin/categories">Categories</Link>
          <Link className="ghost-button" to="/admin/stock">Manage Stock</Link>
        </article>

        <article className="admin-live-preview">
          <p className="section-label">Best Seller Preview</p>
          <div className="admin-preview-card">
            <div className="admin-preview-image">
              <img
                src={mediaUrl(topProducts[0]?.image, '/images/placeholders/product-placeholder.png')}
                alt={topProducts[0]?.name || 'Preview'}
              />
            </div>
            <div className="admin-preview-body">
              <h3>{topProducts[0]?.name || 'No sales yet'}</h3>
              <span>{topProducts[0]?.category || 'Awaiting order data'}</span>
              <strong>{topProducts[0] ? money(topProducts[0].revenue) : money(0)}</strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
