const request = require('supertest');
const { createTestApp } = require('./helpers/createTestApp');

describe('auth routes', () => {
  test('signup succeeds and duplicate email is rejected', async () => {
    const { app } = createTestApp();
    const payload = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Password1!',
      role: 'admin',
      interests: ['ai-ml'],
    };

    const created = await request(app).post('/api/auth/signup').send(payload);
    expect(created.status).toBe(201);
    expect(created.body.data.user.email).toBe(payload.email);
    expect(created.body.data.token).toBeTruthy();

    const duplicate = await request(app).post('/api/auth/signup').send(payload);
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.ok).toBe(false);
  });

  test('login succeeds and invalid credentials are rejected', async () => {
    const { app } = createTestApp();
    const signupPayload = {
      name: 'Student User',
      email: 'student@example.com',
      password: 'Password1!',
      role: 'student',
      interests: [],
    };

    await request(app).post('/api/auth/signup').send(signupPayload);

    const login = await request(app).post('/api/auth/login').send({
      email: signupPayload.email,
      password: signupPayload.password,
    });
    expect(login.status).toBe(200);
    expect(login.body.data.user.role).toBe('student');

    const invalid = await request(app).post('/api/auth/login').send({
      email: signupPayload.email,
      password: 'WrongPass1!',
    });
    expect(invalid.status).toBe(401);
    expect(invalid.body.ok).toBe(false);
  });
});
