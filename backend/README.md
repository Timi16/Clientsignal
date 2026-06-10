# ClientSignal Backend

Standalone NestJS API for ClientSignal.

## Stack

- NestJS + TypeScript
- PostgreSQL
- Drizzle ORM
- Argon2id password hashing
- JWT access tokens
- HttpOnly refresh-token cookies
- Role guards for `client`, `attorney`, and `admin`

## Run

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

The API starts on `http://localhost:4000` by default.

## Routes

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/users/me`
- `GET /api/users` admin only

Admin self-registration is disabled unless `ALLOW_ADMIN_REGISTRATION=true`.
