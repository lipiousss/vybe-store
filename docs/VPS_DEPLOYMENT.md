# VYBE VPS Production Deployment

This is the only production deployment guide for the VYBE store.

Target public URL:

```text
http://109.196.100.48
```

## Architecture

- Public entrypoint: frontend Nginx container on port `80`.
- `/` serves the Vite production build.
- `/api/` proxies to the internal backend service on port `4000`.
- `/uploads/` proxies to the internal backend uploads directory.
- Backend is not exposed to the public internet.
- PostgreSQL is not exposed to the public internet.
- Persistent database data lives in the Docker volume `vybe_postgres_data`.
- Persistent uploaded files live in `backend/uploads` on the VPS.

## Production Files

- `docker-compose.production.yml`
- `.env.production.example`
- `frontend/Dockerfile.production`
- `frontend/nginx.production.conf`
- `backend/Dockerfile`

Local development still uses `docker-compose.yml`.

## Prepare Server

Use Ubuntu 24.04 LTS on the VPS.

```bash
apt update
apt install -y ca-certificates curl git
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl restart docker
```

Optional Docker mirrors for unstable Docker Hub access:

```bash
mkdir -p /etc/docker
cat >/etc/docker/daemon.json <<'JSON'
{
  "registry-mirrors": [
    "https://mirror.gcr.io",
    "https://dockerhub.timeweb.cloud",
    "https://hub-mirror.c.163.com"
  ],
  "dns": ["8.8.8.8", "1.1.1.1"]
}
JSON
systemctl restart docker
```

Open only the required public ports in the provider firewall:

- `22/tcp` for SSH
- `80/tcp` for the site
- `443/tcp` only when HTTPS is added later

## Deploy

```bash
cd /opt
git clone https://github.com/lipiousss/vybe-store.git
cd /opt/vybe-store
cp .env.production.example .env.production
nano .env.production
```

Production environment:

```env
POSTGRES_DB=vybe_store
POSTGRES_USER=vybe
POSTGRES_PASSWORD=change_this_to_a_long_database_password

JWT_SECRET=change_this_to_a_long_random_jwt_secret

CLIENT_URL=http://109.196.100.48
FRONTEND_URL=http://109.196.100.48
CORS_ORIGIN=http://109.196.100.48
VITE_API_URL=/api
HTTP_PORT=80

RUN_SEED_ON_START=false
RUN_SEED_FORCE=false
SEED_FORCE=false
```

Start production:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

## Verify

```bash
docker compose --env-file .env.production -f docker-compose.production.yml ps
curl -I http://localhost
curl http://localhost/health
curl http://localhost/api/products | head -c 300
curl -I http://109.196.100.48
curl http://109.196.100.48/health
```

Expected public ports:

```text
frontend: 0.0.0.0:80->80/tcp
backend: no public ports
postgres: no public ports
```

## Update

```bash
cd /opt/vybe-store
git pull
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

After the first demo seed, keep these values to preserve admin-created data:

```env
RUN_SEED_ON_START=false
RUN_SEED_FORCE=false
SEED_FORCE=false
```

## Logs And Restart

```bash
docker compose --env-file .env.production -f docker-compose.production.yml logs -f frontend
docker compose --env-file .env.production -f docker-compose.production.yml logs -f backend
docker compose --env-file .env.production -f docker-compose.production.yml restart
```

## Backup

Database:

```bash
mkdir -p backend/database-dumps
docker exec vybe-postgres-prod pg_dump -U vybe -d vybe_store --clean --if-exists --create --column-inserts > backend/database-dumps/vybe_store_prod_backup.sql
```

Uploads:

```bash
tar -czf backend/database-dumps/vybe_uploads_backup.tar.gz backend/uploads
```
