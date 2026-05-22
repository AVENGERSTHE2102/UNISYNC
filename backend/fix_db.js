require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://postgres.zxbszsobtffiowdcqpuj:Unisync123!@aws-1-ap-south-1.pooler.supabase.com:5432/postgres', { dialect: 'postgres' });
sequelize.query('ALTER TABLE "ChatRoomParticipants" ADD COLUMN "lastReadAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL;')
  .then(() => { console.log('success'); process.exit(0); })
  .catch(e => { console.error(e); process.exit(1); });
