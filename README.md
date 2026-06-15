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

### Full VPS Deployment

For the most stable diploma preview, deploy the whole project on one VPS with Docker:

- Frontend: Nginx production build
- Backend: Node.js/Express
- Database: PostgreSQL Docker volume
- Uploads: `backend/uploads` bind-mounted into the backend container
- Public API path: `/api`
- Public uploads path: `/uploads`

Production files:

- `docker-compose.production.yml`
- `docker-compose.caddy.yml` for optional HTTPS/domain mode
- `.env.production.example`
- `Caddyfile`
- `frontend/Dockerfile.production`
- `frontend/nginx.production.conf`
- `docs/VPS_DEPLOYMENT.md`
- `docs/HTTPS_CADDY_DEPLOYMENT.md`

Quick VPS start:

```bash
cp .env.production.example .env.production
# edit .env.production: passwords, JWT_SECRET, CLIENT_URL
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

Open:

- Site: `http://YOUR_SERVER_IP`
- Health: `http://YOUR_SERVER_IP/health`

For a full step-by-step guide, use `docs/VPS_DEPLOYMENT.md`.

For a domain with HTTPS, point the domain to the VPS and use `docs/HTTPS_CADDY_DEPLOYMENT.md`.

### Frontend On Netlify

Use these Netlify settings:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`

Frontend environment variables:

```env
VITE_API_URL=https://YOUR_BACKEND_DOMAIN/api
```

The file `frontend/public/_redirects` is included so direct React Router URLs such as `/catalog`, `/profile` and `/admin` work on Netlify.

### Backend On Render Or Railway

Use these hosting settings:

- Root directory: `backend`
- Build command: `npm install && npx prisma generate`
- Start command: `npm start`

Backend environment variables:

```env
DATABASE_URL=production PostgreSQL URL
JWT_SECRET=strong secret
CLIENT_URL=https://YOUR_NETLIFY_DOMAIN
PORT=4000
RUN_SEED_ON_START=false
RUN_SEED_FORCE=false
SEED_FORCE=false
```

`CLIENT_URL` can contain one or more origins separated by commas:

```env
CLIENT_URL=http://localhost:5173,https://your-site.netlify.app
```

Some platforms provide `PORT` automatically. In that case, use the platform value.

### Database

Use PostgreSQL on Render, Railway or Supabase.

Run migrations:

```bash
npx prisma migrate deploy
```

Run seed:

```bash
npm run prisma:seed
```

If the hosting plan does not provide a shell, set `RUN_SEED_ON_START=true` only for a deliberate one-time seed. Keep it `false` for normal redeploys. Use `RUN_SEED_FORCE=true` and `SEED_FORCE=true` only when you intentionally want to recreate demo data and overwrite product data.

### Uploads Storage

Local uploaded files are stored in `backend/uploads`. The VPS production compose file bind-mounts this folder into the backend container, so uploaded files survive container rebuilds and are served through `/uploads`. For a larger production version, use Cloudinary, S3 or another object storage service.

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
