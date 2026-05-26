import React, { useEffect, useMemo, useState } from 'react';
import { useAdminCategoryStore } from '../../store/adminCategoryStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const emptyForm = {
  id: null,
  name: '',
  description: '',
  image: '',
  parentId: '',
};

export default function AdminCategoriesPage() {
  const { categories, fetchCategories, saveCategory, deleteCategory, isLoading, error, success, clearMessages } = useAdminCategoryStore();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchCategories().catch(() => {});
  }, [fetchCategories]);

  const parentOptions = useMemo(() => categories.filter((category) => category.id !== form.id), [categories, form.id]);

  function updateField(field, value) {
    clearMessages();
    setForm((current) => ({ ...current, [field]: value }));
  }

  function editCategory(category) {
    setForm({
      id: category.id,
      name: category.name || '',
      description: category.description || '',
      image: category.image || '',
      parentId: category.parentId || '',
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await saveCategory({
      name: form.name,
      description: form.description,
      image: form.image,
      parentId: form.parentId || null,
    }, form.id);
    setForm(emptyForm);
  }

  async function handleDelete(category) {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    await deleteCategory(category.id);
  }

  return (
    <div className="admin-categories-page">
      <section className="admin-page-head">
        <div>
          <p className="eyebrow">Categories</p>
          <h1>CATEGORY TREE</h1>
          <p>Manage parent and child categories. Protected categories cannot be deleted while products or children are linked.</p>
        </div>
      </section>

      {(error || success) && <p className={`state-text ${error ? 'danger' : 'success'}`}>{error || success}</p>}

      <section className="admin-crud-layout">
        <article className="admin-panel">
          <header className="admin-panel__head"><div><p className="section-label">Category List</p><h2>Catalogue paths</h2></div></header>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Parent</th><th>Children</th><th>Products</th><th>Actions</th></tr></thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.parent?.name || '-'}</td>
                    <td>{category._count?.children || category.children?.length || 0}</td>
                    <td>{category._count?.products || 0}</td>
                    <td className="admin-row-actions">
                      <button className="admin-icon-action" type="button" onClick={() => editCategory(category)}>Edit</button>
                      <button className="admin-icon-action danger" type="button" onClick={() => handleDelete(category)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && <tr><td colSpan="5">No categories yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <form className="admin-panel admin-entity-form" onSubmit={handleSubmit}>
          <header className="admin-panel__head"><div><p className="section-label">{form.id ? 'Edit Category' : 'New Category'}</p><h2>Category profile</h2></div></header>
          <label>Name<input value={form.name} onChange={(event) => updateField('name', event.target.value)} required /></label>
          <label>Parent category
            <select value={form.parentId} onChange={(event) => updateField('parentId', event.target.value)}>
              <option value="">No parent</option>
              {parentOptions.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label>Description<textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} /></label>
          <label>Image URL<input value={form.image} onChange={(event) => updateField('image', event.target.value)} /></label>
          <div className="admin-upload-preview">
            <img src={mediaUrl(form.image, '/images/placeholders/product-placeholder.png')} alt={form.name || 'Category preview'} />
          </div>
          <div className="admin-form-actions">
            <button className="gold-button" type="submit" disabled={isLoading}>{form.id ? 'Save Category' : 'Create Category'}</button>
            {form.id && <button className="ghost-button" type="button" onClick={() => setForm(emptyForm)}>Cancel</button>}
          </div>
        </form>
      </section>
    </div>
  );
}
