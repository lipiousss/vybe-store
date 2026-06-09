import React, { useEffect, useState } from 'react';
import { useAdminUserStore } from '../../store/adminUserStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { formatRole } from '../../utils/formatters.js';
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
      window.alert('Нельзя снять роль администратора с самого себя.');
      return;
    }

    await updateRole(user.id, role);
  }

  async function handleBlock(user) {
    if (user.id === currentUser?.id) {
      window.alert('Нельзя заблокировать самого себя.');
      return;
    }

    await updateBlock(user.id, !user.isBlocked);
  }

  return (
    <div className="admin-users-page">
      <section className="admin-page-head">
        <div>
          <p className="section-label">Пользователи</p>
          <h1>ПОЛЬЗОВАТЕЛИ</h1>
          <p>Управление ролями, блокировками и базовой активностью аккаунтов.</p>
        </div>
      </section>

      <section className="admin-filters">
        <input value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Поиск по email или username" />
        <select value={filters.role} onChange={(event) => updateFilter('role', event.target.value)}>
          <option value="">Все роли</option>
          <option value="USER">Пользователь</option>
          <option value="ADMIN">Администратор</option>
        </select>
        <select value={filters.isBlocked} onChange={(event) => updateFilter('isBlocked', event.target.value)}>
          <option value="">Все статусы</option>
          <option value="false">Активные</option>
          <option value="true">Заблокированные</option>
        </select>
      </section>

      {(error || success) && <p className={`state-text ${error ? 'danger' : 'success'}`}>{error || success}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Аватар</th>
              <th>Пользователь</th>
              <th>Почта</th>
              <th>Роль</th>
              <th>Телефон</th>
              <th>Заказы</th>
              <th>Избранное</th>
              <th>Статус</th>
              <th>Создан</th>
              <th>Действия</th>
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
                <td><strong>{user.username}</strong><span>{user.profile?.firstName || 'Имя не указано'}</span></td>
                <td>{user.email}</td>
                <td><span className={`admin-role-badge ${user.role.toLowerCase()}`}>{formatRole(user.role)}</span></td>
                <td>{user.phone || '-'}</td>
                <td>{user.counts?.orders || 0}</td>
                <td>{user.counts?.favorites || 0}</td>
                <td>
                  <span className={`admin-blocked-badge ${user.isBlocked ? 'blocked' : 'active'}`}>
                    {user.isBlocked ? 'Заблокирован' : 'Активен'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="admin-row-actions">
                    <select value={user.role} onChange={(event) => handleRole(user, event.target.value)} disabled={isLoading}>
                      <option value="USER">Пользователь</option>
                      <option value="ADMIN">Администратор</option>
                    </select>
                    <button
                      className={`admin-icon-action${user.isBlocked ? '' : ' danger'}`}
                      type="button"
                      onClick={() => handleBlock(user)}
                      disabled={isLoading || user.id === currentUser?.id}
                    >
                      {user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && users.length === 0 && <tr><td colSpan="10">Пользователи не найдены.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
