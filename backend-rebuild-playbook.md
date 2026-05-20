# Backend Rebuild Playbook

## Production-Grade Node.js + Express Architecture
### Deployment-Ready · Security-First · Socket-Safe

---

## 1. Executive Summary
The current codebase is a proof-of-concept with mixed concerns, broken imports, an inconsistent auth contract, and no deployment guardrails. This document provides a decision-complete rebuild plan that fixes every structural gap while preserving all existing API routes consumed by the frontend. The result is a layered, observable, horizontally-scalable service ready for production hosting (Railway / Render / Fly.io).

## 2. Current Gaps & Root Causes

| Gap | Symptom | Root Cause |
|---|---|---|
| Broken bootstrap | index.js crashes at runtime | db not imported; chatHandler missing |
| Auth contract split | Firebase token vs local JWT | No single source of truth for identity |
| Schema drift | authorId vs userId mismatch | Migration and controller written independently |
| DB mismatch | SQLite in prod config | Config overwritten during dev; never reconciled |
| No realtime | Chat models exist, zero socket layer | chatHandler.js never created |
| No error contract | Inconsistent error shapes to frontend | Each controller throws differently |

## 3. Target Architecture
A four-layer architecture with strict one-way dependency flow: Routes → Controllers → Services → Data Access. Nothing in an outer layer imports from an inner concern; all cross-cutting (auth, validation, logging) lives in middleware.

```
┌────────────────────────────────────────────────────────────┐
│  HTTP / WebSocket Ingress  (Express + socket.io)           │
├────────────────────────────────────────────────────────────┤
│  Route Layer       src/routes/                             │
│  Middleware        src/middleware/  (auth, validate, acl)  │
├────────────────────────────────────────────────────────────┤
│  Controller Layer  src/controllers/ (req → service call)   │
├────────────────────────────────────────────────────────────┤
│  Service Layer     src/services/   (business logic)        │
├────────────────────────────────────────────────────────────┤
│  Data Access       src/repositories/ + Sequelize models    │
├────────────────────────────────────────────────────────────┤
│  Infrastructure    PostgreSQL  •  Redis  •  Socket.io      │
└────────────────────────────────────────────────────────────┘
```

### 3.1 Directory Structure
```
src/
├── app.js              # Express factory – no server.listen here
├── server.js           # Binds http.Server + socket.io, calls app()
├── config/
│   ├── database.js     # Sequelize with pg dialect
│   ├── redis.js        # ioredis client singleton
│   └── env.js          # zod-validated process.env
├── routes/
│   ├── index.js        # Mounts all routers under /api
│   ├── auth.routes.js
│   ├── community.routes.js
│   ├── event.routes.js
│   ├── job.routes.js
│   ├── mentorship.routes.js
│   ├── thread.routes.js
│   ├── reply.routes.js
│   └── chat.routes.js
├── controllers/        # Thin: parse req, call service, send res
├── services/           # Business logic, NO req/res objects
├── repositories/       # Sequelize queries, returns plain objects
├── models/             # Sequelize model definitions
├── migrations/
├── middleware/
│   ├── auth.js         # JWT verify → req.user
│   ├── acl.js          # Role-based + ownership checks
│   ├── validate.js     # express-validator wrapper
│   ├── rateLimiter.js  # Redis-backed rate limiter
│   └── errorHandler.js # Unified error shape
├── realtime/
│   ├── index.js        # socket.io server factory
│   ├── chatHandler.js  # Per-room event handlers
│   ├── presence.js     # Online/typing status via Redis
│   └── guards.js       # Socket auth + room membership checks
├── utils/
│   ├── logger.js       # Pino structured logger
│   ├── errors.js       # AppError class hierarchy
│   └── pagination.js
└── tests/
    ├── unit/
    └── integration/
```

## 4. Phased Build Order
Each phase produces a deployable, tested slice. Later phases depend only on contracts defined in earlier ones.

