const { createRuntimeContainer } = require('./src/config/container');
const { connectDatabase } = require('./src/config/database');

async function run() {
  const container = createRuntimeContainer();
  await connectDatabase(container.sequelize);

  const { models } = container;
  const { Community, ChatRoom, ChatRoomParticipant, Membership } = models;

  const communities = await Community.findAll({ where: { chatRoomId: null } });
  console.log(`Found ${communities.length} communities missing chat rooms`);

  for (const community of communities) {
    const room = await ChatRoom.create({ name: community.name, isGroup: true });

    // Add all members to the chat room
    const members = await Membership.findAll({ where: { communityId: community.id } });
    for (const member of members) {
      await ChatRoomParticipant.create({ roomId: room.id, userId: member.userId });
    }
    // Also add the creator if not already a member
    const existing = await ChatRoomParticipant.findOne({ where: { roomId: room.id, userId: community.createdBy } });
    if (!existing) {
      await ChatRoomParticipant.create({ roomId: room.id, userId: community.createdBy });
    }

    community.chatRoomId = room.id;
    await community.save();
    console.log(`Backfilled chat room ${room.id} for community ${community.id}`);
  }

  console.log('Done');
  process.exit(0);
}
run().catch(console.error);
