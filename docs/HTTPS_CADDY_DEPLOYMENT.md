# VYBE HTTPS Deployment With Caddy

Use this only after a real domain points to the VPS IP. HTTPS certificates are issued for domains, not for the raw IP address.

## 1. DNS

Create DNS records:

```text
A     @      194.87.187.168
A     www    194.87.187.168
```

Wait until DNS resolves to the VPS.

## 2. Environment

Edit `.env.production` on the VPS:

```env
CLIENT_URL=https://your-domain.ru
FRONTEND_URL=https://your-domain.ru
VITE_API_URL=/api

# Keep the frontend container private on the host.
HTTP_PORT=127.0.0.1:8080

SITE_DOMAIN=your-domain.ru
SITE_EMAIL=admin@vybe.com
```

## 3. Start With Caddy

```bash
cd /opt/vybe-store
git pull
docker compose --env-file .env.production -f docker-compose.production.yml -f docker-compose.caddy.yml up -d --build
```

Caddy listens on public ports `80` and `443`, gets a TLS certificate automatically, and proxies the app to the internal frontend container.

## 4. Check

```bash
docker compose --env-file .env.production -f docker-compose.production.yml -f docker-compose.caddy.yml ps
docker logs vybe-caddy-prod --tail=100
curl -I https://your-domain.ru
curl https://your-domain.ru/health
```

Open:

```text
https://your-domain.ru
```

## 5. Update Workflow

For normal updates:

```bash
cd /opt/vybe-store
git pull
docker compose --env-file .env.production -f docker-compose.production.yml -f docker-compose.caddy.yml up -d --build
```
