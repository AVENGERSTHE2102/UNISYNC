const request = require('supertest');
const { createTestApp } = require('./helpers/createTestApp');

async function signupAndLogin(app, role, email) {
  const password = 'Password1!';
  await request(app).post('/api/auth/signup').send({
    name: `${role} user`,
    email,
    password,
    role,
    interests: [],
  });

  const login = await request(app).post('/api/auth/login').send({ email, password });
  return login.body.data.token;
}

describe('content routes', () => {
  test('public list endpoints return collections', async () => {
    const { app } = createTestApp();

    const endpoints = ['/api/events', '/api/jobs', '/api/communities'];

    for (const endpoint of endpoints) {
      const response = await request(app).get(endpoint);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toEqual(expect.objectContaining({ page: 1 }));
    }
  });

  test('protected create endpoints reject missing and invalid tokens', async () => {
    const { app } = createTestApp();
    const routes = [
      { endpoint: '/api/communities', payload: { name: 'AI Club', description: 'Build AI', category: 'Tech' } },
      { endpoint: '/api/events', payload: { title: 'Hack Night', description: 'Build fast', date: new Date().toISOString(), location: 'Campus', type: 'Workshop' } },
      { endpoint: '/api/jobs', payload: { title: 'Intern', company: 'UniSync', description: 'Work on product', contactEmail: 'hr@example.com', type: 'Internship', location: 'Remote' } },
    ];

    for (const route of routes) {
      const missing = await request(app).post(route.endpoint).send(route.payload);
      expect(missing.status).toBe(401);

      const invalid = await request(app)
        .post(route.endpoint)
        .set('Authorization', 'Bearer invalid-token')
        .send(route.payload);
      expect(invalid.status).toBe(401);
    }
  });

  test('create endpoints allow all users', async () => {
    const { app } = createTestApp();
    const token = await signupAndLogin(app, 'student', 'student@campus.test');

    const responses = await Promise.all([
      request(app)
        .post('/api/communities')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'General Club', description: 'desc', category: 'General' }),
      request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Meetup', description: 'desc', date: new Date().toISOString(), location: 'Hall', type: 'Networking' }),
      request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Role', company: 'Org', description: 'desc', contactEmail: 'hr@org.com', type: 'Full-time', location: 'Hybrid' }),
    ]);

    responses.forEach((response) => {
      expect(response.status).toBe(201);
    });
  });

  test('thread and reply creation support success and failure flows', async () => {
    const { app } = createTestApp();
    const adminToken = await signupAndLogin(app, 'admin', 'admin@campus.test');
    const userToken = await signupAndLogin(app, 'student', 'user@campus.test');

    const community = await request(app)
      .post('/api/communities')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Build Club', description: 'Shipping things', category: 'Tech' });

    expect(community.status).toBe(201);
    const communityId = community.body.data.id;

    const missingToken = await request(app)
      .post(`/api/communities/${communityId}/threads`)
      .send({ title: 'First thread', body: 'Hello world' });
    expect(missingToken.status).toBe(401);

    // Join community first
    await request(app)
      .post(`/api/communities/${communityId}/memberships`)
      .set('Authorization', `Bearer ${userToken}`)
      .send();

    const createdThread = await request(app)
      .post(`/api/communities/${communityId}/threads`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'First thread', body: 'Hello world' });
    expect(createdThread.status).toBe(201);

    const missingCommunity = await request(app)
      .post('/api/communities/999/threads')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Ghost thread', body: 'No community' });
    expect(missingCommunity.status).toBe(404);

    const threadId = createdThread.body.data.id;

    const createdReply = await request(app)
      .post(`/api/threads/${threadId}/replies`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ body: 'Reply body' });
    expect(createdReply.status).toBe(201);

    const missingThread = await request(app)
      .post('/api/threads/999/replies')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ body: 'No thread' });
    expect(missingThread.status).toBe(404);
  });
});