| Phase | Domain | Deliverables | Priority |
|---|---|---|---|
| **P1** | Infrastructure | config/env.js (zod), config/database.js (pg), config/redis.js, logger (pino), AppError hierarchy, errorHandler middleware, health check /api/health | 🔴 Critical |
| **P2** | Auth & Identity | Single JWT strategy, /api/auth/signup, /api/auth/login, authMiddleware, roleMiddleware, password hashing (argon2) | 🔴 Critical |
| **P3** | Communities + Discussions | Communities CRUD, Threads, Replies, acl ownership checks, pagination | 🟢 Core |
| **P4** | Events & Jobs | Admin-only create, public list, soft-delete, cursor pagination | 🟢 Core |
| **P5** | Mentorship | Redesigned schema (studentId, mentorId, status), matching service stub | 🟢 Core |
| **P6** | Memberships & Resources | Community join/leave, resource upload (URL + metadata), role-gated | 🟡 Medium |
| **P7** | Realtime Chat | socket.io rooms, Redis pub/sub fan-out, presence, typing, history REST endpoint | 🟡 Medium |
| **P8** | Observability & Hardening | Helmet, CORS policy, rate limiting per-route, request-id, Pino HTTP log, Sentry DSN, graceful shutdown | 🔴 Critical |

## 5. Coding Standards & Best Practices

### 5.1 Environment & Config
> [!WARNING]
> Never read process.env directly in business code. Validate and centralise all env vars at boot time with zod.

```javascript
// src/config/env.js
import { z } from "zod";

const schema = z.object({
  NODE_ENV:         z.enum(["development", "test", "production"]),
  PORT:             z.coerce.number().default(3000),
  DATABASE_URL:     z.string().url(),
  REDIS_URL:        z.string().url(),
  JWT_SECRET:       z.string().min(32),
  JWT_EXPIRES_IN:   z.string().default("7d"),
  SENTRY_DSN:       z.string().url().optional(),
  BCRYPT_ROUNDS:    z.coerce.number().default(12),
});

export const env = schema.parse(process.env);  // throws at boot if invalid
```

### 5.2 Error Architecture
All thrown errors must be instances of AppError. The global error handler converts them to a consistent JSON shape. Unexpected errors (non-AppError) are logged with full stack and returned as 500 without leaking internals.

```javascript
// src/utils/errors.js
export class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR", meta = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code       = code;
    this.meta       = meta;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
export class NotFoundError      extends AppError { constructor(r) { super(r, 404, "NOT_FOUND"); } }
export class ForbiddenError     extends AppError { constructor(r) { super(r, 403, "FORBIDDEN"); } }
export class UnauthorizedError  extends AppError { constructor(r) { super(r, 401, "UNAUTHORIZED"); } }
export class ValidationError    extends AppError { constructor(r, m) { super(r, 422, "VALIDATION_ERROR", m); } }
export class ConflictError      extends AppError { constructor(r) { super(r, 409, "CONFLICT"); } }

// src/middleware/errorHandler.js
export default (err, req, res, _next) => {
  const log = req.log ?? logger;
  if (!err.isOperational) log.error({ err, reqId: req.id }, "Unhandled error");
  const status = err.statusCode ?? 500;
  res.status(status).json({
    ok: false,
    code:    err.code    ?? "INTERNAL_ERROR",
    message: err.isOperational ? err.message : "Something went wrong",
    meta:    err.meta    ?? {},
    reqId:   req.id,
  });
};
```

### 5.3 Controller Pattern
> [!TIP]
> Controllers must never contain business logic. They only: parse the request, call the service, send the response. One controller = one async function wrapped in asyncHandler.

```javascript
// src/utils/asyncHandler.js
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// src/controllers/thread.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import * as threadService from "../services/thread.service.js";

export const createThread = asyncHandler(async (req, res) => {
  const thread = await threadService.createThread({
    communityId: req.params.communityId,
    authorId:    req.user.id,
    title:       req.body.title,
    body:        req.body.body,
  });
  res.status(201).json({ ok: true, data: thread });
});
```

### 5.4 Service Layer Rules
- Services import repositories — never raw models.
- Services throw AppError subclasses — never raw strings.
- Services are pure async functions — no req/res, no socket references.
- Transactions wrap multi-step mutations via `sequelize.transaction()`.

