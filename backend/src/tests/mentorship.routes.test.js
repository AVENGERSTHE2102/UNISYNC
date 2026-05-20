const request = require('supertest');
const { createTestApp } = require('./helpers/createTestApp');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

describe('mentorship routes', () => {
  let app;
  let repositories;
  let student1;
  let student2;
  let mentor1;
  let mentor2;
  let tokenStudent1;
  let tokenStudent2;
  let tokenMentor1;

  beforeEach(async () => {
    const testApp = createTestApp();
    app = testApp.app;
    repositories = testApp.repositories;

    // Create test users
    student1 = await repositories.userRepository.create({
      name: 'Arjun Mehta',
      email: 'arjun@example.com',
      password: 'Password1!',
      role: 'student',
      branch: 'Computer Science',
      interests: ['React', 'Node.js', 'Web Dev'],
    });

    student2 = await repositories.userRepository.create({
      name: 'Priya Patel',
      email: 'priya@example.com',
      password: 'Password1!',
      role: 'student',
      branch: 'Electrical',
      interests: ['AI', 'Python'],
    });

    mentor1 = await repositories.userRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password1!',
      role: 'alumni',
      branch: 'Computer Science',
      company: 'Google',
      professionalRole: 'SWE',
      interests: ['React', 'Node.js', 'System Design'],
    });

    mentor2 = await repositories.userRepository.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'Password1!',
      role: 'admin',
      branch: 'Information Technology',
      company: 'UniSync',
      professionalRole: 'Director',
      interests: ['AI', 'Entrepreneurship'],
    });

    // Generate JWT tokens
    tokenStudent1 = jwt.sign({ sub: student1.id }, env.jwtSecret);
    tokenStudent2 = jwt.sign({ sub: student2.id }, env.jwtSecret);
    tokenMentor1 = jwt.sign({ sub: mentor1.id }, env.jwtSecret);
  });

  test('GET /api/mentorships/mentors returns potential mentors and supports filtering', async () => {
    const res = await request(app)
      .get('/api/mentorships/mentors')
      .set('Authorization', `Bearer ${tokenStudent1}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    // Student should not be returned in mentors list
    expect(res.body.data.map(m => m.name)).toContain('John Doe');
    expect(res.body.data.map(m => m.name)).toContain('Jane Smith');
    expect(res.body.data.map(m => m.name)).not.toContain('Priya Patel');

    // Filter by interest React
    const resFilter = await request(app)
      .get('/api/mentorships/mentors?interest=React')
      .set('Authorization', `Bearer ${tokenStudent1}`);

    expect(resFilter.status).toBe(200);
    expect(resFilter.body.data).toHaveLength(1);
    expect(resFilter.body.data[0].name).toBe('John Doe');
  });

  test('POST /api/mentorships creates request and calculates compatibility score', async () => {
    const res = await request(app)
      .post('/api/mentorships')
      .set('Authorization', `Bearer ${tokenStudent1}`)
      .send({ mentorId: mentor1.id });

    expect(res.status).toBe(200);
    expect(res.body.data.studentId).toBe(student1.id);
    expect(res.body.data.mentorId).toBe(mentor1.id);
    expect(res.body.data.status).toBe('pending');
    
    // Compatibility score computation:
    // Shared: React, Node.js. Total unique interests: 4 (React, Node.js, Web Dev, System Design).
    // Shared % = 2 / 3 = 66.6%.
    // Base 50 + (0.666 * 40 = 27) = 77.
    // Shared branch: Computer Science vs Computer Science (+10) = 87.
    // Score should be 87% (0.87)
    expect(res.body.data.compatibilityScore).toBeCloseTo(0.87, 2);
  });

  test('POST /api/mentorships prevents invalid and duplicate requests', async () => {
    // 1. Requesting self
    const resSelf = await request(app)
      .post('/api/mentorships')
      .set('Authorization', `Bearer ${tokenStudent1}`)
      .send({ mentorId: student1.id });
    expect(resSelf.status).toBe(400);

    // 2. Requesting a user with student role
    const resRole = await request(app)
      .post('/api/mentorships')
      .set('Authorization', `Bearer ${tokenStudent1}`)
      .send({ mentorId: student2.id });
    expect(resRole.status).toBe(400);

    // 3. Duplicate request
    await request(app)
      .post('/api/mentorships')
      .set('Authorization', `Bearer ${tokenStudent1}`)
      .send({ mentorId: mentor1.id });

    const resDup = await request(app)
      .post('/api/mentorships')
      .set('Authorization', `Bearer ${tokenStudent1}`)
      .send({ mentorId: mentor1.id });
    expect(resDup.status).toBe(400);
  });

  test('GET /api/mentorships returns connection list for student and mentor', async () => {
    // Create a request
    await request(app)
      .post('/api/mentorships')
      .set('Authorization', `Bearer ${tokenStudent1}`)
      .send({ mentorId: mentor1.id });

    // Fetch as student
    const resStudent = await request(app)
      .get('/api/mentorships')
      .set('Authorization', `Bearer ${tokenStudent1}`);

    expect(resStudent.status).toBe(200);
    expect(resStudent.body.data).toHaveLength(1);
    expect(resStudent.body.data[0].mentor.name).toBe('John Doe');

    // Fetch as mentor
    const resMentor = await request(app)
      .get('/api/mentorships')
      .set('Authorization', `Bearer ${tokenMentor1}`);

    expect(resMentor.status).toBe(200);
    expect(resMentor.body.data).toHaveLength(1);
    expect(resMentor.body.data[0].student.name).toBe('Arjun Mehta');
  });

  test('PATCH /api/mentorships/:id updates request status with authorization checks', async () => {
    // Create a request
    const createRes = await request(app)
      .post('/api/mentorships')
      .set('Authorization', `Bearer ${tokenStudent1}`)
      .send({ mentorId: mentor1.id });

    const requestId = createRes.body.data.id;

    // Student trying to accept their own request (Forbidden, 403)
    const resFail = await request(app)
      .patch(`/api/mentorships/${requestId}`)
      .set('Authorization', `Bearer ${tokenStudent1}`)
      .send({ status: 'active' });
    expect(resFail.status).toBe(403);

    // Mentor accepting request (Success, 200)
    const resOk = await request(app)
      .patch(`/api/mentorships/${requestId}`)
      .set('Authorization', `Bearer ${tokenMentor1}`)
      .send({ status: 'active' });

    expect(resOk.status).toBe(200);
    expect(resOk.body.data.status).toBe('active');
  });
});
