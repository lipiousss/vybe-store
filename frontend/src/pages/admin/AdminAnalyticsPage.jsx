import React, { useEffect } from 'react';
import { useAdminAnalyticsStore } from '../../store/adminAnalyticsStore.js';
import { formatOrderStatus, formatStockMovement, money } from '../../utils/formatters.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

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
          <p className="eyebrow">Аналитика</p>
          <h1>АНАЛИТИКА МАГАЗИНА</h1>
          <p>Выручка, заказы, остатки и движения склада на основе реальных данных базы.</p>
        </div>
      </section>

      {error && <p className="state-text danger">{error}</p>}

      <section className="admin-dashboard-grid admin-dashboard-grid--stats">
        {[
          ['Выручка', money(overview?.totalRevenue)],
          ['Средний заказ', money(overview?.averageOrderValue)],
          ['Мало на складе', overview?.lowStockCount || 0],
          ['Нет в наличии', overview?.outOfStockCount || 0],
          ['Коллекционных', overview?.collectibleProductsCount || 0],
        ].map(([label, value]) => (
          <article className="admin-stat-card" key={label}>
            <span className="admin-mini-icon">◇</span>
            <p>{label}</p>
            <strong>{value}</strong>
            <small>данные из БД</small>
          </article>
        ))}
      </section>

      <section className="admin-analytics-grid">
        <article className="admin-panel">
          <header className="admin-panel__head"><div><p className="section-label">Последние заказы</p><h2>Заказы</h2></div></header>
          <div className="admin-table-wrap compact">
            <table className="admin-table admin-table--compact">
              <thead><tr><th>Заказ</th><th>Клиент</th><th>Итого</th><th>Товары</th><th>Статус</th></tr></thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id.slice(0, 8)}</td>
                    <td>{order.customerName}</td>
                    <td>{money(order.totalPrice)}</td>
                    <td>{order.itemsCount}</td>
                    <td><span className={`order-status ${order.status.toLowerCase()}`}>{formatOrderStatus(order.status)}</span></td>
                  </tr>
                ))}
                {recentOrders.length === 0 && <tr><td colSpan="5">Заказов пока нет.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel">
          <header className="admin-panel__head"><div><p className="section-label">Топ товаров</p><h2>Лидеры продаж</h2></div></header>
          <div className="admin-mini-list admin-mini-list--media">
            {topProducts.map((product) => (
              <article className="admin-mini-card with-image" key={product.productId}>
                <img src={mediaUrl(product.image, '/images/placeholders/product-placeholder.png')} alt={product.name} />
                <strong>{product.name}</strong>
                <span>Продано: {product.soldQuantity}</span>
                <span>{money(product.revenue)}</span>
              </article>
            ))}
            {topProducts.length === 0 && <p>Данных о продажах пока нет.</p>}
          </div>
        </article>

        <article className="admin-panel">
          <header className="admin-panel__head"><div><p className="section-label">Низкие остатки</p><h2>Оповещения</h2></div></header>
          <div className="admin-mini-list">
            {lowStock.map((variant) => (
              <article className="admin-mini-card" key={variant.id}>
                <strong>{variant.product?.name}</strong>
                <span>{variant.size || variant.color || variant.sku}</span>
                <span className={`stock-status ${variant.stock === 0 ? 'out' : 'low'}`}>Осталось: {variant.stock}</span>
              </article>
            ))}
            {lowStock.length === 0 && <p>Оповещений по остаткам нет.</p>}
          </div>
        </article>

        <article className="admin-panel">
          <header className="admin-panel__head"><div><p className="section-label">Движения склада</p><h2>Журнал склада</h2></div></header>
          <div className="admin-table-wrap compact">
            <table className="admin-table admin-table--compact">
              <thead><tr><th>Товар</th><th>Вариант</th><th>Тип</th><th>Кол-во</th><th>Дата</th></tr></thead>
              <tbody>
                {stockMovements.map((movement) => (
                  <tr key={movement.id}>
                    <td>{movement.product?.name}</td>
                    <td>{movement.variant?.sku}</td>
                    <td><span className={`stock-movement ${movement.type.toLowerCase()}`}>{formatStockMovement(movement.type)}</span></td>
                    <td>{qty(movement.quantity)}</td>
                    <td>{date(movement.createdAt)}</td>
                  </tr>
                ))}
                {stockMovements.length === 0 && <tr><td colSpan="5">Движений склада пока нет.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
