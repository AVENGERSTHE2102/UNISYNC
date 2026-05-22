const { createRuntimeContainer } = require('./src/config/container');
const { connectDatabase } = require('./src/config/database');

async function run() {
  const container = createRuntimeContainer();
  await connectDatabase(container.sequelize);

  await container.sequelize.query(`
    ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "profilePhoto" VARCHAR(255);
  `);
  console.log('Added profilePhoto column (or it already existed).');
  process.exit(0);
}
run().catch(err => { console.error(err); process.exit(1); });
