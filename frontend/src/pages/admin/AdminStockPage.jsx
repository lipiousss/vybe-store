import React, { useEffect, useMemo, useState } from 'react';
import { useAdminStockStore } from '../../store/adminStockStore.js';

function flattenStock(products) {
  return products.flatMap((product) =>
    (product.variants || []).map((variant) => ({
      product,
      variant,
    })),
  );
}

function stockState(stock) {
  if (stock === 0) return 'out';
  if (stock <= 5) return 'low';
  return 'available';
}

function stockLabel(stock) {
  if (stock === 0) return 'out of stock';
  if (stock <= 5) return 'low stock';
  return 'available';
}

export default function AdminStockPage() {
  const { stockItems, fetchStock, updateStock, exportStock, isLoading, error, success, clearMessages } = useAdminStockStore();
  const [drafts, setDrafts] = useState({});
  const rows = useMemo(() => flattenStock(stockItems), [stockItems]);

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
      [variantId]: {
        ...(current[variantId] || {}),
        [field]: value,
      },
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
          <p className="eyebrow">Stock Ledger</p>
          <h1>Учёт остатков</h1>
          <p>Редактируйте складские остатки по вариантам и выгружайте таблицу в Excel.</p>
        </div>
        <button className="gold-button" type="button" onClick={exportStock} disabled={isLoading}>
          Export Excel
        </button>
      </section>

      {(error || success) && <p className={`state-text ${error ? 'danger' : 'success'}`}>{error || success}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Collection</th>
              <th>Size</th>
              <th>Color</th>
              <th>SKU</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ product, variant }) => {
              const draft = getDraft(variant);
              const state = stockState(Number(draft.stock));

              return (
                <tr key={variant.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <span>{product.status}</span>
                  </td>
                  <td>{product.category?.name || '—'}</td>
                  <td>{product.collection?.name || '—'}</td>
                  <td>{variant.size || '—'}</td>
                  <td>{variant.color || '—'}</td>
                  <td>{variant.sku}</td>
                  <td>
                    <input
                      min="0"
                      type="number"
                      value={draft.stock}
                      onChange={(event) => updateDraft(variant.id, 'stock', event.target.value)}
                    />
                  </td>
                  <td><span className={`stock-status ${state}`}>{stockLabel(Number(draft.stock))}</span></td>
                  <td>
                    <input
                      value={draft.comment}
                      onChange={(event) => updateDraft(variant.id, 'comment', event.target.value)}
                      placeholder="Reason"
                    />
                  </td>
                  <td>
                    <button className="ghost-button small" type="button" onClick={() => handleSave(variant)}>
                      Save
                    </button>
                  </td>
                </tr>
              );
            })}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan="10">No variants found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
