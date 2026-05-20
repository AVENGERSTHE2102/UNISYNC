const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, PageBreak, TabStopType, TabStopPosition,
  ExternalHyperlink
} = require('docx');
const fs = require('fs');

// ─── Colours ────────────────────────────────────────────────────────────────
const C = {
  navy:   '1A2B4A',
  blue:   '2563EB',
  sky:    'DBEAFE',
  slate:  '475569',
  green:  '16A34A',
  mint:   'DCFCE7',
  amber:  'D97706',
  cream:  'FFFBEB',
  red:    'DC2626',
  rose:   'FEE2E2',
  gray:   'F1F5F9',
  border: 'CBD5E1',
  white:  'FFFFFF',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const cell = (children, { bg = C.white, bold = false, shade = false, w = 3120 } = {}) =>
  new TableCell({
    width: { size: w, type: WidthType.DXA },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    shading: { fill: bg, type: ShadingType.CLEAR },
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 1, color: C.border },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: C.border },
      left:   { style: BorderStyle.SINGLE, size: 1, color: C.border },
      right:  { style: BorderStyle.SINGLE, size: 1, color: C.border },
    },
    children: Array.isArray(children) ? children : [
      new Paragraph({
        children: [new TextRun({ text: children, bold, size: 20, font: 'Consolas' })]
      })
    ]
  });

const hCell = (text, w = 3120) => cell(text, { bg: C.navy, bold: true, w });

const hdr = (text, level, color = C.navy) =>
  new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 480 : level === HeadingLevel.HEADING_2 ? 340 : 240, after: 140 },
    children: [new TextRun({ text, color, bold: true, font: 'Arial',
      size: level === HeadingLevel.HEADING_1 ? 44 : level === HeadingLevel.HEADING_2 ? 32 : 26 })]
  });

const p = (text, { color = '222222', size = 22, italic = false, bold = false, spacing = 160 } = {}) =>
  new Paragraph({
    spacing: { before: 40, after: spacing },
    children: [new TextRun({ text, color, size, italic, bold, font: 'Calibri' })]
  });

const badge = (label, bg, fg = C.white) =>
  new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: `  ${label}  `, bold: true, size: 18, color: fg, font: 'Arial',
      highlight: undefined,
      shading: { fill: bg, type: ShadingType.CLEAR } })]
  });

const codeBlock = (lines) =>
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: 9360, type: WidthType.DXA },
        margins: { top: 160, bottom: 160, left: 240, right: 240 },
        shading: { fill: '0F172A', type: ShadingType.CLEAR },
        borders: {
          top:    { style: BorderStyle.SINGLE, size: 2, color: '334155' },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: '334155' },
          left:   { style: BorderStyle.SINGLE, size: 6, color: C.blue },
          right:  { style: BorderStyle.SINGLE, size: 2, color: '334155' },
        },
        children: lines.map(line =>
          new Paragraph({
            spacing: { before: 0, after: 0 },
            children: [new TextRun({ text: line, color: 'E2E8F0', size: 18, font: 'Consolas' })]
          })
        )
      })]
    })]
  });

const divider = () => new Paragraph({
  spacing: { before: 200, after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
  children: []
});

const note = (text, type = 'info') => {
  const configs = {
    info:    { bg: C.sky,   border: C.blue,  label: 'ℹ INFO',    fg: '1E3A5F' },
    warn:    { bg: C.cream, border: C.amber, label: '⚠ WARNING', fg: '7C3D00' },
    danger:  { bg: C.rose,  border: C.red,   label: '✖ DANGER',  fg: '7F1D1D' },
    good:    { bg: C.mint,  border: C.green, label: '✔ BEST PRACTICE', fg: '14532D' },
  };
  const cfg = configs[type];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [200, 9160],
    rows: [new TableRow({
      children: [
        new TableCell({
          width: { size: 200, type: WidthType.DXA },
          shading: { fill: cfg.border, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                     left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          children: [new Paragraph({ children: [] })]
        }),
        new TableCell({
          width: { size: 9160, type: WidthType.DXA },
          shading: { fill: cfg.bg, type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 200, right: 160 },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                     left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          children: [
            new Paragraph({ children: [new TextRun({ text: cfg.label, bold: true, size: 18, color: cfg.fg, font: 'Arial' })] }),
            new Paragraph({ children: [new TextRun({ text, size: 20, color: cfg.fg, font: 'Calibri' })] })
          ]
        })
      ]
    })]
  });
};

// ─── bullet list helper ───────────────────────────────────────────────────────
const numbering = {
  config: [
    { reference: 'bullets', levels: [
      { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 560, hanging: 260 } },
                 run: { font: 'Arial', color: C.blue } } },
    ]},
    { reference: 'sub', levels: [
      { level: 0, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 900, hanging: 260 } },
                 run: { font: 'Arial', color: C.slate } } },
    ]},
    { reference: 'nums', levels: [
      { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 560, hanging: 260 } } } }
    ]},
  ]
};

const bullet = (text, ref = 'bullets') =>
  new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { before: 30, after: 60 },
    children: [new TextRun({ text, size: 21, font: 'Calibri', color: '1E293B' })]
  });

const mixBullet = (runs, ref = 'bullets') =>
  new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { before: 30, after: 60 },
    children: runs
  });

const mono = (text, color = C.blue) =>
  new TextRun({ text, font: 'Consolas', size: 19, color, bold: true });

const plain = (text) => new TextRun({ text, font: 'Calibri', size: 21, color: '1E293B' });