```javascript
// src/services/thread.service.js
import * as threadRepo     from "../repositories/thread.repository.js";
import * as communityRepo  from "../repositories/community.repository.js";
import { NotFoundError, ForbiddenError } from "../utils/errors.js";

export async function createThread({ communityId, authorId, title, body }) {
  const community = await communityRepo.findById(communityId);
  if (!community) throw new NotFoundError("Community not found");

  const isMember = await communityRepo.hasMember(communityId, authorId);
  if (!isMember) throw new ForbiddenError("Join the community first");

  return threadRepo.create({ communityId, authorId, title, body });
}
```

### 5.5 Repository Pattern
Repositories own all Sequelize calls. They return plain JS objects (using `{ raw: true }` or `.get({ plain: true })`). No model instances leak into service or controller code.

```javascript
// src/repositories/thread.repository.js
import { Thread, User } from "../models/index.js";

export const create = ({ communityId, authorId, title, body }) =>
  Thread.create({ communityId, authorId, title, body });

export const findByCommunity = (communityId, { limit = 20, cursor } = {}) =>
  Thread.findAll({
    where: {
      communityId,
      ...(cursor ? { id: { [Op.lt]: cursor } } : {}),
    },
    order: [["createdAt", "DESC"]],
    limit,
    include: [{ model: User, as: "author", attributes: ["id", "name", "avatarUrl"] }],
    raw: false,
  }).then(rows => rows.map(r => r.get({ plain: true })));
```

### 5.6 Validation
```javascript
// src/middleware/validate.js
import { validationResult } from "express-validator";
import { ValidationError } from "../utils/errors.js";

export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError("Validation failed", { fields: errors.array() });
  }
  next();
};

// src/validators/thread.validators.js
import { body } from "express-validator";

export const createThreadRules = [
  body("title").trim().isLength({ min: 3, max: 120 }).withMessage("Title must be 3-120 chars"),
  body("body").trim().isLength({ min: 10, max: 5000 }).withMessage("Body must be 10-5000 chars"),
];
```

## 6. Auth Strategy (Single JWT, No Firebase Dependency)
> [!WARNING]
> Drop the Firebase-on-client + local-JWT-on-server split. The backend is the single identity authority. Frontend calls /api/auth/login, receives a signed JWT, and sends it as Authorization: Bearer <token> on every subsequent request.

```javascript
// src/middleware/auth.js
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../utils/errors.js";
import * as userRepo from "../repositories/user.repository.js";

export const protect = async (req, _res, next) => {
  const header = req.headers.authorization ?? "";
  const token  = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new UnauthorizedError("No token provided");

  let payload;
  try { payload = jwt.verify(token, env.JWT_SECRET); }
  catch { throw new UnauthorizedError("Invalid or expired token"); }

  const user = await userRepo.findById(payload.sub);
  if (!user) throw new UnauthorizedError("User not found");

  req.user = user;   // { id, email, role, name }
  next();
};

// src/middleware/acl.js
import { ForbiddenError } from "../utils/errors.js";

export const requireRole = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user?.role))
    throw new ForbiddenError(`Requires role: ${roles.join(" | ")}`);
  next();
};

export const requireOwnership = (getOwnerId) => async (req, _res, next) => {
  const ownerId = await getOwnerId(req);
  if (req.user.role !== "admin" && ownerId !== req.user.id)
    throw new ForbiddenError("You do not own this resource");
  next();
};
```

## 7. Realtime Chat — Secure Socket Architecture

### 7.1 Overview
Socket.io with Redis adapter for horizontal scaling. Each chat room is a socket.io room scoped to a ChatRoom UUID. Authentication happens at the socket handshake — an unauthenticated connection is rejected before any room join is attempted. Room membership is verified server-side on every join attempt.

