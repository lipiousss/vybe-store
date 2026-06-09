import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAnalyticsStore } from '../../store/adminAnalyticsStore.js';
import { useAdminProductStore } from '../../store/adminProductStore.js';
import { formatOrderStatus, formatProductStatus, formatStockMovement, money } from '../../utils/formatters.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

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
    ['Выручка', money(overview?.totalRevenue), 'Реальные demo-заказы'],
    ['Всего заказов', overview?.totalOrders || 0, `Доставлено: ${overview?.deliveredOrdersCount || 0}`],
    ['Пользователи', overview?.totalUsers || 0, 'Зарегистрированные аккаунты'],
    ['Товары', overview?.totalProducts || 0, `Активных: ${overview?.activeProductsCount || 0}`],
    ['Мало на складе', overview?.lowStockCount || 0, `Нет в наличии: ${overview?.outOfStockCount || 0}`],
  ];
  const previewProduct = products[0] || null;

  return (
    <div className="admin-dashboard">
      <section className="admin-dashboard__head">
        <p className="section-label">Обзор системы</p>
        <h1>Управление магазином</h1>
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
              <p className="section-label">Последние заказы</p>
              <h2>Последнее движение</h2>
            </div>
            <Link to="/admin/orders">Все заказы</Link>
          </header>
          <div className="admin-table-wrap compact">
            <table className="admin-table admin-table--compact">
              <thead>
                <tr>
                  <th>Заказ</th>
                  <th>Покупатель</th>
                  <th>Дата</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{shortId(order.id)}</td>
                    <td>{order.customerName}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{money(order.totalPrice)}</td>
                    <td><span className={`order-status ${order.status.toLowerCase()}`}>{formatOrderStatus(order.status)}</span></td>
                  </tr>
                ))}
                {recentOrders.length === 0 && <tr><td colSpan="5">Заказов пока нет.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel">
          <header className="admin-panel__head">
            <div>
              <p className="section-label">Остатки</p>
              <h2>Предупреждения склада</h2>
            </div>
            <Link to="/admin/stock">Открыть склад</Link>
          </header>
          <div className="admin-mini-list">
            {lowStock.slice(0, 8).map((variant) => (
              <article className="admin-mini-card" key={variant.id}>
                <strong>{variant.product?.name}</strong>
                <span>{variant.sku}</span>
                <span className={`stock-status ${variant.stock === 0 ? 'out' : 'low'}`}>
                  {variant.stock === 0 ? 'Нет в наличии' : `Остаток: ${variant.stock}`}
                </span>
              </article>
            ))}
            {lowStock.length === 0 && <p>Нет предупреждений по остаткам.</p>}
          </div>
        </article>

        <article className="admin-panel">
          <header className="admin-panel__head">
            <div>
              <p className="section-label">Популярные товары</p>
              <h2>Сигнал продаж</h2>
            </div>
            <Link to="/admin/analytics">Аналитика</Link>
          </header>
          <div className="admin-mini-list">
            {topProducts.slice(0, 8).map((product) => (
              <article className="admin-mini-card" key={product.productId}>
                <strong>{product.name}</strong>
                <span>Продано: {product.soldQuantity}</span>
                <span>{money(product.revenue)}</span>
              </article>
            ))}
            {topProducts.length === 0 && <p>Данных о продажах пока нет.</p>}
          </div>
        </article>
      </section>

      <section className="admin-dashboard-grid admin-dashboard-grid--lower">
        <article className="admin-panel admin-products-mini">
          <header className="admin-panel__head">
            <div>
              <p className="section-label">Управление товарами</p>
              <h2>Контроль каталога</h2>
            </div>
            <Link to="/admin/products/create">Добавить товар</Link>
          </header>
          <div className="admin-table-wrap compact">
            <table className="admin-table admin-table--compact">
              <thead>
                <tr><th>Товар</th><th>SKU</th><th>Цена</th><th>Остаток</th><th>Статус</th></tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.variants?.[0]?.sku || '-'}</td>
                    <td>{money(product.finalPrice || product.price)}</td>
                    <td>{(product.variants || []).reduce((sum, variant) => sum + Number(variant.stock || 0), 0)}</td>
                    <td><span className={`admin-status ${product.status.toLowerCase()}`}>{formatProductStatus(product.status)}</span></td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan="5">Товаров пока нет.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel admin-forge-mini">
          <header className="admin-panel__head">
            <div>
              <p className="section-label">Движение склада</p>
              <h2>Последние события склада</h2>
            </div>
            <Link to="/admin/analytics">Открыть аналитику</Link>
          </header>
          <div className="admin-mini-list">
            {stockMovements.slice(0, 5).map((movement) => (
              <article className="admin-mini-card" key={movement.id}>
                <strong>{movement.product?.name}</strong>
                <span className={`stock-movement ${movement.type.toLowerCase()}`}>{formatStockMovement(movement.type)}</span>
                <span>{movementSign(movement.quantity)}</span>
              </article>
            ))}
            {stockMovements.length === 0 && <p>Движений склада пока нет.</p>}
          </div>
        </article>

        <article className="admin-live-preview">
          <p className="section-label">Предпросмотр товара</p>
          <div className="admin-preview-card">
            <div className="admin-preview-image">
              <img
                src={mediaUrl(previewProduct?.images?.[0]?.url, '/images/placeholders/product-placeholder.png')}
                alt={previewProduct?.name || 'Предпросмотр'}
              />
            </div>
            <div className="admin-preview-body">
              <h3>{previewProduct?.name || 'Товаров пока нет'}</h3>
              <span>{previewProduct?.category?.name || 'Ожидаем данные каталога'}</span>
              <strong>{previewProduct ? money(previewProduct.finalPrice || previewProduct.price) : money(0)}</strong>
              {previewProduct && <Link className="ghost-button" to={`/product/${previewProduct.slug}`}>Страница товара</Link>}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