// ─── Phase table builder ──────────────────────────────────────────────────────
const phaseRow = (num, name, items, status) => new TableRow({
  children: [
    new TableCell({
      width: { size: 900, type: WidthType.DXA },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      shading: { fill: C.navy, type: ShadingType.CLEAR },
      borders: { top: { style: BorderStyle.SINGLE, size:1, color: C.border },
                 bottom: { style: BorderStyle.SINGLE, size:1, color: C.border },
                 left: { style: BorderStyle.SINGLE, size:1, color: C.border },
                 right: { style: BorderStyle.SINGLE, size:1, color: C.border } },
      children: [new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: `P${num}`, bold:true, size:22, color: C.white, font:'Arial' })] })]
    }),
    new TableCell({
      width: { size: 2400, type: WidthType.DXA },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      shading: { fill: C.sky, type: ShadingType.CLEAR },
      borders: { top: { style: BorderStyle.SINGLE, size:1, color: C.border },
                 bottom: { style: BorderStyle.SINGLE, size:1, color: C.border },
                 left: { style: BorderStyle.SINGLE, size:1, color: C.border },
                 right: { style: BorderStyle.SINGLE, size:1, color: C.border } },
      children: [new Paragraph({ children: [new TextRun({ text: name, bold:true, size:21, color: C.navy, font:'Arial' })] })]
    }),
    new TableCell({
      width: { size: 5260, type: WidthType.DXA },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      shading: { fill: C.white, type: ShadingType.CLEAR },
      borders: { top: { style: BorderStyle.SINGLE, size:1, color: C.border },
                 bottom: { style: BorderStyle.SINGLE, size:1, color: C.border },
                 left: { style: BorderStyle.SINGLE, size:1, color: C.border },
                 right: { style: BorderStyle.SINGLE, size:1, color: C.border } },
      children: [new Paragraph({ children: [new TextRun({ text: items, size:20, font:'Calibri', color:'1E293B' })] })]
    }),
    new TableCell({
      width: { size: 800, type: WidthType.DXA },
      margins: { top: 100, bottom: 100, left: 80, right: 80 },
      shading: { fill: status === 'critical' ? C.rose : status === 'core' ? C.mint : C.cream, type: ShadingType.CLEAR },
      borders: { top: { style: BorderStyle.SINGLE, size:1, color: C.border },
                 bottom: { style: BorderStyle.SINGLE, size:1, color: C.border },
                 left: { style: BorderStyle.SINGLE, size:1, color: C.border },
                 right: { style: BorderStyle.SINGLE, size:1, color: C.border } },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({
        text: status === 'critical' ? '🔴' : status === 'core' ? '🟢' : '🟡',
        size: 20, font:'Calibri' })] })]
    }),
  ]
});

