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
    if (!window.confirm(`Удалить коллекцию "${collection.name}"?`)) return;
    await deleteCollection(collection.id);
  }

  return (
    <div className="admin-collections-page">
      <section className="admin-page-head">
        <div>
          <p className="eyebrow">Коллекции</p>
          <h1>КОЛЛЕКЦИИ</h1>
          <p>Управление дропами каталога и архивными группами для витрины.</p>
        </div>
      </section>

      {(error || success) && <p className={`state-text ${error ? 'danger' : 'success'}`}>{error || success}</p>}

      <section className="admin-crud-layout">
        <article className="admin-panel">
          <header className="admin-panel__head"><div><p className="section-label">Список коллекций</p><h2>Активные дропы</h2></div></header>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Фото</th><th>Название</th><th>Slug</th><th>Товаров</th><th>Статус</th><th>Действия</th></tr></thead>
              <tbody>
                {collections.map((collection) => (
                  <tr key={collection.id}>
                    <td><img className="admin-table-image" src={mediaUrl(collection.image, '/images/placeholders/product-placeholder.png')} alt={collection.name} /></td>
                    <td>{collection.name}</td>
                    <td>{collection.slug}</td>
                    <td>{collection._count?.products || 0}</td>
                    <td><span className={`admin-status ${collection.isActive ? 'active' : 'draft'}`}>{collection.isActive ? 'Активна' : 'Скрыта'}</span></td>
                    <td className="admin-row-actions">
                      <button className="admin-icon-action" type="button" onClick={() => editCollection(collection)}>Изменить</button>
                      <button className="admin-icon-action danger" type="button" onClick={() => handleDelete(collection)}>Удалить</button>
                    </td>
                  </tr>
                ))}
                {collections.length === 0 && <tr><td colSpan="6">Коллекций пока нет.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <form className="admin-panel admin-entity-form" onSubmit={handleSubmit}>
          <header className="admin-panel__head"><div><p className="section-label">{form.id ? 'Редактирование' : 'Новая коллекция'}</p><h2>Профиль дропа</h2></div></header>
          <label>Название<input value={form.name} onChange={(event) => updateField('name', event.target.value)} required /></label>
          <label>Описание<textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} /></label>
          <label>URL изображения<input value={form.image} onChange={(event) => updateField('image', event.target.value)} /></label>
          <label className="check-row"><input type="checkbox" checked={form.isActive} onChange={(event) => updateField('isActive', event.target.checked)} /> Активна</label>
          <div className="admin-upload-preview">
            <img src={mediaUrl(form.image, '/images/placeholders/product-placeholder.png')} alt={form.name || 'Предпросмотр коллекции'} />
          </div>
          <div className="admin-form-actions">
            <button className="gold-button" type="submit" disabled={isLoading}>{form.id ? 'Сохранить коллекцию' : 'Создать коллекцию'}</button>
            {form.id && <button className="ghost-button" type="button" onClick={() => setForm(emptyForm)}>Отмена</button>}
          </div>
        </form>
      </section>
    </div>
  );
}
