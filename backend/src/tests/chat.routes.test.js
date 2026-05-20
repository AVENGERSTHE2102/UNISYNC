const request = require('supertest');
const { createTestApp } = require('./helpers/createTestApp');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

describe('chat & messaging routes', () => {
  let app;
  let repositories;
  let user1;
  let user2;
  let user3;
  let token1;
  let token2;
  let token3;

  beforeEach(async () => {
    const testApp = createTestApp();
    app = testApp.app;
    repositories = testApp.repositories;

    // Create test users
    user1 = await repositories.userRepository.create({
      name: 'User One',
      email: 'one@example.com',
      password: 'Password1!',
      role: 'student',
      interests: [],
    });

    user2 = await repositories.userRepository.create({
      name: 'User Two',
      email: 'two@example.com',
      password: 'Password1!',
      role: 'alumni',
      interests: [],
    });

    user3 = await repositories.userRepository.create({
      name: 'User Three',
      email: 'three@example.com',
      password: 'Password1!',
      role: 'student',
      interests: [],
    });

    // Generate JWT tokens
    token1 = jwt.sign({ sub: user1.id }, env.jwtSecret);
    token2 = jwt.sign({ sub: user2.id }, env.jwtSecret);
    token3 = jwt.sign({ sub: user3.id }, env.jwtSecret);
  });

  test('GET /api/auth/users returns all users list', async () => {
    const res = await request(app)
      .get('/api/auth/users')
      .set('Authorization', `Bearer ${token1}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.data.map((u) => u.name)).toContain('User Two');
  });

  test('POST /api/chat/rooms creates a new room and checks duplicates', async () => {
    // Create direct room between user1 and user2
    const res1 = await request(app)
      .post('/api/chat/rooms')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        isGroup: false,
        participantIds: [user2.id],
      });

    expect(res1.status).toBe(201);
    expect(res1.body.data.isGroup).toBe(false);
    expect(res1.body.data.participantIds).toContain(user1.id);
    expect(res1.body.data.participantIds).toContain(user2.id);

    const firstRoomId = res1.body.data.id;

    // Try creating again: should return the same room (no duplicate)
    const res2 = await request(app)
      .post('/api/chat/rooms')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        isGroup: false,
        participantIds: [user1.id],
      });

    expect(res2.status).toBe(201);
    expect(res2.body.data.id).toBe(firstRoomId);
  });

  test('GET /api/chat/rooms lists rooms of a user', async () => {
    // Create a room first
    await request(app)
      .post('/api/chat/rooms')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        isGroup: false,
        participantIds: [user2.id],
      });

    const res = await request(app)
      .get('/api/chat/rooms')
      .set('Authorization', `Bearer ${token1}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].participantIds).toContain(user2.id);
  });

  test('GET /api/chat/rooms/:roomId/messages returns history or rejects unauthorized access', async () => {
    // Create room between user1 and user2
    const roomRes = await request(app)
      .post('/api/chat/rooms')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        isGroup: false,
        participantIds: [user2.id],
      });
    const roomId = roomRes.body.data.id;

    // Put a test message in the room
    await repositories.messageRepository.create({
      roomId,
      senderId: user1.id,
      content: 'Hello User Two!',
    });

    // User1 should be allowed to view
    const resOk = await request(app)
      .get(`/api/chat/rooms/${roomId}/messages`)
      .set('Authorization', `Bearer ${token1}`);

    expect(resOk.status).toBe(200);
    expect(resOk.body.data).toHaveLength(1);
    expect(resOk.body.data[0].content).toBe('Hello User Two!');

    // User3 (non-participant) should be rejected (403 Forbidden)
    const resFail = await request(app)
      .get(`/api/chat/rooms/${roomId}/messages`)
      .set('Authorization', `Bearer ${token3}`);

    expect(resFail.status).toBe(403);
    expect(resFail.body.ok).toBe(false);
  });
});
