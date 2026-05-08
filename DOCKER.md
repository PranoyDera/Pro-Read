# Docker + Nginx Setup

## What This Runs

- `postgres`: PostgreSQL database
- `backend`: Express API on internal port `5000`
- `frontend`: Next.js app on internal port `3000`
- `nginx`: reverse proxy exposed on host port `8080`

Nginx routes:

- `/` -> frontend
- `/api/*` -> backend

## Start Everything

From project root:

```bash
docker compose up --build -d
```

Open:

- `http://localhost:8080`

## Stop Everything

```bash
docker compose down
```

To also remove database volume:

```bash
docker compose down -v
```

## Useful Logs

```bash
docker compose logs -f nginx
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f postgres
```

## Production Notes

- Change `JWT_SECRET` in `docker-compose.yml`
- Change `POSTGRES_PASSWORD` in `docker-compose.yml`
- If you use managed Postgres with SSL, set `DB_SSL: "true"` for backend
