const request = require('supertest');
const { createTestApp } = require('./helpers/createTestApp');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

describe('community memberships routes', () => {
  let app;
  let repositories;
  let user1;
  let user2;
  let admin;
  let tokenUser1;
  let tokenUser2;
  let tokenAdmin;
  let community1;
  let thread1;

  beforeEach(async () => {
    const testApp = createTestApp();
    app = testApp.app;
    repositories = testApp.repositories;

    // Create test users
    user1 = await repositories.userRepository.create({
      name: 'User One',
      email: 'user1@example.com',
      password: 'Password1!',
      role: 'student',
    });

    user2 = await repositories.userRepository.create({
      name: 'User Two',
      email: 'user2@example.com',
      password: 'Password1!',
      role: 'student',
    });

    admin = await repositories.userRepository.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Password1!',
      role: 'admin',
    });

    // Generate JWT tokens
    tokenUser1 = jwt.sign({ sub: user1.id }, env.jwtSecret);
    tokenUser2 = jwt.sign({ sub: user2.id }, env.jwtSecret);
    tokenAdmin = jwt.sign({ sub: admin.id }, env.jwtSecret);

    // Create test community
    community1 = await repositories.communityRepository.create({
      name: 'CS Students',
      description: 'Computer Science Community',
      category: 'academic',
      createdBy: admin.id,
    });

    // Create a thread in community1 (using admin who by default isn't restricted in service unless we want to, wait. Let's make admin join to create thread, or we can just mock-create the thread directly in repo to bypass service check)
    thread1 = await repositories.threadRepository.create({
      communityId: community1.id,
      authorId: admin.id,
      title: 'Welcome Thread',
      body: 'Welcome to CS Students community!',
    });
  });

  test('POST /api/communities/:id/memberships allows a user to join', async () => {
    const res = await request(app)
      .post(`/api/communities/${community1.id}/memberships`)
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send();

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.code).toBe('JOINED_COMMUNITY');
    expect(res.body.data.communityId).toBe(community1.id);
    expect(res.body.data.userId).toBe(user1.id);

    // Check membership exists
    const isMember = await repositories.membershipRepository.isMember(community1.id, user1.id);
    expect(isMember).toBe(true);
  });

  test('POST /api/communities/:id/memberships returns 409 if already a member', async () => {
    // Join first
    await repositories.membershipRepository.create({ communityId: community1.id, userId: user1.id });

    const res = await request(app)
      .post(`/api/communities/${community1.id}/memberships`)
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send();

    expect(res.status).toBe(409);
    expect(res.body.ok).toBe(false);
    expect(res.body.code).toBe('CONFLICT');
  });

  test('DELETE /api/communities/:id/memberships allows a user to leave', async () => {
    // Join first
    await repositories.membershipRepository.create({ communityId: community1.id, userId: user1.id });

    const res = await request(app)
      .delete(`/api/communities/${community1.id}/memberships`)
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.code).toBe('LEFT_COMMUNITY');

    const isMember = await repositories.membershipRepository.isMember(community1.id, user1.id);
    expect(isMember).toBe(false);
  });

  test('DELETE /api/communities/:id/memberships returns 404 if not a member', async () => {
    const res = await request(app)
      .delete(`/api/communities/${community1.id}/memberships`)
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send();

    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
    expect(res.body.code).toBe('NOT_FOUND');
  });

  test('POST /api/communities/:id/threads returns 403 if user is not a member', async () => {
    const res = await request(app)
      .post(`/api/communities/${community1.id}/threads`)
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send({
        title: 'New Thread Title',
        body: 'This is a thread body long enough.',
      });

    expect(res.status).toBe(403);
    expect(res.body.ok).toBe(false);
    expect(res.body.code).toBe('FORBIDDEN');
  });

  test('POST /api/communities/:id/threads succeeds if user is a member', async () => {
    // Join first
    await repositories.membershipRepository.create({ communityId: community1.id, userId: user1.id });

    const res = await request(app)
      .post(`/api/communities/${community1.id}/threads`)
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send({
        title: 'New Thread Title',
        body: 'This is a thread body long enough.',
      });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.title).toBe('New Thread Title');
  });

  test('POST /api/threads/:threadId/replies returns 403 if user is not a member', async () => {
    const res = await request(app)
      .post(`/api/threads/${thread1.id}/replies`)
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send({
        body: 'This is a reply to the welcome thread.',
      });

    expect(res.status).toBe(403);
    expect(res.body.ok).toBe(false);
    expect(res.body.code).toBe('FORBIDDEN');
  });

  test('POST /api/threads/:threadId/replies succeeds if user is a member', async () => {
    // Join first
    await repositories.membershipRepository.create({ communityId: community1.id, userId: user1.id });

    const res = await request(app)
      .post(`/api/threads/${thread1.id}/replies`)
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send({
        body: 'This is a reply to the welcome thread.',
      });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.body).toBe('This is a reply to the welcome thread.');
  });
});
