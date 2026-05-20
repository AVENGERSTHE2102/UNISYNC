const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });

const nodeEnv = process.env.NODE_ENV || 'development';
const isTest = nodeEnv === 'test';

function parseBoolean(value, defaultValue = false) {
  if (value === undefined) {
    return defaultValue;
  }

  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function readRequired(name, fallback) {
  const value = process.env[name] || fallback;

  if (!value && !isTest) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

module.exports = {
  nodeEnv,
  isTest,
  port: Number(process.env.PORT || 3000),
  appName: process.env.APP_NAME || 'UniSync API',
  jwtSecret: readRequired('JWT_SECRET', isTest ? 'test-secret' : undefined),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  databaseUrl: process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || '',
  dbSync: parseBoolean(process.env.DB_SYNC, false),
  dbLogging: parseBoolean(process.env.DB_LOGGING, false),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  serveStatic: parseBoolean(process.env.SERVE_STATIC, false),
  staticDir: path.resolve(__dirname, '../../../frontend/public'),
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },
};