```
┌─────────────────────────────────────────────────────────────┐
│  Client                                                     │
│    io({ auth: { token: "<JWT>" } })                        │
└────────────────────────┬────────────────────────────────────┘
                         │ WS upgrade
┌────────────────────────▼────────────────────────────────────┐
│  socket.io Server                                           │
│    guards.js:  verifyToken() → attach socket.user          │
│    guards.js:  verifyMembership() before room join         │
├─────────────────────────────────────────────────────────────┤
│  chatHandler.js                                             │
│    "chat:send"  → validate → save to DB → emit to room     │
│    "chat:read"  → mark messages read in Redis              │
│    "typing"     → debounced emit to room (no DB write)     │
├─────────────────────────────────────────────────────────────┤
│  Redis Pub/Sub (ioredis + @socket.io/redis-adapter)        │
│    Fan-out across multiple Node processes                  │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Server Bootstrap
```javascript
// src/server.js
import http            from "http";
import { createApp }   from "./app.js";
import { createSocketServer } from "./realtime/index.js";
import { connectDB }   from "./config/database.js";
import { env }         from "./config/env.js";
import logger          from "./utils/logger.js";

const app    = createApp();
const server = http.createServer(app);

createSocketServer(server);   // attaches socket.io to same http.Server

(async () => {
  await connectDB();
  server.listen(env.PORT, () =>
    logger.info({ port: env.PORT }, "Server listening"),
  );
})();

// Graceful shutdown
const shutdown = async (signal) => {
  logger.info({ signal }, "Shutting down");
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));
```

### 7.3 Socket Guards (Auth + ACL)
> [!CAUTION]
> All socket auth happens in middleware before any event handler is called. A missing or invalid JWT disconnects the socket immediately — no event is emitted back to the client to avoid oracle-style timing attacks.

```javascript
// src/realtime/guards.js
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import * as chatRoomRepo from "../repositories/chatRoom.repository.js";

/** Handshake guard — runs once per connection */  
export const verifyToken = async (socket, next) => {
  const token = socket.handshake.auth?.token
             ?? socket.handshake.headers?.authorization?.replace("Bearer ", "");

  if (!token) return next(new Error("AUTH_MISSING"));

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    socket.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new Error("AUTH_INVALID"));   // message is sent to client
  }
};

/** Per-room guard — called inside "room:join" event */  
export const verifyMembership = async (socket, roomId) => {
  const room = await chatRoomRepo.findById(roomId);
  if (!room) throw new Error("ROOM_NOT_FOUND");

  const isMember = await chatRoomRepo.hasMember(roomId, socket.user.id);
  if (!isMember) throw new Error("NOT_A_MEMBER");

  return room;
};
```

### 7.4 Chat Handler
```javascript
// src/realtime/chatHandler.js
import * as messageService from "../services/message.service.js";
import * as presence        from "./presence.js";
import { verifyMembership } from "./guards.js";
import logger               from "../utils/logger.js";

export const registerChatHandlers = (io, socket) => {

  /** Join a chat room ─────────────────────────────── */
  socket.on("room:join", async (roomId, ack) => {
    try {
      await verifyMembership(socket, roomId);
      socket.join(roomId);
      await presence.setOnline(roomId, socket.user.id);
      io.to(roomId).emit("presence:update", await presence.getOnline(roomId));
      ack?.({ ok: true });
    } catch (err) {
      logger.warn({ err: err.message, userId: socket.user.id }, "room:join denied");
      ack?.({ ok: false, code: err.message });
    }
  });

  /** Send a message ───────────────────────────────── */
  socket.on("chat:send", async ({ roomId, content }, ack) => {
    try {
      // Re-verify membership on every send (token could have been shared)
      await verifyMembership(socket, roomId);

      if (!content?.trim() || content.length > 2000)
        return ack?.({ ok: false, code: "INVALID_CONTENT" });

      const msg = await messageService.saveMessage({
        roomId,
        senderId: socket.user.id,
        content:  content.trim(),
      });

      io.to(roomId).emit("chat:message", msg);   // fan-out via Redis adapter
      ack?.({ ok: true, messageId: msg.id });
    } catch (err) {
      ack?.({ ok: false, code: err.message });
    }
  });

  /** Typing indicator ─────────────────────────────── */
  let typingTimer;
  socket.on("typing:start", (roomId) => {
    socket.to(roomId).emit("typing:update", { userId: socket.user.id, typing: true });
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      socket.to(roomId).emit("typing:update", { userId: socket.user.id, typing: false });
    }, 3000);
  });

  /** Disconnect ───────────────────────────────────── */
  socket.on("disconnecting", async () => {
    for (const roomId of socket.rooms) {
      await presence.setOffline(roomId, socket.user.id);
      io.to(roomId).emit("presence:update", await presence.getOnline(roomId));
    }
  });
};
```

### 7.5 Presence via Redis
```javascript
// src/realtime/presence.js
import redis from "../config/redis.js";

