process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../src/server');
const db = require('../src/models');

describe('Authentication & Protected Routes Integration Tests', () => {
  beforeAll(async () => {
    // Sync the database before running tests
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close the database connection after all tests have completed
    await db.sequelize.close();
  });

  const testStudent = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    userType: 'student',
    year: 3,
    branch: 'Computer Science',
    interests: ['AI', 'Web Development']
  };

  const testAdmin = {
    name: 'Admin User',
    email: 'admin@unisync.edu',
    userType: 'admin',
    interests: []
  };

  describe('POST /api/auth/signup', () => {
    it('should successfully sync and create a new student user profile in the database', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testStudent);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User profile synced and created successfully');
      expect(response.body).toHaveProperty('userId');

      // Verify user is in database
      const user = await db.User.findOne({ where: { email: testStudent.email } });
      expect(user).toBeTruthy();
      expect(user.name).toBe(testStudent.name);
      expect(user.userType).toBe(testStudent.userType);
      expect(user.password).toBe('MANAGED_BY_FIREBASE');
    });

    it('should successfully sync and create an admin user profile in the database', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testAdmin);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('userId');
    });

    it('should reject signup with 400 when user profile already exists', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testStudent);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User profile already exists in database');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should reject login with 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ firebaseToken: 'someToken' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email identifier is required');
    });

    it('should auto-create a default student user profile when email is not found in database on login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'new-login@example.com', firebaseToken: 'someToken' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login session approved and synced');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('userType', 'student');

      // Verify the new user is in the database
      const user = await db.User.findOne({ where: { email: 'new-login@example.com' } });
      expect(user).toBeTruthy();
      expect(user.name).toBe('new-login');
      expect(user.userType).toBe('student');
    });

    it('should successfully log in and return a signed JWT token and userType role', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testStudent.email, firebaseToken: 'mockFirebaseToken' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login session approved and synced');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('userType', 'student');
    });
  });

  describe('Protected Routes Access Control (POST /api/events)', () => {
    let studentToken;
    let adminToken;

    beforeAll(async () => {
      // Fetch JWT tokens by logging in the synced users
      const studentLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: testStudent.email, firebaseToken: 'mockFirebaseToken' });
      studentToken = studentLogin.body.token;

      const adminLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: testAdmin.email, firebaseToken: 'mockFirebaseToken' });
      adminToken = adminLogin.body.token;
    });

    it('should reject event creation with 401 when no token is provided', async () => {
      const response = await request(app)
        .post('/api/events')
        .send({
          title: 'Unauthenticated Hackathon',
          date: '2026-06-01',
          description: 'hack',
          eventType: 'Competition'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Not authorized, no token provided');
    });

    it('should reject event creation with 401 when token is invalid', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', 'Bearer invalid_token_value_here')
        .send({
          title: 'Invalid Token Hackathon',
          date: '2026-06-01',
          description: 'hack',
          eventType: 'Competition'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Not authorized, token failed');
    });

    it('should forbid event creation with 403 when user is student (insufficient privileges)', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Student Hackathon',
          date: '2026-06-01',
          description: 'hack',
          eventType: 'Competition'
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Forbidden');
    });

    it('should permit event creation with 201 when user is admin', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Grand Annual Hackathon',
          date: '2026-06-15',
          description: 'Join us for a massive hackathon!',
          eventType: 'Workshop'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Event created successfully');
      expect(response.body).toHaveProperty('event');
      expect(response.body.event.title).toBe('Grand Annual Hackathon');
    });
  });
});
