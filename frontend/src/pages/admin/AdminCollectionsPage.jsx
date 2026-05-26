import React, { useEffect, useState } from 'react';
import { useAdminCollectionStore } from '../../store/adminCollectionStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const emptyForm = {
  id: null,
  name: '',
  description: '',
  image: '',
  isActive: true,
};

export default function AdminCollectionsPage() {
  const { collections, fetchCollections, saveCollection, deleteCollection, isLoading, error, success, clearMessages } = useAdminCollectionStore();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchCollections().catch(() => {});
  }, [fetchCollections]);

  function updateField(field, value) {
    clearMessages();
    setForm((current) => ({ ...current, [field]: value }));
  }

  function editCollection(collection) {
    setForm({
      id: collection.id,
      name: collection.name || '',
      description: collection.description || '',
      image: collection.image || '',
      isActive: collection.isActive,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await saveCollection({
      name: form.name,
      description: form.description,
      image: form.image,
      isActive: form.isActive,
    }, form.id);
    setForm(emptyForm);
  }

  async function handleDelete(collection) {
    if (!window.confirm(`Delete collection "${collection.name}"?`)) return;
    await deleteCollection(collection.id);
  }

  return (
    <div className="admin-collections-page">
      <section className="admin-page-head">
        <div>
          <p className="eyebrow">Collections</p>
          <h1>COLLECTIONS</h1>
          <p>Manage catalogue drops and archive groups used by product cards and public pages.</p>
        </div>
      </section>

      {(error || success) && <p className={`state-text ${error ? 'danger' : 'success'}`}>{error || success}</p>}

      <section className="admin-crud-layout">
        <article className="admin-panel">
          <header className="admin-panel__head"><div><p className="section-label">Collection List</p><h2>Existing drops</h2></div></header>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Name</th><th>Slug</th><th>Products</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {collections.map((collection) => (
                  <tr key={collection.id}>
                    <td><img className="admin-table-image" src={mediaUrl(collection.image, '/images/placeholders/product-placeholder.png')} alt={collection.name} /></td>
                    <td>{collection.name}</td>
                    <td>{collection.slug}</td>
                    <td>{collection._count?.products || 0}</td>
                    <td><span className={`admin-status ${collection.isActive ? 'active' : 'draft'}`}>{collection.isActive ? 'ACTIVE' : 'INACTIVE'}</span></td>
                    <td className="admin-row-actions">
                      <button className="admin-icon-action" type="button" onClick={() => editCollection(collection)}>Edit</button>
                      <button className="admin-icon-action danger" type="button" onClick={() => handleDelete(collection)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {collections.length === 0 && <tr><td colSpan="6">No collections yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <form className="admin-panel admin-entity-form" onSubmit={handleSubmit}>
          <header className="admin-panel__head"><div><p className="section-label">{form.id ? 'Edit Collection' : 'New Collection'}</p><h2>Drop profile</h2></div></header>
          <label>Name<input value={form.name} onChange={(event) => updateField('name', event.target.value)} required /></label>
          <label>Description<textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} /></label>
          <label>Image URL<input value={form.image} onChange={(event) => updateField('image', event.target.value)} /></label>
          <label className="check-row"><input type="checkbox" checked={form.isActive} onChange={(event) => updateField('isActive', event.target.checked)} /> Active</label>
          <div className="admin-upload-preview">
            <img src={mediaUrl(form.image, '/images/placeholders/product-placeholder.png')} alt={form.name || 'Collection preview'} />
          </div>
          <div className="admin-form-actions">
            <button className="gold-button" type="submit" disabled={isLoading}>{form.id ? 'Save Collection' : 'Create Collection'}</button>
            {form.id && <button className="ghost-button" type="button" onClick={() => setForm(emptyForm)}>Cancel</button>}
          </div>
        </form>
      </section>
    </div>
  );
}