const key = (roomId) => `presence:${roomId}`;

export const setOnline  = (roomId, userId) =>
  redis.sadd(key(roomId), userId);

export const setOffline = (roomId, userId) =>
  redis.srem(key(roomId), userId);

export const getOnline  = async (roomId) => {
  const members = await redis.smembers(key(roomId));
  return members;   // array of userIds currently online
};

// TTL sweep: expire presence keys if server dies (no graceful disconnect)
export const heartbeat = (roomId, userId) =>
  redis.expire(key(roomId), 60);   // refresh every ~30 s from client ping
```

### 7.6 Privacy Controls for Chat

| Control | Mechanism | Where enforced |
|---|---|---|
| No anonymous send | JWT required at WS handshake | guards.js verifyToken |
| Room isolation | socket.to(roomId) never socket.broadcast | chatHandler.js |
| Membership re-check | DB lookup on every chat:send | verifyMembership per event |
| Message size cap | 2000 char hard limit + socket.io maxHttpBufferSize | chatHandler + io() options |
| Rate limiting | Redis sliding window 60 msg/min per user | message.service.js |
| Flood protection | socket.io perMessageDeflate off; maxHttpBufferSize 1e6 | realtime/index.js |
| No message echo to sender | io.to(room) not socket.emit — client handles dedup | chatHandler.js |

## 8. Security & Infrastructure Hardening

### 8.1 HTTP Security Headers
```javascript
// src/app.js
import express  from "express";
import helmet   from "helmet";
import cors     from "cors";
import { env }  from "./config/env.js";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({
    origin:      env.ALLOWED_ORIGINS.split(","),
    credentials: true,
    methods:     ["GET","POST","PUT","PATCH","DELETE"],
  }));
  app.use(express.json({ limit: "100kb" }));   // prevent large payload attacks
  app.use(express.urlencoded({ extended: false, limit: "100kb" }));

  // Request ID for distributed tracing
  app.use((req, _res, next) => {
    req.id = crypto.randomUUID();
    next();
  });

  // Mount routes
  app.use("/api", router);
  app.use(errorHandler);

  return app;
};
```

### 8.2 Rate Limiting
```javascript
// src/middleware/rateLimiter.js
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../config/redis.js";

const store = new RedisStore({ sendCommand: (...a) => redis.call(...a) });

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 min
  max: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,           // 10 login attempts per 15 min
  store,
  skipSuccessfulRequests: true,
});
```

### 8.3 Structured Logging
```javascript
// src/utils/logger.js
import pino       from "pino";
import pinoHttp   from "pino-http";
import { env }    from "../config/env.js";

const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  ...(env.NODE_ENV !== "production" && {
    transport: { target: "pino-pretty", options: { colorize: true } }
  }),
});

export const httpLogger = pinoHttp({
  logger,
  serializers: {
    req: (r) => ({ method: r.method, url: r.url, id: r.id }),
    res: (r) => ({ statusCode: r.statusCode }),
  },
  customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
  autoLogging: { ignore: (req) => req.url === "/api/health" },
});

export default logger;
```

### 8.4 Graceful Shutdown & Health Check
```javascript
// src/routes/health.routes.js
import { Router } from "express";
import { sequelize } from "../config/database.js";
import redis from "../config/redis.js";

const r = Router();

