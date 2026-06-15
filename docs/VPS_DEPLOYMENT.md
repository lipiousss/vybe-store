# VYBE VPS Deployment

This guide deploys the full VYBE store on one VPS with Docker:

- Frontend: Nginx serves the Vite production build.
- Backend: Node.js + Express.
- Database: PostgreSQL in a persistent Docker volume.
- Uploads: stored in a persistent Docker volume.
- Public API path: `/api`.
- Public uploads path: `/uploads`.

## Recommended Hosting

Use a small VPS with Docker support. For a diploma demo, 1-2 CPU cores, 2 GB RAM and 20+ GB SSD is enough.

The most reliable option for users in Russia is a VPS from a provider available in Russia or reachable without Netlify/Render restrictions. Examples: Timeweb Cloud, Selectel, Reg.ru VPS, Beget VPS, FirstVDS, RuVDS. Any Ubuntu 22.04/24.04 VPS with Docker works.

## Files Used

- `docker-compose.production.yml`
- `.env.production.example`
- `frontend/Dockerfile.production`
- `frontend/nginx.production.conf`

Local development still uses the existing `docker-compose.yml`.

## 1. Prepare The VPS

Install Docker and Git on Ubuntu:

```bash
sudo apt update
sudo apt install -y ca-certificates curl git
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
```

Open ports:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw enable
```

## 2. Upload The Project

Clone the repository:

```bash
git clone https://github.com/YOUR_GITHUB_USER/vybe-store.git
cd vybe-store
```

Or upload the current folder with `scp`/SFTP.

## 3. Create Production Env

```bash
cp .env.production.example .env.production
nano .env.production
```

Minimum values:

```env
POSTGRES_DB=vybe_store
POSTGRES_USER=vybe
POSTGRES_PASSWORD=strong_database_password
JWT_SECRET=long_random_jwt_secret
CLIENT_URL=http://YOUR_SERVER_IP
VITE_API_URL=/api
HTTP_PORT=80
RUN_SEED_ON_START=false
RUN_SEED_FORCE=false
SEED_FORCE=false
```

If you later connect a domain with HTTPS, change `CLIENT_URL` to `https://your-domain.ru` and redeploy.

## 4. Start Production Containers

```bash
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

Check:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml ps
docker compose --env-file .env.production -f docker-compose.production.yml logs -f backend
```

Open:

```text
http://YOUR_SERVER_IP
http://YOUR_SERVER_IP/health
```

## 5. Restore Local Database And Images

If you need the exact local data and uploaded images, use the backup created in:

```text
backend/database-dumps/vybe-full-backup-20260615-031514/vybe-full-backup-20260615-031514-portable.zip
```

Copy the zip to the VPS, unzip it, then restore the SQL dump:

```bash
unzip vybe-full-backup-20260615-031514-portable.zip
cd package
docker compose --env-file ../.env.production -f ../docker-compose.production.yml up -d postgres
docker exec -i vybe-postgres-prod psql -U vybe -d postgres < vybe_store_full_backup.sql
```

Copy uploads into the backend uploads volume:

```bash
docker cp backend/uploads/. vybe-backend-prod:/app/uploads/
```

Restart backend after copying uploads:

```bash
docker compose --env-file ../.env.production -f ../docker-compose.production.yml restart backend frontend
```

## 6. Update Workflow

After pushing code changes to GitHub:

```bash
git pull
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

Do not enable seed on normal redeploys. Keep:

```env
RUN_SEED_ON_START=false
RUN_SEED_FORCE=false
SEED_FORCE=false
```

## 7. Restart / Logs / Backup

Restart:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml restart
```

Logs:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml logs -f backend
docker compose --env-file .env.production -f docker-compose.production.yml logs -f frontend
```

Database backup on the VPS:

```bash
mkdir -p backend/database-dumps
docker exec vybe-postgres-prod pg_dump -U vybe -d vybe_store --clean --if-exists --create --column-inserts > backend/database-dumps/vybe_store_prod_backup.sql
```

Uploads backup:

```bash
docker cp vybe-backend-prod:/app/uploads backend/uploads-backup
```
