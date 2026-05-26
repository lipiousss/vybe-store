import React from 'react';
import { useAdminOrderStore } from '../../store/adminOrderStore.js';

const statuses = ['', 'NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

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
          <p className="section-label">Orders</p>
          <h1>ORDERS</h1>
          <p>Review demo-mode orders and move them through the fulfilment flow.</p>
        </div>
      </section>

      <section className="admin-order-filters">
        <label>
          Status
          <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            {statuses.map((status) => <option value={status} key={status}>{status || 'All'}</option>)}
          </select>
        </label>
        <label>
          Search
          <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="email, name, phone..." />
        </label>
      </section>

      {isLoading && <p className="state-text">Loading admin orders...</p>}
      {error && <p className="state-text danger">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table admin-orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>User</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Total</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id.slice(0, 8)}</td>
                <td>{order.user?.email || order.customerEmail}</td>
                <td>{order.customerName}</td>
                <td>{order.customerPhone}</td>
                <td><span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                <td>{money(order.totalPrice)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select value={order.status} onChange={(event) => handleStatusChange(order.id, event.target.value)}>
                    {statuses.filter(Boolean).map((status) => <option value={status} key={status}>{status}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan="8">No orders found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
