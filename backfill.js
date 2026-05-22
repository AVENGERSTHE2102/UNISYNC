const { initModels } = require('./backend/src/models');
const { Sequelize } = require('sequelize');

async function run() {
  const sequelize = new Sequelize('sqlite:./backend/database.sqlite', { logging: false });
  const models = initModels(sequelize);
  
  const communities = await models.Community.findAll({ where: { chatRoomId: null } });
  console.log(`Found ${communities.length} communities missing chat rooms`);
  
  for (const community of communities) {
    const room = await models.ChatRoom.create({ name: community.name, isGroup: true });
    
    // Add all members to the chat room
    const members = await models.Membership.findAll({ where: { communityId: community.id } });
    for (const member of members) {
      await models.ChatRoomParticipant.create({ roomId: room.id, userId: member.userId });
    }
    // Also add the creator if not already a member
    const existing = await models.ChatRoomParticipant.findOne({ where: { roomId: room.id, userId: community.createdBy } });
    if (!existing) {
      await models.ChatRoomParticipant.create({ roomId: room.id, userId: community.createdBy });
    }
    
    community.chatRoomId = room.id;
    await community.save();
    console.log(`Backfilled chat room ${room.id} for community ${community.id}`);
  }
  
  console.log('Done');
}
run().catch(console.error);
