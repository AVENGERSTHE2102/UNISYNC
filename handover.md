# UniSync Backend Handover

## Current Status

The backend has been rebuilt around a layered CommonJS Express structure and is now targeting Supabase Postgres instead of the earlier mixed SQLite/Firebase direction.

Implemented layers:

- `src/routes`
- `src/controllers`
- `src/services`
- `src/repositories`
- `src/models`
- `src/middleware`
- `src/utils`
- `src/validators`
- `src/tests`
- `src/realtime` scaffold only

The app bootstrap is now split into:

- [src/app.js](/Users/aditya/Developer/Web_dev/UniSync/src/app.js)
- [src/server.js](/Users/aditya/Developer/Web_dev/UniSync/src/server.js)
- [src/routes/index.js](/Users/aditya/Developer/Web_dev/UniSync/src/routes/index.js)

The backend is now API-only by default:

- static frontend serving is disabled unless `SERVE_STATIC=true`
- frontend and backend can be containerized and deployed separately

## What Was Rebuilt

First-wave domains are implemented with the new route -> controller -> service -> repository flow:

- Auth / Users
- Communities
- Threads
- Replies
- Events
- Jobs

Public routes preserved:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/communities`
- `POST /api/communities`
- `GET /api/communities/:communityId/threads`
- `POST /api/communities/:communityId/threads`
- `GET /api/threads/:threadId/replies`
- `POST /api/threads/:threadId/replies`
- `GET /api/events`
- `POST /api/events`
- `GET /api/jobs`
- `POST /api/jobs`
- `GET /api/mentorships`

Added:

- `GET /api/auth/me`
- `GET /api/health`

## Auth Contract

Firebase assumptions were removed from the backend. The backend now owns authentication:

- password hashing via `bcryptjs`
- JWT issuing via `jsonwebtoken`
- bearer token auth middleware
- role-based authorization middleware

Canonical auth/profile fields:

- `role`: `student | alumni | admin`
- `passwordHash`
- `yearOfStudy`
- `professionalRole`
- `interests` as JSON/JSONB

Frontend was updated in [public/assets/js/app.js](/Users/aditya/Developer/Web_dev/UniSync/public/assets/js/app.js) to use backend login/signup instead of Firebase token exchange.

## Response Contract

Success responses follow:

```json
{
  "ok": true,
  "data": {},
  "message": "optional",
  "code": "optional",
  "meta": {},
  "reqId": "uuid"
}
```

Errors follow:

```json
{
  "ok": false,
  "message": "Error message",
  "code": "ERROR_CODE",
  "meta": {},
  "reqId": "uuid"
}
```

## Supabase / Database Setup

Runtime env setup is documented in [.env.example](/Users/aditya/Developer/Web_dev/UniSync/.env.example).

Important env vars:

- `SUPABASE_DB_URL`
- `JWT_SECRET`
- `PORT`
- `CORS_ORIGIN`
- `DB_SYNC`
- `DB_LOGGING`
- `SERVE_STATIC`

Sequelize CLI config for Supabase is in:

- [config/config.js](/Users/aditya/Developer/Web_dev/UniSync/config/config.js)
- [.sequelizerc](/Users/aditya/Developer/Web_dev/UniSync/.sequelizerc)

Current database definition is migration-driven, not `schema.sql`-driven.

Primary migrations currently aligned to the rebuild:

- [src/migrations/20251014091028-create-user.js](/Users/aditya/Developer/Web_dev/UniSync/src/migrations/20251014091028-create-user.js)
- [src/migrations/20251014091233-create-community.js](/Users/aditya/Developer/Web_dev/UniSync/src/migrations/20251014091233-create-community.js)
- [src/migrations/20251014091322-create-membership.js](/Users/aditya/Developer/Web_dev/UniSync/src/migrations/20251014091322-create-membership.js)
- [src/migrations/20251014091419-create-thread.js](/Users/aditya/Developer/Web_dev/UniSync/src/migrations/20251014091419-create-thread.js)
- [src/migrations/20251014091502-create-reply.js](/Users/aditya/Developer/Web_dev/UniSync/src/migrations/20251014091502-create-reply.js)
- [src/migrations/20251014091552-create-event.js](/Users/aditya/Developer/Web_dev/UniSync/src/migrations/20251014091552-create-event.js)
- [src/migrations/20251014091810-create-job.js](/Users/aditya/Developer/Web_dev/UniSync/src/migrations/20251014091810-create-job.js)

## Rebuild Status

All 7 core business domain phases of the rebuild playbook are now complete:

1. **Auth & Identity**: Complete (JWT-based local auth, password hashing, Express Bearer token middleware, and unified error/success formatting).
2. **Communities + Discussions**: Complete (Create/retrieve communities, thread creation, reply listing/creation).
3. **Events & Jobs**: Complete (CRUD operations, pagination, and role checks).
4. **Mentorship**: Complete (Mentorship model/migrations, matching service, self-matching guards, compatibility scores matching interests, request actions, status changes, and dynamic mentorship UI integration).
5. **Memberships**: Complete (Join/leave endpoints, composite primary keys in model, content posting gated by community membership).
6. **Realtime Chat**: Complete (Socket.io room isolation, stateful Redis presence indicators, and front-end chat views).
7. **Resource Uploads**: Complete (Multer file storage inside `uploads/` directory, metadata persistence, listing, and streaming secure downloads gated by community membership).

## Test Status

The test suite runs using in-memory databases and mocked services to ensure code correctness without requiring external system dependencies.

Last verified result:
- `npm test`
- 9 suites passed
- 38 tests passed

## Recommended Next Steps

1. **Phase 8: Observability & Hardening**: Implement Helmet headers, CORS policies, rate limiting, Pino/Winston http logging, Sentry DSN integration, and graceful process shutdowns.
2. **Supabase Migration**: Run the migrations against the actual target Supabase instance to verify column mappings and sequence compatibility.
3. **Database Seeding**: Build database seeds to populate sample communities, mentorship profiles, and resource records for manual verification.
