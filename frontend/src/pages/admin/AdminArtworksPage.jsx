import React, { useEffect, useState } from 'react';
import { useAdminArtworkStore } from '../../store/adminArtworkStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const categories = [
  'Night Collection',
  'Armor Concepts',
  'Product Visuals',
  'Posters',
  'Characters',
  'Environment',
];

const emptyForm = {
  id: null,
  title: '',
  description: '',
  image: '',
  category: 'Night Collection',
  tags: '',
  order: 0,
  isActive: true,
};

export default function AdminArtworksPage() {
  const {
    artworks,
    fetchAdminArtworks,
    createArtwork,
    updateArtwork,
    deleteArtwork,
    uploadImage,
    isLoading,
    error,
    success,
    clearMessages,
  } = useAdminArtworkStore();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchAdminArtworks().catch(() => {});
  }, [fetchAdminArtworks]);

  function updateField(field, value) {
    clearMessages();
    setForm((current) => ({ ...current, [field]: value }));
  }

  function editArtwork(artwork) {
    setForm({
      id: artwork.id,
      title: artwork.title || '',
      description: artwork.description || '',
      image: artwork.image || '',
      category: artwork.category || 'Night Collection',
      tags: (artwork.tags || []).join(', '),
      order: artwork.order || 0,
      isActive: artwork.isActive,
    });
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    updateField('image', url);
    event.target.value = '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      image: form.image,
      category: form.category,
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      order: Number(form.order || 0),
      isActive: form.isActive,
    };

    if (form.id) {
      await updateArtwork(form.id, payload);
    } else {
      await createArtwork(payload);
    }

    setForm(emptyForm);
  }

  async function handleDelete(artwork) {
    if (!window.confirm(`Удалить artwork "${artwork.title}"?`)) return;
    await deleteArtwork(artwork.id);
    if (form.id === artwork.id) {
      setForm(emptyForm);
    }
  }

  return (
    <div className="admin-artworks-page">
      <section className="admin-page-head">
        <div>
          <p className="eyebrow">Artworks</p>
          <h1>Visual Archive</h1>
          <p>Добавление, скрытие и редактирование визуального архива VYBE.</p>
        </div>
        <button className="gold-button" type="button" onClick={() => setForm(emptyForm)}>Add Artwork</button>
      </section>

      {(error || success) && <p className={`state-text ${error ? 'danger' : 'success'}`}>{error || success}</p>}

      <section className="artwork-admin-layout">
        <form className="artwork-admin-form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">{form.id ? 'Edit Artwork' : 'New Artwork'}</p>
            <h2>{form.id ? form.title : 'Add Artwork'}</h2>
          </div>
          <label>
            Title
            <input value={form.title} onChange={(event) => updateField('title', event.target.value)} required />
          </label>
          <label>
            Description
            <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} />
          </label>
          <div className="admin-form-grid">
            <label>
              Category
              <select value={form.category} onChange={(event) => updateField('category', event.target.value)}>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <label>
              Order
              <input type="number" value={form.order} onChange={(event) => updateField('order', event.target.value)} />
            </label>
          </div>
          <label>
            Tags
            <input value={form.tags} onChange={(event) => updateField('tags', event.target.value)} placeholder="dark, armor, archive" />
          </label>
          <label className="check-row">
            <input type="checkbox" checked={form.isActive} onChange={(event) => updateField('isActive', event.target.checked)} />
            Active
          </label>
          <label className="admin-upload-zone">
            Upload artwork image
            <input accept="image/jpeg,image/png,image/webp" type="file" onChange={handleUpload} />
          </label>
          {form.image && (
            <div className="admin-upload-preview contain">
              <img src={mediaUrl(form.image, '/images/placeholders/artwork-placeholder.png')} alt={form.title || 'Artwork preview'} />
            </div>
          )}
          <div className="admin-form-actions">
            <button className="gold-button" type="submit" disabled={isLoading}>
              {form.id ? 'Save Artwork' : 'Create Artwork'}
            </button>
          </div>
        </form>

        <div className="admin-artwork-list">
          {artworks.map((artwork) => (
            <article className="admin-artwork-card" key={artwork.id}>
              <div className="admin-upload-preview contain">
                <img src={mediaUrl(artwork.image, '/images/placeholders/artwork-placeholder.png')} alt={artwork.title} />
              </div>
              <div>
                <span className={`admin-blocked-badge ${artwork.isActive ? 'active' : 'blocked'}`}>
                  {artwork.isActive ? 'active' : 'inactive'}
                </span>
                <h3>{artwork.title}</h3>
                <p>{artwork.category}</p>
                <p>{(artwork.tags || []).join(', ')}</p>
              </div>
              <div className="admin-row-actions">
                <button className="ghost-button small" type="button" onClick={() => editArtwork(artwork)}>Edit</button>
                <button className="ghost-button small danger" type="button" onClick={() => handleDelete(artwork)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
