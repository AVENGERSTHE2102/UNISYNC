const { createRuntimeContainer } = require('./src/config/container');
const { connectDatabase } = require('./src/config/database');

async function run() {
  const container = createRuntimeContainer();
  await connectDatabase(container.sequelize);

  const { models } = container;
  const { Community, ChatRoom, ChatRoomParticipant } = models;
  
  const participants = await ChatRoomParticipant.findAll();
  console.log('Participants:', participants.map(p => ({ roomId: p.roomId, userId: p.userId })));

  process.exit(0);
}
run().catch(console.error);
