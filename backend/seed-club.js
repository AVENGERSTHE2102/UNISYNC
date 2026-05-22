const { createRuntimeContainer } = require('./src/config/container');
const { connectDatabase } = require('./src/config/database');

async function run() {
  const container = createRuntimeContainer();
  await connectDatabase(container.sequelize);
  const { models } = container;
  
  // Find a user to be creator
  const user = await models.User.findOne();
  if (!user) {
    console.log("No users found to create a community.");
    process.exit(0);
  }

  // Check if real communities exist
  const count = await models.Community.count();
  if (count === 0) {
    console.log("Seeding real community...");
    const room = await models.ChatRoom.create({ name: 'Hackers Space', isGroup: true });
    await models.ChatRoomParticipant.create({ roomId: room.id, userId: user.id });
    
    await models.Community.create({
      name: 'Hackers Space',
      description: 'A club for people who love to code and build cool things!',
      category: 'Tech',
      createdBy: user.id,
      chatRoomId: room.id
    });
    console.log("Seeded 'Hackers Space'.");
  } else {
    console.log("Real communities already exist.");
  }
  
  process.exit(0);
}
run().catch(console.error);
