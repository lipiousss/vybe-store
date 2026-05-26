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
  if (stock === 0) return 'Out of Stock';
  if (stock <= 2) return 'Critical';
  if (stock <= 5) return 'Low Stock';
  return 'Available';
}

export default function AdminStockPage() {
  const { stockItems, fetchStock, updateStock, exportStock, isLoading, error, success, clearMessages } = useAdminStockStore();
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

  return (
    <div className="admin-stock-page">
      <section className="admin-page-head">
        <div>
          <p className="section-label">Inventory</p>
          <h1>INVENTORY</h1>
          <p>Track variant stock, low stock alerts, manual corrections and Excel export.</p>
        </div>
        <button className="gold-button" type="button" onClick={exportStock} disabled={isLoading}>Export Excel</button>
      </section>

      <section className="admin-dashboard-grid admin-dashboard-grid--stats">
        <article className="admin-stat-card"><p>Total Stock</p><strong>{totalStock}</strong><small>All variants</small></article>
        <article className="admin-stat-card"><p>Low Stock</p><strong>{lowStock}</strong><small>5 or less</small></article>
        <article className="admin-stat-card"><p>Out of Stock</p><strong>{outOfStock}</strong><small>Requires attention</small></article>
        <article className="admin-stat-card"><p>Variants</p><strong>{rows.length}</strong><small>Tracked SKUs</small></article>
      </section>

      {(error || success) && <p className={`state-text ${error ? 'danger' : 'success'}`}>{error || success}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Collection</th>
              <th>Variant</th>
              <th>SKU</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Comment</th>
              <th>Save</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ product, variant }) => {
              const draft = getDraft(variant);
              const state = stockState(Number(draft.stock));
              const variantName = [variant.size, variant.color].filter(Boolean).join(' / ') || 'Default';

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
                    <input value={draft.comment} onChange={(event) => updateDraft(variant.id, 'comment', event.target.value)} placeholder="Reason" />
                  </td>
                  <td><button className="admin-icon-action" type="button" onClick={() => handleSave(variant)}>Save</button></td>
                </tr>
              );
            })}
            {!isLoading && rows.length === 0 && <tr><td colSpan="9">No variants found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
