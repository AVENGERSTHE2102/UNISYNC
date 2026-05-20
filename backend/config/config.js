require('dotenv').config({ quiet: true });

const databaseUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
if (databaseUrl && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl;
}

function buildConfig() {
  return {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
}

module.exports = {
  development: buildConfig(),
  test: buildConfig(),
  production: buildConfig(),
};
