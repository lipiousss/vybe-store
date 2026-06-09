import React from 'react';
import { useAdminOrderStore } from '../../store/adminOrderStore.js';
import { formatOrderStatus, money } from '../../utils/formatters.js';

const statuses = ['', 'NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const { orders, fetchAdminOrders, updateOrderStatus, isLoading, error } = useAdminOrderStore();
  const [filters, setFilters] = React.useState({ status: '', search: '' });

  React.useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    fetchAdminOrders(params).catch(() => {});
  }, [fetchAdminOrders, filters]);

  async function handleStatusChange(orderId, status) {
    await updateOrderStatus(orderId, status);
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    await fetchAdminOrders(params);
  }

  return (
    <div className="admin-orders-page">
      <section className="admin-page-head">
        <div>
          <p className="section-label">Заказы</p>
          <h1>ЗАКАЗЫ</h1>
          <p>Проверяйте demo-заказы и переводите их по этапам обработки.</p>
        </div>
      </section>

      <section className="admin-order-filters">
        <label>
          Статус
          <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            {statuses.map((status) => <option value={status} key={status}>{status ? formatOrderStatus(status) : 'Все'}</option>)}
          </select>
        </label>
        <label>
          Поиск
          <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="email, имя, телефон..." />
        </label>
      </section>

      {isLoading && <p className="state-text">Загружаем заказы...</p>}
      {error && <p className="state-text danger">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table admin-orders-table">
          <thead>
            <tr>
              <th>Заказ</th>
              <th>Пользователь</th>
              <th>Клиент</th>
              <th>Телефон</th>
              <th>Статус</th>
              <th>Сумма</th>
              <th>Создан</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id.slice(0, 8)}</td>
                <td>{order.user?.email || order.customerEmail}</td>
                <td>{order.customerName}</td>
                <td>{order.customerPhone}</td>
                <td><span className={`order-status ${order.status.toLowerCase()}`}>{formatOrderStatus(order.status)}</span></td>
                <td>{money(order.totalPrice)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select value={order.status} onChange={(event) => handleStatusChange(order.id, event.target.value)}>
                    {statuses.filter(Boolean).map((status) => <option value={status} key={status}>{formatOrderStatus(status)}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan="8">Заказы не найдены.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
