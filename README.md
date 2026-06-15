# VYBE Store

VYBE Store is a diploma project: a dark fantasy online store for designer products. The project includes a public storefront, catalogue, collectibles, artworks archive, user profile, cart, demo checkout, orders, uploads and an admin command dashboard.

## Stack

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

## Local Run With Docker

```bash
docker compose up --build
```

Local URLs:

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Health check: http://localhost:4000/health
- pgAdmin: http://localhost:5050

Test users:

- Admin: `admin@vybe.com` / `Admin1234`
- User: `user@vybe.com` / `User1234`

If the database is empty, run migrations and seed inside the backend container:

```bash
docker compose exec backend npm run prisma:migrate
docker compose exec backend npm run prisma:seed
```

## Useful Commands

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run preview
```

Backend:

```bash
cd backend
npm run dev
npm start
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

## Deployment

Production uses one clean VPS architecture:

- Public URL: `http://109.196.100.48`
- Public entrypoint: frontend Nginx container on port `80`
- `/` serves the Vite production build
- `/api/` proxies to the internal backend service on port `4000`
- `/uploads/` proxies to backend uploaded files
- Backend is not exposed directly
- PostgreSQL is internal only and stores data in a persistent Docker volume

Production files:

- `docker-compose.production.yml`
- `.env.production.example`
- `frontend/Dockerfile.production`
- `frontend/nginx.production.conf`
- `backend/Dockerfile`
- `docs/VPS_DEPLOYMENT.md`

Quick VPS start:

```bash
cp .env.production.example .env.production
# edit .env.production: POSTGRES_PASSWORD and JWT_SECRET
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

Open:

- Site: `http://109.196.100.48`
- Health: `http://109.196.100.48/health`
- API: `http://109.196.100.48/api/products`

For the full server guide, use `docs/VPS_DEPLOYMENT.md`.

Uploaded files are stored in `backend/uploads`. The production compose file bind-mounts this folder into the backend container, so uploaded files survive container rebuilds and are served through `/uploads`.

## Project Structure

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

## Database Dump

To save a local SQL dump:

```bash
docker compose exec -T postgres pg_dump -U vybe -d vybe_store > backend/database-dumps/vybe_store.sql
```
