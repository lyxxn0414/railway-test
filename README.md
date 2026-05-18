# Railway Test

A minimal Node.js + PostgreSQL app for Railway.

## Deploy on Railway

1. Create a new project on [Railway](https://railway.app)
2. Add a **PostgreSQL** service
3. Add a **GitHub Repo** service pointing to this repo
4. Railway will auto-set `DATABASE_URL` — just link the PostgreSQL service to your app service

## Endpoints

- `GET /` — Returns visit count (increments on each visit)
- `GET /health` — Health check
