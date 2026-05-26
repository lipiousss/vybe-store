import React, { useEffect, useState } from 'react';
import { useAdminUserStore } from '../../store/adminUserStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

export default function AdminUsersPage() {
  const currentUser = useAuthStore((state) => state.user);
  const { users, fetchUsers, updateRole, updateBlock, isLoading, error, success, clearMessages } = useAdminUserStore();
  const [filters, setFilters] = useState({ search: '', role: '', isBlocked: '' });

  useEffect(() => {
    fetchUsers({
      search: filters.search || undefined,
      role: filters.role || undefined,
      isBlocked: filters.isBlocked || undefined,
    }).catch(() => {});
  }, [fetchUsers, filters]);

  function updateFilter(field, value) {
    clearMessages();
    setFilters((current) => ({ ...current, [field]: value }));
  }

  async function handleRole(user, role) {
    if (user.id === currentUser?.id && user.role === 'ADMIN' && role !== 'ADMIN') {
      window.alert('You cannot remove the ADMIN role from yourself.');
      return;
    }

    await updateRole(user.id, role);
  }

  async function handleBlock(user) {
    if (user.id === currentUser?.id) {
      window.alert('You cannot block yourself.');
      return;
    }

    await updateBlock(user.id, !user.isBlocked);
  }

  return (
    <div className="admin-users-page">
      <section className="admin-page-head">
        <div>
          <p className="section-label">Customers</p>
          <h1>CUSTOMERS</h1>
          <p>Manage roles, blocked status and basic account activity.</p>
        </div>
      </section>

      <section className="admin-filters">
        <input value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Search email or username" />
        <select value={filters.role} onChange={(event) => updateFilter('role', event.target.value)}>
          <option value="">All roles</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <select value={filters.isBlocked} onChange={(event) => updateFilter('isBlocked', event.target.value)}>
          <option value="">All statuses</option>
          <option value="false">Active</option>
          <option value="true">Blocked</option>
        </select>
      </section>

      {(error || success) && <p className={`state-text ${error ? 'danger' : 'success'}`}>{error || success}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Favorites</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="admin-avatar">
                    {user.avatar ? <img src={mediaUrl(user.avatar)} alt={user.username} /> : user.username[0]?.toUpperCase()}
                  </div>
                </td>
                <td><strong>{user.username}</strong><span>{user.profile?.firstName || 'No profile name'}</span></td>
                <td>{user.email}</td>
                <td><span className={`admin-role-badge ${user.role.toLowerCase()}`}>{user.role}</span></td>
                <td>{user.phone || '-'}</td>
                <td>{user.counts?.orders || 0}</td>
                <td>{user.counts?.favorites || 0}</td>
                <td>
                  <span className={`admin-blocked-badge ${user.isBlocked ? 'blocked' : 'active'}`}>
                    {user.isBlocked ? 'blocked' : 'active'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="admin-row-actions">
                    <select value={user.role} onChange={(event) => handleRole(user, event.target.value)} disabled={isLoading}>
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button
                      className={`admin-icon-action${user.isBlocked ? '' : ' danger'}`}
                      type="button"
                      onClick={() => handleBlock(user)}
                      disabled={isLoading || user.id === currentUser?.id}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && users.length === 0 && <tr><td colSpan="10">No users found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
