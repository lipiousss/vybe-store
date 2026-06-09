import React from 'react';
import { Link } from 'react-router-dom';

const stackItems = [
  'React + Vite',
  'JavaScript',
  'Zustand',
  'Framer Motion',
  'Node.js + Express',
  'PostgreSQL',
  'Prisma ORM',
  'Docker Compose',
  'pgAdmin',
];

const projectNotes = [
  {
    title: 'Концепция',
    text: 'VYBE Store — дипломный проект интернет-магазина дизайнерской продукции в стилистике dark fantasy: одежда, архивные объекты, визуальные фрагменты и лимитированные коллекционные предметы.',
  },
  {
    title: 'Визуальное направление',
    text: 'Интерфейс соединяет премиальную витрину и архив старого веба: тёмные поверхности, потускневшее золото, холодное синее свечение, компактные панели и карточки товаров как артефакты.',
  },
  {
    title: 'Текущий этап',
    text: 'В проекте уже есть Docker-инфраструктура, PostgreSQL, Prisma schema, seed-данные, backend API и frontend с публичными страницами, профилем, корзиной и админкой.',
  },
  {
    title: 'Следующие шаги',
    text: 'Дальнейшая работа может включать продакшен-хранилище файлов, расширенную аналитику, интеграции оплаты и полноценное управление контентом страниц.',
  },
];

export default function ProjectPage() {
  return (
    <main className="project-page">
      <header className="project-topbar">
        <Link to="/" className="project-title-link">VYBE://PROJECT</Link>
        <nav aria-label="Навигация проекта">
          <a href="#overview">Обзор</a>
          <a href="#stack">Стек</a>
          <a href="#roadmap">Архитектура</a>
        </nav>
      </header>

      <div className="project-layout">
        <aside className="project-sidebar">
          <section className="project-widget">
            <h2>[Меню]</h2>
            <Link to="/">Главная</Link>
            <Link to="/catalog">Каталог</Link>
            <Link to="/collectibles">Коллекционные</Link>
            <Link to="/artworks">Артворки</Link>
            <Link to="/about">О нас</Link>
          </section>

          <section className="project-widget">
            <h2>[Статус]</h2>
            <p>Режим: дипломная сборка</p>
            <p>Тема: dark fantasy commerce</p>
            <p>Запуск: Docker Compose</p>
          </section>

          <section className="project-widget">
            <h2>[Этапы]</h2>
            <ol>
              <li>Инфраструктура</li>
              <li>База данных и seed</li>
              <li>Backend API</li>
              <li>Frontend foundation</li>
              <li>Commerce flow</li>
            </ol>
          </section>
        </aside>

        <section className="project-content">
          <div className="project-content-frame">
            <section className="project-hero-panel" id="overview">
              <p className="project-terminal-line">visitor@vybe-store:~$ open project_manifest.txt</p>
              <h1>О проекте</h1>
              <p>
                Эта страница — архив проекта VYBE Store: идея, стек, структура,
                визуальный язык и логика реализации в одном месте.
              </p>
            </section>

            <section className="project-section-grid">
              {projectNotes.map((note) => (
                <article className="project-info-box" key={note.title}>
                  <h2>{note.title}</h2>
                  <p>{note.text}</p>
                </article>
              ))}
            </section>

            <section className="project-panel" id="stack">
              <div className="project-section-heading">
                <span>01</span>
                <h2>Стек</h2>
              </div>
              <div className="project-stack-grid">
                {stackItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </section>

            <section className="project-panel project-split" id="roadmap">
              <div>
                <div className="project-section-heading">
                  <span>02</span>
                  <h2>Архитектура</h2>
                </div>
                <p>
                  Frontend обращается к публичным backend endpoints, Zustand хранит состояние UI
                  и сущностей, Express отдаёт API-модули, а Prisma связывает домен магазина
                  с PostgreSQL.
                </p>
              </div>
              <div className="project-terminal">
                <p>backend/src</p>
                <p>frontend/src</p>
                <p>backend/prisma/schema.prisma</p>
                <p>docker-compose.yml</p>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
