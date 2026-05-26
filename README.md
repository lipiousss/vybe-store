# VYBE Store

VYBE Store — дипломный проект интернет-магазина дизайнерской продукции в стилистике dark fantasy. Проект демонстрирует публичный каталог, коллекционные товары, визуальный архив Artworks, пользовательский профиль, корзину, demo-заказы и административную панель.

## Стек

- Frontend: React, Vite, JavaScript, React Router
- State: Zustand
- Animations: Framer Motion, CSS animations
- Backend: Node.js, Express
- Database: PostgreSQL
- ORM: Prisma
- Uploads: Multer
- Export: XLSX
- Docker: Docker Compose
- DB GUI: pgAdmin

## Запуск через Docker

```bash
docker compose up --build
```

После запуска:

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Health check: http://localhost:4000/health
- pgAdmin: http://localhost:5050

## Тестовые пользователи

- Admin: `admin@vybe.com` / `Admin1234`
- User: `user@vybe.com` / `User1234`

Если база пустая, примените миграции и seed внутри backend-контейнера:

```bash
docker compose exec backend npm run prisma:migrate
docker compose exec backend npm run prisma:seed
```

## Основные возможности

- Главная страница в dark fantasy стиле с EnterScreen и cinematic hero
- Каталог обычных товаров с поиском и фильтрами
- Отдельная страница коллекционных товаров
- Страница товара с вариантами, остатками, избранным и добавлением в корзину
- Visual Archive / Artworks с фильтрами и полноэкранным modal-preview
- Регистрация, вход, JWT-auth, профиль и настройки пользователя
- Загрузка avatar пользователя
- Избранное и корзина с сохранением на backend
- Demo-checkout без платёжной системы
- История заказов пользователя
- Админ-панель:
  - dashboard
  - управление товарами
  - загрузка изображений товаров
  - складской учёт
  - экспорт остатков в Excel
  - управление заказами
  - управление пользователями
  - управление Artworks
  - управление контентными изображениями сайта

## Структура проекта

```text
vybe-store/
  backend/
    prisma/
      schema.prisma
      seed.js
    src/
      config/
      controllers/
      middlewares/
      routes/
      services/
      utils/
      app.js
    uploads/
      avatars/
      products/
      artworks/
      site/
  frontend/
    public/
      images/
        placeholders/
    src/
      api/
      app/
      components/
      pages/
      store/
      styles/
      utils/
  docker-compose.yml
```

## Полезные команды

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
```

Docker:

```bash
docker compose ps
docker compose logs backend
docker compose logs frontend
```

## Данные и uploads

Загруженные файлы сохраняются в `backend/uploads`. Для сохранения текущей базы в репозитории можно сделать SQL dump:

```bash
docker compose exec -T postgres pg_dump -U vybe -d vybe_store > backend/database-dumps/vybe_store.sql
```
