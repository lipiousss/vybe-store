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
    if (!window.confirm(`Удалить категорию "${category.name}"?`)) return;
    await deleteCategory(category.id);
  }

  return (
    <div className="admin-categories-page">
      <section className="admin-page-head">
        <div>
          <p className="eyebrow">Категории</p>
          <h1>ДЕРЕВО КАТЕГОРИЙ</h1>
          <p>Управление родительскими и дочерними категориями. Категории с товарами или вложенными разделами защищены от удаления.</p>
        </div>
      </section>

      {(error || success) && <p className={`state-text ${error ? 'danger' : 'success'}`}>{error || success}</p>}

      <section className="admin-crud-layout">
        <article className="admin-panel">
          <header className="admin-panel__head"><div><p className="section-label">Список категорий</p><h2>Пути каталога</h2></div></header>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Название</th><th>Родитель</th><th>Дочерние</th><th>Товары</th><th>Действия</th></tr></thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.parent?.name || '-'}</td>
                    <td>{category._count?.children || category.children?.length || 0}</td>
                    <td>{category._count?.products || 0}</td>
                    <td className="admin-row-actions">
                      <button className="admin-icon-action" type="button" onClick={() => editCategory(category)}>Изменить</button>
                      <button className="admin-icon-action danger" type="button" onClick={() => handleDelete(category)}>Удалить</button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && <tr><td colSpan="5">Категорий пока нет.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <form className="admin-panel admin-entity-form" onSubmit={handleSubmit}>
          <header className="admin-panel__head"><div><p className="section-label">{form.id ? 'Редактирование' : 'Новая категория'}</p><h2>Профиль категории</h2></div></header>
          <label>Название<input value={form.name} onChange={(event) => updateField('name', event.target.value)} required /></label>
          <label>Родительская категория
            <select value={form.parentId} onChange={(event) => updateField('parentId', event.target.value)}>
              <option value="">Без родителя</option>
              {parentOptions.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label>Описание<textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} /></label>
          <label>URL изображения<input value={form.image} onChange={(event) => updateField('image', event.target.value)} /></label>
          <div className="admin-upload-preview">
            <img src={mediaUrl(form.image, '/images/placeholders/product-placeholder.png')} alt={form.name || 'Предпросмотр категории'} />
          </div>
          <div className="admin-form-actions">
            <button className="gold-button" type="submit" disabled={isLoading}>{form.id ? 'Сохранить категорию' : 'Создать категорию'}</button>
            {form.id && <button className="ghost-button" type="button" onClick={() => setForm(emptyForm)}>Отмена</button>}
          </div>
        </form>
      </section>
    </div>
  );
}