r.get("/health", async (_req, res) => {
  const [db, cache] = await Promise.allSettled([
    sequelize.authenticate(),
    redis.ping(),
  ]);
  const ok = db.status === "fulfilled" && cache.status === "fulfilled";
  res.status(ok ? 200 : 503).json({
    ok,
    services: {
      db:    db.status    === "fulfilled" ? "up" : "down",
      redis: cache.status === "fulfilled" ? "up" : "down",
    },
    uptime: process.uptime(),
  });
});

export default r;
```

## 9. Deployment Checklist

### 9.1 Required Environment Variables

| Variable | Example / Notes | Required |
|---|---|---|
| `NODE_ENV` | production | ✅ Yes |
| `PORT` | 3000 (Railway sets automatically) | ✅ Yes |
| `DATABASE_URL` | postgresql://user:pass@host:5432/db | ✅ Yes |
| `REDIS_URL` | redis://default:pass@host:6379 | ✅ Yes |
| `JWT_SECRET` | Min 32 chars — openssl rand -hex 32 | ✅ Yes |
| `ALLOWED_ORIGINS` | https://myapp.com,https://www.myapp.com | ✅ Yes |
| `SENTRY_DSN` | https://xxx@oyyy.ingest.sentry.io/zzz | ⚡ Recommended |

### 9.2 package.json Scripts
```json
"scripts": {
  "dev":       "nodemon --watch src --ext js src/server.js",
  "start":     "node src/server.js",
  "migrate":   "sequelize-cli db:migrate",
  "migrate:undo": "sequelize-cli db:migrate:undo",
  "seed":      "sequelize-cli db:seed:all",
  "test":      "jest --runInBand --forceExit",
  "test:ci":   "jest --runInBand --forceExit --ci --coverage",
  "lint":      "eslint src --ext .js",
  "lint:fix":  "eslint src --ext .js --fix"
}
```

### 9.3 Dockerfile
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM base AS production
COPY src ./src
EXPOSE 3000
CMD ["node", "src/server.js"]
```

## 10. Testing Strategy

| Layer | What to test | Tooling |
|---|---|---|
| Services | Business rules, error cases, DB interactions | Jest + in-memory SQLite |
| Routes | HTTP status codes, response shapes, auth guards | Supertest + Jest |
| Sockets | Handshake auth, room join, message broadcast | socket.io-client + Jest |
| Migrations | Up/down idempotency | sequelize-cli + test DB |

```javascript
// tests/integration/thread.test.js
import request from "supertest";
import { createApp } from "../../src/app.js";
import { getTestToken } from "../helpers/auth.helper.js";

const app = createApp();

describe("POST /api/communities/:id/threads", () => {
  it("returns 401 when unauthenticated", async () => {
    const res = await request(app)
      .post("/api/communities/1/threads")
      .send({ title: "Hello", body: "World from test" });
    expect(res.status).toBe(401);
    expect(res.body.ok).toBe(false);
  });

  it("returns 201 with valid token and body", async () => {
    const token = await getTestToken("member");
    const res = await request(app)
      .post("/api/communities/1/threads")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Valid thread", body: "Long enough body here" });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id");
  });
});
```

## 11. Zero-Downtime Migration Plan
Existing frontend calls `/api/events`, `/api/jobs`, `/api/communities`, `/api/auth/*` — these route paths must not change. The migration is purely internal:

1. **Step 1:** Land Phase 1 (infra) on a branch. Run in staging. Confirm `/api/health` returns 200.
2. **Step 2:** Land Phase 2 (auth). Replace Firebase split with single JWT. Update frontend localStorage key from `firebaseToken` → `authToken`. Roll out behind a feature flag.
3. **Step 3:** Land Phases 3-5 one domain at a time. Write one migration per domain. Never mix domains in a migration.
4. **Step 5:** Land Phase 7 (chat). Redis adapter must be running before deploying. Gate behind env flag `ENABLE_CHAT=true`.
5. **Step 6:** Land Phase 8 (hardening). Flip Helmet, rate limiter, and Sentry DSN in env. Monitor error rates for 24 h.

> [!CAUTION]
> Never run schema-breaking migrations and code deploys simultaneously. Deploy migration first, then new code. This allows instant rollback of code without touching the schema.

---
*Backend Rebuild Playbook · Confidential Internal Document · v1.0*