// ─── DOCUMENT CHILDREN ────────────────────────────────────────────────────────
const children = [

  // ── COVER ────────────────────────────────────────────────────────────────
  new Paragraph({
    spacing: { before: 800, after: 120 },
    children: [new TextRun({ text: 'Backend Rebuild Playbook', bold: true, size: 72, color: C.navy, font: 'Arial' })]
  }),
  new Paragraph({
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: 'Production-Grade Node.js + Express Architecture', size: 32, color: C.slate, font: 'Arial', italic: true })]
  }),
  new Paragraph({
    spacing: { before: 0, after: 600 },
    children: [new TextRun({ text: 'Deployment-Ready · Security-First · Socket-Safe', size: 24, color: C.blue, font: 'Consolas' })]
  }),

  divider(),

  // ── 1. EXECUTIVE SUMMARY ─────────────────────────────────────────────────
  hdr('1. Executive Summary', HeadingLevel.HEADING_1),
  p('The current codebase is a proof-of-concept with mixed concerns, broken imports, an inconsistent auth contract, and no deployment guardrails. This document provides a decision-complete rebuild plan that fixes every structural gap while preserving all existing API routes consumed by the frontend. The result is a layered, observable, horizontally-scalable service ready for production hosting (Railway / Render / Fly.io).'),

  // ── 2. CURRENT GAPS ──────────────────────────────────────────────────────
  hdr('2. Current Gaps & Root Causes', HeadingLevel.HEADING_1),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3200, 3200, 2960],
    rows: [
      new TableRow({ children: [
        hCell('Gap', 3200), hCell('Symptom', 3200), hCell('Root Cause', 2960)
      ]}),
      new TableRow({ children: [
        cell('Broken bootstrap', {w:3200}), cell('index.js crashes at runtime', {w:3200}), cell('db not imported; chatHandler missing', {w:2960})
      ]}),
      new TableRow({ children: [
        cell('Auth contract split', {w:3200, bg:C.rose}), cell('Firebase token vs local JWT', {w:3200, bg:C.rose}), cell('No single source of truth for identity', {w:2960, bg:C.rose})
      ]}),
      new TableRow({ children: [
        cell('Schema drift', {w:3200}), cell('authorId vs userId mismatch', {w:3200}), cell('Migration and controller written independently', {w:2960})
      ]}),
      new TableRow({ children: [
        cell('DB mismatch', {w:3200, bg:C.cream}), cell('SQLite in prod config', {w:3200, bg:C.cream}), cell('Config overwritten during dev; never reconciled', {w:2960, bg:C.cream})
      ]}),
      new TableRow({ children: [
        cell('No realtime', {w:3200}), cell('Chat models exist, zero socket layer', {w:3200}), cell('chatHandler.js never created', {w:2960})
      ]}),
      new TableRow({ children: [
        cell('No error contract', {w:3200, bg:C.rose}), cell('Inconsistent error shapes to frontend', {w:3200, bg:C.rose}), cell('Each controller throws differently', {w:2960, bg:C.rose})
      ]}),
    ]
  }),

  new Paragraph({ spacing: { before: 20, after: 20 }, children: [] }),

  // ── 3. TARGET ARCHITECTURE ───────────────────────────────────────────────
  hdr('3. Target Architecture', HeadingLevel.HEADING_1),
  p('A four-layer architecture with strict one-way dependency flow: Routes → Controllers → Services → Data Access. Nothing in an outer layer imports from an inner concern; all cross-cutting (auth, validation, logging) lives in middleware.'),

  codeBlock([
    '┌────────────────────────────────────────────────────────────┐',
    '│  HTTP / WebSocket Ingress  (Express + socket.io)           │',
    '├────────────────────────────────────────────────────────────┤',
    '│  Route Layer       src/routes/                             │',
    '│  Middleware        src/middleware/  (auth, validate, acl)  │',
    '├────────────────────────────────────────────────────────────┤',
    '│  Controller Layer  src/controllers/ (req → service call)   │',
    '├────────────────────────────────────────────────────────────┤',
    '│  Service Layer     src/services/   (business logic)        │',
    '├────────────────────────────────────────────────────────────┤',
    '│  Data Access       src/repositories/ + Sequelize models    │',
    '├────────────────────────────────────────────────────────────┤',
    '│  Infrastructure    PostgreSQL  •  Redis  •  Socket.io      │',
    '└────────────────────────────────────────────────────────────┘',
  ]),

  new Paragraph({ spacing: { before: 20, after: 20 }, children: [] }),

  hdr('3.1  Directory Structure', HeadingLevel.HEADING_2),

  codeBlock([
    'src/',
    '├── app.js              # Express factory – no server.listen here',
    '├── server.js           # Binds http.Server + socket.io, calls app()',
    '├── config/',
    '│   ├── database.js     # Sequelize with pg dialect',
    '│   ├── redis.js        # ioredis client singleton',
    '│   └── env.js          # zod-validated process.env',
    '├── routes/',
    '│   ├── index.js        # Mounts all routers under /api',
    '│   ├── auth.routes.js',
    '│   ├── community.routes.js',
    '│   ├── event.routes.js',
    '│   ├── job.routes.js',
    '│   ├── mentorship.routes.js',
    '│   ├── thread.routes.js',
    '│   ├── reply.routes.js',
    '│   └── chat.routes.js',
    '├── controllers/        # Thin: parse req, call service, send res',
    '├── services/           # Business logic, NO req/res objects',
    '├── repositories/       # Sequelize queries, returns plain objects',
    '├── models/             # Sequelize model definitions',
    '├── migrations/',
    '├── middleware/',
    '│   ├── auth.js         # JWT verify → req.user',
    '│   ├── acl.js          # Role-based + ownership checks',
    '│   ├── validate.js     # express-validator wrapper',
    '│   ├── rateLimiter.js  # Redis-backed rate limiter',
    '│   └── errorHandler.js # Unified error shape',
    '├── realtime/',
    '│   ├── index.js        # socket.io server factory',
    '│   ├── chatHandler.js  # Per-room event handlers',
    '│   ├── presence.js     # Online/typing status via Redis',
    '│   └── guards.js       # Socket auth + room membership checks',
    '├── utils/',
    '│   ├── logger.js       # Pino structured logger',
    '│   ├── errors.js       # AppError class hierarchy',
    '│   └── pagination.js',
    '└── tests/',
    '    ├── unit/',
    '    └── integration/',
  ]),

  new Paragraph({ spacing: { before: 20, after: 20 }, children: [] }),

  // ── 4. BUILD ORDER ───────────────────────────────────────────────────────
  hdr('4. Phased Build Order', HeadingLevel.HEADING_1),
  p('Each phase produces a deployable, tested slice. Later phases depend only on contracts defined in earlier ones.'),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [900, 2400, 5260, 800],
    rows: [
      new TableRow({ children: [
        hCell('Phase', 900), hCell('Domain', 2400), hCell('Deliverables', 5260), hCell('Pri', 800)
      ]}),
      phaseRow(1, 'Infrastructure', 'config/env.js (zod), config/database.js (pg), config/redis.js, logger (pino), AppError hierarchy, errorHandler middleware, health check /api/health', 'critical'),
      phaseRow(2, 'Auth & Identity', 'Single JWT strategy, /api/auth/signup, /api/auth/login, authMiddleware, roleMiddleware, password hashing (argon2)', 'critical'),
      phaseRow(3, 'Communities + Discussions', 'Communities CRUD, Threads, Replies, acl ownership checks, pagination', 'core'),
      phaseRow(4, 'Events & Jobs', 'Admin-only create, public list, soft-delete, cursor pagination', 'core'),
      phaseRow(5, 'Mentorship', 'Redesigned schema (studentId, mentorId, status), matching service stub', 'core'),
      phaseRow(6, 'Memberships & Resources', 'Community join/leave, resource upload (URL + metadata), role-gated', 'medium'),
      phaseRow(7, 'Realtime Chat', 'socket.io rooms, Redis pub/sub fan-out, presence, typing, history REST endpoint', 'medium'),
      phaseRow(8, 'Observability & Hardening', 'Helmet, CORS policy, rate limiting per-route, request-id, Pino HTTP log, Sentry DSN, graceful shutdown', 'critical'),
    ]
  }),

  new Paragraph({ spacing: { before: 20, after: 20 }, children: [] }),

  // ── 5. CODING STANDARDS ──────────────────────────────────────────────────
  hdr('5. Coding Standards & Best Practices', HeadingLevel.HEADING_1),

  hdr('5.1  Environment & Config', HeadingLevel.HEADING_2),
  note('Never read process.env directly in business code. Validate and centralise all env vars at boot time with zod.', 'warn'),

  codeBlock([
    '// src/config/env.js',
    'import { z } from "zod";',
    '',
    'const schema = z.object({',
    '  NODE_ENV:         z.enum(["development", "test", "production"]),',
    '  PORT:             z.coerce.number().default(3000),',
    '  DATABASE_URL:     z.string().url(),',
    '  REDIS_URL:        z.string().url(),',
    '  JWT_SECRET:       z.string().min(32),',
    '  JWT_EXPIRES_IN:   z.string().default("7d"),',
    '  SENTRY_DSN:       z.string().url().optional(),',
    '  BCRYPT_ROUNDS:    z.coerce.number().default(12),',
    '});',
    '',
    'export const env = schema.parse(process.env);  // throws at boot if invalid',
  ]),

  hdr('5.2  Error Architecture', HeadingLevel.HEADING_2),
  p('All thrown errors must be instances of AppError. The global error handler converts them to a consistent JSON shape. Unexpected errors (non-AppError) are logged with full stack and returned as 500 without leaking internals.'),

  codeBlock([
    '// src/utils/errors.js',
    'export class AppError extends Error {',
    '  constructor(message, statusCode = 500, code = "INTERNAL_ERROR", meta = {}) {',
    '    super(message);',
    '    this.statusCode = statusCode;',
    '    this.code       = code;',
    '    this.meta       = meta;',
    '    this.isOperational = true;',
    '    Error.captureStackTrace(this, this.constructor);',
    '  }',
    '}',
    'export class NotFoundError      extends AppError { constructor(r) { super(r, 404, "NOT_FOUND"); } }',
    'export class ForbiddenError     extends AppError { constructor(r) { super(r, 403, "FORBIDDEN"); } }',
    'export class UnauthorizedError  extends AppError { constructor(r) { super(r, 401, "UNAUTHORIZED"); } }',
    'export class ValidationError    extends AppError { constructor(r, m) { super(r, 422, "VALIDATION_ERROR", m); } }',
    'export class ConflictError      extends AppError { constructor(r) { super(r, 409, "CONFLICT"); } }',
    '',
    '// src/middleware/errorHandler.js',
    'export default (err, req, res, _next) => {',
    '  const log = req.log ?? logger;',
    '  if (!err.isOperational) log.error({ err, reqId: req.id }, "Unhandled error");',
    '  const status = err.statusCode ?? 500;',
    '  res.status(status).json({',
    '    ok: false,',
    '    code:    err.code    ?? "INTERNAL_ERROR",',
    '    message: err.isOperational ? err.message : "Something went wrong",',
    '    meta:    err.meta    ?? {},',
    '    reqId:   req.id,',
    '  });',
    '};',
  ]),

  hdr('5.3  Controller Pattern', HeadingLevel.HEADING_2),
  note('Controllers must never contain business logic. They only: parse the request, call the service, send the response. One controller = one async function wrapped in asyncHandler.', 'good'),

  codeBlock([
    '// src/utils/asyncHandler.js',
    'export const asyncHandler = (fn) => (req, res, next) =>',
    '  Promise.resolve(fn(req, res, next)).catch(next);',
    '',
    '// src/controllers/thread.controller.js',
    'import { asyncHandler } from "../utils/asyncHandler.js";',
    'import * as threadService from "../services/thread.service.js";',
    '',
    'export const createThread = asyncHandler(async (req, res) => {',
    '  const thread = await threadService.createThread({',
    '    communityId: req.params.communityId,',
    '    authorId:    req.user.id,',
    '    title:       req.body.title,',
    '    body:        req.body.body,',
    '  });',
    '  res.status(201).json({ ok: true, data: thread });',
    '});',
  ]),

  hdr('5.4  Service Layer Rules', HeadingLevel.HEADING_2),
  bullet('Services import repositories — never raw models.'),
  bullet('Services throw AppError subclasses — never raw strings.'),
  bullet('Services are pure async functions — no req/res, no socket references.'),
  bullet('Transactions wrap multi-step mutations via sequelize.transaction().'),

  codeBlock([
    '// src/services/thread.service.js',
    'import * as threadRepo     from "../repositories/thread.repository.js";',
    'import * as communityRepo  from "../repositories/community.repository.js";',
    'import { NotFoundError, ForbiddenError } from "../utils/errors.js";',
    '',
    'export async function createThread({ communityId, authorId, title, body }) {',
    '  const community = await communityRepo.findById(communityId);',
    '  if (!community) throw new NotFoundError("Community not found");',
    '',
    '  const isMember = await communityRepo.hasMember(communityId, authorId);',
    '  if (!isMember) throw new ForbiddenError("Join the community first");',
    '',
    '  return threadRepo.create({ communityId, authorId, title, body });',
    '}',
  ]),

  hdr('5.5  Repository Pattern', HeadingLevel.HEADING_2),
  p('Repositories own all Sequelize calls. They return plain JS objects (using { raw: true } or .get({ plain: true })). No model instances leak into service or controller code.'),

  codeBlock([
    '// src/repositories/thread.repository.js',
    'import { Thread, User } from "../models/index.js";',
    '',
    'export const create = ({ communityId, authorId, title, body }) =>',
    '  Thread.create({ communityId, authorId, title, body });',
    '',
    'export const findByCommunity = (communityId, { limit = 20, cursor } = {}) =>',
    '  Thread.findAll({',
    '    where: {',
    '      communityId,',
    '      ...(cursor ? { id: { [Op.lt]: cursor } } : {}),',
    '    },',
    '    order: [["createdAt", "DESC"]],',
    '    limit,',
    '    include: [{ model: User, as: "author", attributes: ["id", "name", "avatarUrl"] }],',
    '    raw: false,',
    '  }).then(rows => rows.map(r => r.get({ plain: true })));',
  ]),

  hdr('5.6  Validation', HeadingLevel.HEADING_2),

  codeBlock([
    '// src/middleware/validate.js',
    'import { validationResult } from "express-validator";',
    'import { ValidationError } from "../utils/errors.js";',
    '',
    'export const validate = (req, _res, next) => {',
    '  const errors = validationResult(req);',
    '  if (!errors.isEmpty()) {',
    '    throw new ValidationError("Validation failed", { fields: errors.array() });',
    '  }',
    '  next();',
    '};',
    '',
    '// src/validators/thread.validators.js',
    'import { body } from "express-validator";',
    '',
    'export const createThreadRules = [',
    '  body("title").trim().isLength({ min: 3, max: 120 }).withMessage("Title must be 3-120 chars"),',
    '  body("body").trim().isLength({ min: 10, max: 5000 }).withMessage("Body must be 10-5000 chars"),',
    '];',
  ]),

  // ── 6. AUTH ──────────────────────────────────────────────────────────────
  hdr('6. Auth Strategy (Single JWT, No Firebase Dependency)', HeadingLevel.HEADING_1),
  note('Drop the Firebase-on-client + local-JWT-on-server split. The backend is the single identity authority. Frontend calls /api/auth/login, receives a signed JWT, and sends it as Authorization: Bearer <token> on every subsequent request.', 'warn'),

  codeBlock([
    '// src/middleware/auth.js',
    'import jwt from "jsonwebtoken";',
    'import { env } from "../config/env.js";',
    'import { UnauthorizedError } from "../utils/errors.js";',
    'import * as userRepo from "../repositories/user.repository.js";',
    '',
    'export const protect = async (req, _res, next) => {',
    '  const header = req.headers.authorization ?? "";',
    '  const token  = header.startsWith("Bearer ") ? header.slice(7) : null;',
    '  if (!token) throw new UnauthorizedError("No token provided");',
    '',
    '  let payload;',
    '  try { payload = jwt.verify(token, env.JWT_SECRET); }',
    '  catch { throw new UnauthorizedError("Invalid or expired token"); }',
    '',
    '  const user = await userRepo.findById(payload.sub);',
    '  if (!user) throw new UnauthorizedError("User not found");',
    '',
    '  req.user = user;   // { id, email, role, name }',
    '  next();',
    '};',
    '',
    '// src/middleware/acl.js',
    'import { ForbiddenError } from "../utils/errors.js";',
    '',
    'export const requireRole = (...roles) => (req, _res, next) => {',
    '  if (!roles.includes(req.user?.role))',
    '    throw new ForbiddenError(`Requires role: ${roles.join(" | ")}`);',
    '  next();',
    '};',
    '',
    'export const requireOwnership = (getOwnerId) => async (req, _res, next) => {',
    '  const ownerId = await getOwnerId(req);',
    '  if (req.user.role !== "admin" && ownerId !== req.user.id)',
    '    throw new ForbiddenError("You do not own this resource");',
    '  next();',
    '};',
  ]),

  // ── 7. REALTIME CHAT ─────────────────────────────────────────────────────
  hdr('7. Realtime Chat — Secure Socket Architecture', HeadingLevel.HEADING_1),

  hdr('7.1  Overview', HeadingLevel.HEADING_2),
  p('Socket.io with Redis adapter for horizontal scaling. Each chat room is a socket.io room scoped to a ChatRoom UUID. Authentication happens at the socket handshake — an unauthenticated connection is rejected before any room join is attempted. Room membership is verified server-side on every join attempt.'),

  codeBlock([
    '┌─────────────────────────────────────────────────────────────┐',
    '│  Client                                                     │',
    '│    io({ auth: { token: "<JWT>" } })                        │',
    '└────────────────────────┬────────────────────────────────────┘',
    '                         │ WS upgrade',
    '┌────────────────────────▼────────────────────────────────────┐',
    '│  socket.io Server                                           │',
    '│    guards.js:  verifyToken() → attach socket.user          │',
    '│    guards.js:  verifyMembership() before room join         │',
    '├─────────────────────────────────────────────────────────────┤',
    '│  chatHandler.js                                             │',
    '│    "chat:send"  → validate → save to DB → emit to room     │',
    '│    "chat:read"  → mark messages read in Redis              │',
    '│    "typing"     → debounced emit to room (no DB write)     │',
    '├─────────────────────────────────────────────────────────────┤',
    '│  Redis Pub/Sub (ioredis + @socket.io/redis-adapter)        │',
    '│    Fan-out across multiple Node processes                  │',
    '└─────────────────────────────────────────────────────────────┘',
  ]),

  hdr('7.2  Server Bootstrap', HeadingLevel.HEADING_2),

  codeBlock([
    '// src/server.js',
    'import http            from "http";',
    'import { createApp }   from "./app.js";',
    'import { createSocketServer } from "./realtime/index.js";',
    'import { connectDB }   from "./config/database.js";',
    'import { env }         from "./config/env.js";',
    'import logger          from "./utils/logger.js";',
    '',
    'const app    = createApp();',
    'const server = http.createServer(app);',
    '',
    'createSocketServer(server);   // attaches socket.io to same http.Server',
    '',
    '(async () => {',
    '  await connectDB();',
    '  server.listen(env.PORT, () =>',
    '    logger.info({ port: env.PORT }, "Server listening"),',
    '  );',
    '})();',
    '',
    '// Graceful shutdown',
    'const shutdown = async (signal) => {',
    '  logger.info({ signal }, "Shutting down");',
    '  server.close(() => process.exit(0));',
    '  setTimeout(() => process.exit(1), 10_000).unref();',
    '};',
    'process.on("SIGTERM", () => shutdown("SIGTERM"));',
    'process.on("SIGINT",  () => shutdown("SIGINT"));',
  ]),

  hdr('7.3  Socket Guards (Auth + ACL)', HeadingLevel.HEADING_2),
  note('All socket auth happens in middleware before any event handler is called. A missing or invalid JWT disconnects the socket immediately — no event is emitted back to the client to avoid oracle-style timing attacks.', 'danger'),

  codeBlock([
    '// src/realtime/guards.js',
    'import jwt from "jsonwebtoken";',
    'import { env } from "../config/env.js";',
    'import * as chatRoomRepo from "../repositories/chatRoom.repository.js";',
    '',
    '/** Handshake guard — runs once per connection */  ',
    'export const verifyToken = async (socket, next) => {',
    '  const token = socket.handshake.auth?.token',
    '             ?? socket.handshake.headers?.authorization?.replace("Bearer ", "");',
    '',
    '  if (!token) return next(new Error("AUTH_MISSING"));',
    '',
    '  try {',
    '    const payload = jwt.verify(token, env.JWT_SECRET);',
    '    socket.user = { id: payload.sub, role: payload.role };',
    '    next();',
    '  } catch {',
    '    next(new Error("AUTH_INVALID"));   // message is sent to client',
    '  }',
    '};',
    '',
    '/** Per-room guard — called inside "room:join" event */  ',
    'export const verifyMembership = async (socket, roomId) => {',
    '  const room = await chatRoomRepo.findById(roomId);',
    '  if (!room) throw new Error("ROOM_NOT_FOUND");',
    '',
    '  const isMember = await chatRoomRepo.hasMember(roomId, socket.user.id);',
    '  if (!isMember) throw new Error("NOT_A_MEMBER");',
    '',
    '  return room;',
    '};',
  ]),

  hdr('7.4  Chat Handler', HeadingLevel.HEADING_2),

  codeBlock([
    '// src/realtime/chatHandler.js',
    'import * as messageService from "../services/message.service.js";',
    'import * as presence        from "./presence.js";',
    'import { verifyMembership } from "./guards.js";',
    'import logger               from "../utils/logger.js";',
    '',
    'export const registerChatHandlers = (io, socket) => {',
    '',
    '  /** Join a chat room ─────────────────────────────── */',
    '  socket.on("room:join", async (roomId, ack) => {',
    '    try {',
    '      await verifyMembership(socket, roomId);',
    '      socket.join(roomId);',
    '      await presence.setOnline(roomId, socket.user.id);',
    '      io.to(roomId).emit("presence:update", await presence.getOnline(roomId));',
    '      ack?.({ ok: true });',
    '    } catch (err) {',
    '      logger.warn({ err: err.message, userId: socket.user.id }, "room:join denied");',
    '      ack?.({ ok: false, code: err.message });',
    '    }',
    '  });',
    '',
    '  /** Send a message ───────────────────────────────── */',
    '  socket.on("chat:send", async ({ roomId, content }, ack) => {',
    '    try {',
    '      // Re-verify membership on every send (token could have been shared)',
    '      await verifyMembership(socket, roomId);',
    '',
    '      if (!content?.trim() || content.length > 2000)',
    '        return ack?.({ ok: false, code: "INVALID_CONTENT" });',
    '',
    '      const msg = await messageService.saveMessage({',
    '        roomId,',
    '        senderId: socket.user.id,',
    '        content:  content.trim(),',
    '      });',
    '',
    '      io.to(roomId).emit("chat:message", msg);   // fan-out via Redis adapter',
    '      ack?.({ ok: true, messageId: msg.id });',
    '    } catch (err) {',
    '      ack?.({ ok: false, code: err.message });',
    '    }',
    '  });',
    '',
    '  /** Typing indicator ─────────────────────────────── */',
    '  let typingTimer;',
    '  socket.on("typing:start", (roomId) => {',
    '    socket.to(roomId).emit("typing:update", { userId: socket.user.id, typing: true });',
    '    clearTimeout(typingTimer);',
    '    typingTimer = setTimeout(() => {',
    '      socket.to(roomId).emit("typing:update", { userId: socket.user.id, typing: false });',
    '    }, 3000);',
    '  });',
    '',
    '  /** Disconnect ───────────────────────────────────── */',
    '  socket.on("disconnecting", async () => {',
    '    for (const roomId of socket.rooms) {',
    '      await presence.setOffline(roomId, socket.user.id);',
    '      io.to(roomId).emit("presence:update", await presence.getOnline(roomId));',
    '    }',
    '  });',
    '};',
  ]),

  hdr('7.5  Presence via Redis', HeadingLevel.HEADING_2),

  codeBlock([
    '// src/realtime/presence.js',
    'import redis from "../config/redis.js";',
    '',
    'const key = (roomId) => `presence:${roomId}`;',
    '',
    'export const setOnline  = (roomId, userId) =>',
    '  redis.sadd(key(roomId), userId);',
    '',
    'export const setOffline = (roomId, userId) =>',
    '  redis.srem(key(roomId), userId);',
    '',
    'export const getOnline  = async (roomId) => {',
    '  const members = await redis.smembers(key(roomId));',
    '  return members;   // array of userIds currently online',
    '};',
    '',
    '// TTL sweep: expire presence keys if server dies (no graceful disconnect)',
    'export const heartbeat = (roomId, userId) =>',
    '  redis.expire(key(roomId), 60);   // refresh every ~30 s from client ping',
  ]),

  hdr('7.6  Privacy Controls for Chat', HeadingLevel.HEADING_2),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3000, 3200, 3160],
    rows: [
      new TableRow({ children: [hCell('Control', 3000), hCell('Mechanism', 3200), hCell('Where enforced', 3160)] }),
      new TableRow({ children: [cell('No anonymous send', {w:3000}), cell('JWT required at WS handshake', {w:3200}), cell('guards.js verifyToken', {w:3160})] }),
      new TableRow({ children: [cell('Room isolation', {w:3000, bg:C.sky}), cell('socket.to(roomId) never socket.broadcast', {w:3200, bg:C.sky}), cell('chatHandler.js', {w:3160, bg:C.sky})] }),
      new TableRow({ children: [cell('Membership re-check', {w:3000}), cell('DB lookup on every chat:send', {w:3200}), cell('verifyMembership per event', {w:3160})] }),
      new TableRow({ children: [cell('Message size cap', {w:3000, bg:C.sky}), cell('2000 char hard limit + socket.io maxHttpBufferSize', {w:3200, bg:C.sky}), cell('chatHandler + io() options', {w:3160, bg:C.sky})] }),
      new TableRow({ children: [cell('Rate limiting', {w:3000}), cell('Redis sliding window 60 msg/min per user', {w:3200}), cell('message.service.js', {w:3160})] }),
      new TableRow({ children: [cell('Flood protection', {w:3000, bg:C.sky}), cell('socket.io perMessageDeflate off; maxHttpBufferSize 1e6', {w:3200, bg:C.sky}), cell('realtime/index.js', {w:3160, bg:C.sky})] }),
      new TableRow({ children: [cell('No message echo to sender', {w:3000}), cell('io.to(room) not socket.emit — client handles dedup', {w:3200}), cell('chatHandler.js', {w:3160})] }),
    ]
  }),

  new Paragraph({ spacing: { before: 20, after: 20 }, children: [] }),

  // ── 8. INFRA ─────────────────────────────────────────────────────────────
  hdr('8. Security & Infrastructure Hardening', HeadingLevel.HEADING_1),

  hdr('8.1  HTTP Security Headers', HeadingLevel.HEADING_2),
  codeBlock([
    '// src/app.js',
    'import express  from "express";',
    'import helmet   from "helmet";',
    'import cors     from "cors";',
    'import { env }  from "./config/env.js";',
    '',
    'export const createApp = () => {',
    '  const app = express();',
    '',
    '  app.use(helmet());',
    '  app.use(cors({',
    '    origin:      env.ALLOWED_ORIGINS.split(","),',
    '    credentials: true,',
    '    methods:     ["GET","POST","PUT","PATCH","DELETE"],',
    '  }));',
    '  app.use(express.json({ limit: "100kb" }));   // prevent large payload attacks',
    '  app.use(express.urlencoded({ extended: false, limit: "100kb" }));',
    '',
    '  // Request ID for distributed tracing',
    '  app.use((req, _res, next) => {',
    '    req.id = crypto.randomUUID();',
    '    next();',
    '  });',
    '',
    '  // Mount routes',
    '  app.use("/api", router);',
    '  app.use(errorHandler);',
    '',
    '  return app;',
    '};',
  ]),

  hdr('8.2  Rate Limiting', HeadingLevel.HEADING_2),
  codeBlock([
    '// src/middleware/rateLimiter.js',
    'import { rateLimit } from "express-rate-limit";',
    'import { RedisStore } from "rate-limit-redis";',
    'import redis from "../config/redis.js";',
    '',
    'const store = new RedisStore({ sendCommand: (...a) => redis.call(...a) });',
    '',
    'export const globalLimiter = rateLimit({',
    '  windowMs: 60 * 1000,   // 1 min',
    '  max: 120,',
    '  standardHeaders: "draft-7",',
    '  legacyHeaders: false,',
    '  store,',
    '});',
    '',
    'export const authLimiter = rateLimit({',
    '  windowMs: 15 * 60 * 1000,',
    '  max: 10,           // 10 login attempts per 15 min',
    '  store,',
    '  skipSuccessfulRequests: true,',
    '});',
  ]),

  hdr('8.3  Structured Logging', HeadingLevel.HEADING_2),
  codeBlock([
    '// src/utils/logger.js',
    'import pino       from "pino";',
    'import pinoHttp   from "pino-http";',
    'import { env }    from "../config/env.js";',
    '',
    'const logger = pino({',
    '  level: env.NODE_ENV === "production" ? "info" : "debug",',
    '  ...(env.NODE_ENV !== "production" && {',
    '    transport: { target: "pino-pretty", options: { colorize: true } }',
    '  }),',
    '});',
    '',
    'export const httpLogger = pinoHttp({',
    '  logger,',
    '  serializers: {',
    '    req: (r) => ({ method: r.method, url: r.url, id: r.id }),',
    '    res: (r) => ({ statusCode: r.statusCode }),',
    '  },',
    '  customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,',
    '  autoLogging: { ignore: (req) => req.url === "/api/health" },',
    '});',
    '',
    'export default logger;',
  ]),

  hdr('8.4  Graceful Shutdown & Health Check', HeadingLevel.HEADING_2),
  codeBlock([
    '// src/routes/health.routes.js',
    'import { Router } from "express";',
    'import { sequelize } from "../config/database.js";',
    'import redis from "../config/redis.js";',
    '',
    'const r = Router();',
    '',
    'r.get("/health", async (_req, res) => {',
    '  const [db, cache] = await Promise.allSettled([',
    '    sequelize.authenticate(),',
    '    redis.ping(),',
    '  ]);',
    '  const ok = db.status === "fulfilled" && cache.status === "fulfilled";',
    '  res.status(ok ? 200 : 503).json({',
    '    ok,',
    '    services: {',
    '      db:    db.status    === "fulfilled" ? "up" : "down",',
    '      redis: cache.status === "fulfilled" ? "up" : "down",',
    '    },',
    '    uptime: process.uptime(),',
    '  });',
    '});',
    '',
    'export default r;',
  ]),

  // ── 9. DEPLOYMENT ─────────────────────────────────────────────────────────
  hdr('9. Deployment Checklist', HeadingLevel.HEADING_1),

  hdr('9.1  Required Environment Variables', HeadingLevel.HEADING_2),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 4360, 2200],
    rows: [
      new TableRow({ children: [hCell('Variable', 2800), hCell('Example / Notes', 4360), hCell('Required', 2200)] }),
      new TableRow({ children: [cell('NODE_ENV', {w:2800}), cell('production', {w:4360}), cell('✅ Yes', {w:2200, bg:C.mint})] }),
      new TableRow({ children: [cell('PORT', {w:2800}), cell('3000 (Railway sets automatically)', {w:4360}), cell('✅ Yes', {w:2200, bg:C.mint})] }),
      new TableRow({ children: [cell('DATABASE_URL', {w:2800}), cell('postgresql://user:pass@host:5432/db', {w:4360}), cell('✅ Yes', {w:2200, bg:C.mint})] }),
      new TableRow({ children: [cell('REDIS_URL', {w:2800}), cell('redis://default:pass@host:6379', {w:4360}), cell('✅ Yes', {w:2200, bg:C.mint})] }),
      new TableRow({ children: [cell('JWT_SECRET', {w:2800}), cell('Min 32 chars — openssl rand -hex 32', {w:4360}), cell('✅ Yes', {w:2200, bg:C.mint})] }),
      new TableRow({ children: [cell('ALLOWED_ORIGINS', {w:2800}), cell('https://myapp.com,https://www.myapp.com', {w:4360}), cell('✅ Yes', {w:2200, bg:C.mint})] }),
      new TableRow({ children: [cell('SENTRY_DSN', {w:2800}), cell('https://xxx@oyyy.ingest.sentry.io/zzz', {w:4360}), cell('⚡ Recommended', {w:2200, bg:C.cream})] }),
    ]
  }),

  new Paragraph({ spacing: { before: 20, after: 20 }, children: [] }),

  hdr('9.2  package.json Scripts', HeadingLevel.HEADING_2),
  codeBlock([
    '"scripts": {',
    '  "dev":       "nodemon --watch src --ext js src/server.js",',
    '  "start":     "node src/server.js",',
    '  "migrate":   "sequelize-cli db:migrate",',
    '  "migrate:undo": "sequelize-cli db:migrate:undo",',
    '  "seed":      "sequelize-cli db:seed:all",',
    '  "test":      "jest --runInBand --forceExit",',
    '  "test:ci":   "jest --runInBand --forceExit --ci --coverage",',
    '  "lint":      "eslint src --ext .js",',
    '  "lint:fix":  "eslint src --ext .js --fix"',
    '}',
  ]),

  hdr('9.3  Dockerfile', HeadingLevel.HEADING_2),
  codeBlock([
    'FROM node:20-alpine AS base',
    'WORKDIR /app',
    'COPY package*.json ./',
    'RUN npm ci --omit=dev',
    '',
    'FROM base AS production',
    'COPY src ./src',
    'EXPOSE 3000',
    'CMD ["node", "src/server.js"]',
  ]),

  // ── 10. TESTING ──────────────────────────────────────────────────────────
  hdr('10. Testing Strategy', HeadingLevel.HEADING_1),

  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2000, 4000, 3360],
    rows: [
      new TableRow({ children: [hCell('Layer', 2000), hCell('What to test', 4000), hCell('Tooling', 3360)] }),
      new TableRow({ children: [cell('Services', {w:2000}), cell('Business rules, error cases, DB interactions', {w:4000}), cell('Jest + in-memory SQLite', {w:3360})] }),
      new TableRow({ children: [cell('Routes', {w:2000, bg:C.sky}), cell('HTTP status codes, response shapes, auth guards', {w:4000, bg:C.sky}), cell('Supertest + Jest', {w:3360, bg:C.sky})] }),
      new TableRow({ children: [cell('Sockets', {w:2000}), cell('Handshake auth, room join, message broadcast', {w:4000}), cell('socket.io-client + Jest', {w:3360})] }),
      new TableRow({ children: [cell('Migrations', {w:2000, bg:C.sky}), cell('Up/down idempotency', {w:4000, bg:C.sky}), cell('sequelize-cli + test DB', {w:3360, bg:C.sky})] }),
    ]
  }),

  new Paragraph({ spacing: { before: 20, after: 20 }, children: [] }),

  codeBlock([
    '// tests/integration/thread.test.js',
    'import request from "supertest";',
    'import { createApp } from "../../src/app.js";',
    'import { getTestToken } from "../helpers/auth.helper.js";',
    '',
    'const app = createApp();',
    '',
    'describe("POST /api/communities/:id/threads", () => {',
    '  it("returns 401 when unauthenticated", async () => {',
    '    const res = await request(app)',
    '      .post("/api/communities/1/threads")',
    '      .send({ title: "Hello", body: "World from test" });',
    '    expect(res.status).toBe(401);',
    '    expect(res.body.ok).toBe(false);',
    '  });',
    '',
    '  it("returns 201 with valid token and body", async () => {',
    '    const token = await getTestToken("member");',
    '    const res = await request(app)',
    '      .post("/api/communities/1/threads")',
    '      .set("Authorization", `Bearer ${token}`)',
    '      .send({ title: "Valid thread", body: "Long enough body here" });',
    '    expect(res.status).toBe(201);',
    '    expect(res.body.data).toHaveProperty("id");',
    '  });',
    '});',
  ]),

  // ── 11. MIGRATION PLAN ────────────────────────────────────────────────────
  hdr('11. Zero-Downtime Migration Plan', HeadingLevel.HEADING_1),
  p('Existing frontend calls /api/events, /api/jobs, /api/communities, /api/auth/* — these route paths must not change. The migration is purely internal:'),

  mixBullet([mono('Step 1: '), plain('Land Phase 1 (infra) on a branch. Run in staging. Confirm /api/health returns 200.')], 'nums'),
  mixBullet([mono('Step 2: '), plain('Land Phase 2 (auth). Replace Firebase split with single JWT. Update frontend localStorage key from firebaseToken → authToken. Roll out behind a feature flag.')], 'nums'),
  mixBullet([mono('Step 3: '), plain('Land Phases 3-5 one domain at a time. Write one migration per domain. Never mix domains in a migration.')], 'nums'),
  mixBullet([mono('Step 4: '), plain('Run migrate on prod before deploying new code. Sequelize migrations are idempotent by design.')], 'nums'),
  mixBullet([mono('Step 5: '), plain('Land Phase 7 (chat). Redis adapter must be running before deploying. Gate behind env flag ENABLE_CHAT=true.')], 'nums'),
  mixBullet([mono('Step 6: '), plain('Land Phase 8 (hardening). Flip Helmet, rate limiter, and Sentry DSN in env. Monitor error rates for 24 h.')], 'nums'),

  new Paragraph({ spacing: { before: 20, after: 20 }, children: [] }),
  note('Never run schema-breaking migrations and code deploys simultaneously. Deploy migration first, then new code. This allows instant rollback of code without touching the schema.', 'danger'),

  new Paragraph({ spacing: { before: 20, after: 20 }, children: [] }),
  divider(),
  new Paragraph({
    spacing: { before: 200, after: 0 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Backend Rebuild Playbook  ·  Confidential Internal Document  ·  v1.0', size: 16, color: C.slate, font: 'Arial', italic: true })]
  }),
];

// ─── ASSEMBLE DOC ─────────────────────────────────────────────────────────────
const doc = new Document({
  numbering,
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 22 } }
    },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 44, bold: true, font: 'Arial', color: C.navy },
        paragraph: { spacing: { before: 480, after: 140 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 30, bold: true, font: 'Arial', color: C.blue },
        paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    children,
  }]
});

// Ensure target directory exists before writing
const targetDir = '/Users/aditya/Developer/Web_dev/UniSync';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(`${targetDir}/backend-rebuild-playbook.docx`, buf);
  console.log('Done ✓');
}).catch(err => {
  console.error('Error generating document:', err);
  process.exit(1);
});
