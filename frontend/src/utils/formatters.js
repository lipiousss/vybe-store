export function money(value) {
  return `${Number(value || 0).toLocaleString('ru-RU')} ₽`;
}

export const orderStatusLabels = {
  NEW: 'Новый',
  PROCESSING: 'В обработке',
  SHIPPED: 'Отправлен',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён',
};

export const productStatusLabels = {
  ACTIVE: 'Активен',
  DRAFT: 'Черновик',
  ARCHIVED: 'Архив',
  OUT_OF_STOCK: 'Нет в наличии',
};

export const roleLabels = {
  USER: 'Пользователь',
  ADMIN: 'Администратор',
  MANAGER: 'Менеджер',
  PREMIUM: 'Premium',
};

export const stockMovementLabels = {
  INCREASE: 'Пополнение',
  DECREASE: 'Списание',
  SALE: 'Продажа',
  MANUAL: 'Ручная правка',
};

export function formatOrderStatus(status) {
  return orderStatusLabels[status] || status || 'Неизвестно';
}

export function formatProductStatus(status) {
  return productStatusLabels[status] || status || 'Неизвестно';
}

export function formatRole(role) {
  return roleLabels[role] || role || 'Пользователь';
}

export function formatStockMovement(type) {
  return stockMovementLabels[type] || type || 'Движение';
}
