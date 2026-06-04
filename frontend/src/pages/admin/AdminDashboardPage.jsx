import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAnalyticsStore } from '../../store/adminAnalyticsStore.js';
import { useAdminProductStore } from '../../store/adminProductStore.js';
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
  const { products, fetchProducts } = useAdminProductStore();

  useEffect(() => {
    fetchDashboardData().catch(() => {});
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchProducts({ status: 'ACTIVE' }).catch(() => {});
  }, [fetchProducts]);

  const stats = [
    ['Total Revenue', money(overview?.totalRevenue), 'Real paid demo orders'],
    ['Total Orders', overview?.totalOrders || 0, `${overview?.deliveredOrdersCount || 0} delivered`],
    ['Total Customers', overview?.totalUsers || 0, 'Registered accounts'],
    ['Total Products', overview?.totalProducts || 0, `${overview?.activeProductsCount || 0} active`],
    ['Low Stock Items', overview?.lowStockCount || 0, `${overview?.outOfStockCount || 0} out of stock`],
  ];
  const previewProduct = products[0] || null;

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
              <p className="section-label">Product Management</p>
              <h2>Catalogue control</h2>
            </div>
            <Link to="/admin/products/create">Add Product</Link>
          </header>
          <div className="admin-table-wrap compact">
            <table className="admin-table admin-table--compact">
              <thead>
                <tr><th>Product</th><th>SKU</th><th>Price</th><th>Stock</th><th>Status</th></tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.variants?.[0]?.sku || '-'}</td>
                    <td>{money(product.finalPrice || product.price)}</td>
                    <td>{(product.variants || []).reduce((sum, variant) => sum + Number(variant.stock || 0), 0)}</td>
                    <td><span className={`admin-status ${product.status.toLowerCase()}`}>{product.status}</span></td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan="5">No products yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel admin-forge-mini">
          <header className="admin-panel__head">
            <div>
              <p className="section-label">Stock Movements</p>
              <h2>Last warehouse events</h2>
            </div>
            <Link to="/admin/analytics">Open Analytics</Link>
          </header>
          <div className="admin-mini-list">
            {stockMovements.slice(0, 5).map((movement) => (
              <article className="admin-mini-card" key={movement.id}>
                <strong>{movement.product?.name}</strong>
                <span className={`stock-movement ${movement.type.toLowerCase()}`}>{movement.type}</span>
                <span>{movementSign(movement.quantity)}</span>
              </article>
            ))}
            {stockMovements.length === 0 && <p>No stock movements yet.</p>}
          </div>
        </article>

        <article className="admin-live-preview">
          <p className="section-label">Live Product Preview</p>
          <div className="admin-preview-card">
            <div className="admin-preview-image">
              <img
                src={mediaUrl(previewProduct?.images?.[0]?.url, '/images/placeholders/product-placeholder.png')}
                alt={previewProduct?.name || 'Preview'}
              />
            </div>
            <div className="admin-preview-body">
              <h3>{previewProduct?.name || 'No products yet'}</h3>
              <span>{previewProduct?.category?.name || 'Awaiting catalogue data'}</span>
              <strong>{previewProduct ? money(previewProduct.finalPrice || previewProduct.price) : money(0)}</strong>
              {previewProduct && <Link className="ghost-button" to={`/product/${previewProduct.slug}`}>View Product Page</Link>}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
