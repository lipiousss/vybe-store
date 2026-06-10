import React, { useEffect, useMemo, useState } from 'react';
import { useAdminStockStore } from '../../store/adminStockStore.js';

function flattenStock(products) {
  return products.flatMap((product) =>
    (product.variants || []).map((variant) => ({ product, variant })),
  );
}

function stockState(stock) {
  if (stock === 0) return 'out';
  if (stock <= 2) return 'critical';
  if (stock <= 5) return 'low';
  return 'available';
}

function stockLabel(stock) {
  if (stock === 0) return 'Нет в наличии';
  if (stock <= 2) return 'Критично';
  if (stock <= 5) return 'Мало';
  return 'Доступно';
}

export default function AdminStockPage() {
  const { stockItems, fetchStock, updateStock, exportStock, isLoading, isExporting, error, success, clearMessages } = useAdminStockStore();
  const [drafts, setDrafts] = useState({});
  const rows = useMemo(() => flattenStock(stockItems), [stockItems]);
  const totalStock = rows.reduce((sum, row) => sum + Number(row.variant.stock || 0), 0);
  const lowStock = rows.filter((row) => row.variant.stock > 0 && row.variant.stock <= 5).length;
  const outOfStock = rows.filter((row) => row.variant.stock === 0).length;

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  function getDraft(variant) {
    return drafts[variant.id] || { stock: variant.stock, comment: '' };
  }

  function updateDraft(variantId, field, value) {
    clearMessages();
    setDrafts((current) => ({
      ...current,
      [variantId]: { ...(current[variantId] || {}), [field]: value },
    }));
  }

  async function handleSave(variant) {
    const draft = getDraft(variant);
    await updateStock(variant.id, Number(draft.stock), draft.comment);
    setDrafts((current) => {
      const next = { ...current };
      delete next[variant.id];
      return next;
    });
    await fetchStock();
  }

  async function handleExport() {
    try {
      await exportStock();
    } catch {
      // Ошибка уже сохраняется в adminStockStore и выводится ниже.
    }
  }

  return (
    <div className="admin-stock-page">
      <section className="admin-page-head">
        <div>
          <p className="section-label">Склад</p>
          <h1>ОСТАТКИ</h1>
          <p>Контроль остатков вариантов, ручные корректировки и экспорт в Excel.</p>
        </div>
        <button className="gold-button admin-stock-export-button" type="button" onClick={handleExport} disabled={isExporting}>
          {isExporting ? 'Экспорт...' : 'Экспорт Excel'}
        </button>
      </section>

      <section className="admin-dashboard-grid admin-dashboard-grid--stats">
        <article className="admin-stat-card"><p>Всего остатков</p><strong>{totalStock}</strong><small>Все варианты</small></article>
        <article className="admin-stat-card"><p>Мало на складе</p><strong>{lowStock}</strong><small>5 или меньше</small></article>
        <article className="admin-stat-card"><p>Нет в наличии</p><strong>{outOfStock}</strong><small>Требует внимания</small></article>
        <article className="admin-stat-card"><p>Вариантов</p><strong>{rows.length}</strong><small>Отслеживаемые SKU</small></article>
      </section>

      {(error || success) && <p className={`state-text ${error ? 'danger' : 'success'}`}>{error || success}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Товар</th>
              <th>Категория</th>
              <th>Коллекция</th>
              <th>Вариант</th>
              <th>SKU</th>
              <th>Остаток</th>
              <th>Статус</th>
              <th>Комментарий</th>
              <th>Сохранить</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ product, variant }) => {
              const draft = getDraft(variant);
              const state = stockState(Number(draft.stock));
              const variantName = [variant.size, variant.color].filter(Boolean).join(' / ') || 'Стандарт';

              return (
                <tr key={variant.id}>
                  <td><strong>{product.name}</strong><span>{product.status}</span></td>
                  <td>{product.category?.name || '-'}</td>
                  <td>{product.collection?.name || '-'}</td>
                  <td>{variantName}</td>
                  <td>{variant.sku}</td>
                  <td>
                    <input min="0" type="number" value={draft.stock} onChange={(event) => updateDraft(variant.id, 'stock', event.target.value)} />
                  </td>
                  <td><span className={`stock-status ${state}`}>{stockLabel(Number(draft.stock))}</span></td>
                  <td>
                    <input value={draft.comment} onChange={(event) => updateDraft(variant.id, 'comment', event.target.value)} placeholder="Причина" />
                  </td>
                  <td><button className="admin-icon-action" type="button" onClick={() => handleSave(variant)}>Сохранить</button></td>
                </tr>
              );
            })}
            {!isLoading && rows.length === 0 && <tr><td colSpan="9">Варианты не найдены.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
