const request = require('supertest');
const { createTestApp } = require('./helpers/createTestApp');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const fs = require('fs');
const path = require('path');

describe('community resources routes', () => {
  let app;
  let repositories;
  let user1;
  let user2;
  let tokenUser1;
  let tokenUser2;
  let community1;

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

    // Generate JWT tokens
    tokenUser1 = jwt.sign({ sub: user1.id }, env.jwtSecret);
    tokenUser2 = jwt.sign({ sub: user2.id }, env.jwtSecret);

    // Create test community
    community1 = await repositories.communityRepository.create({
      name: 'Science Students',
      description: 'Science Community',
      category: 'academic',
      createdBy: 1,
    });
  });

  afterEach(() => {
    const uploadDir = path.resolve(process.cwd(), 'uploads');
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      for (const file of files) {
        if (file.startsWith('file-')) {
          try {
            fs.unlinkSync(path.join(uploadDir, file));
          } catch (err) {
            // ignore cleanup errors
          }
        }
      }
    }
  });

  test('POST /api/communities/:id/resources returns 403 if user is not a member', async () => {
    const res = await request(app)
      .post(`/api/communities/${community1.id}/resources`)
      .set('Authorization', `Bearer ${tokenUser1}`)
      .attach('file', Buffer.from('test file content'), 'testfile.txt')
      .field('title', 'Test Resource');

    expect(res.status).toBe(403);
    expect(res.body.ok).toBe(false);
    expect(res.body.code).toBe('FORBIDDEN');
  });

  test('POST /api/communities/:id/resources uploads file successfully if user is a member', async () => {
    // Join community first
    await repositories.membershipRepository.create({ communityId: community1.id, userId: user1.id });

    const res = await request(app)
      .post(`/api/communities/${community1.id}/resources`)
      .set('Authorization', `Bearer ${tokenUser1}`)
      .attach('file', Buffer.from('test file content'), 'testfile.txt')
      .field('title', 'Custom Title')
      .field('tags', 'tag1,tag2');

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.code).toBe('RESOURCE_UPLOADED');
    expect(res.body.data.title).toBe('Custom Title');
    expect(res.body.data.tags).toBe('tag1,tag2');
    expect(res.body.data.uploadedBy).toBe(user1.id);
    expect(res.body.data.communityId).toBe(community1.id);

    // Verify stored file on disk exists
    const filePath = path.resolve(process.cwd(), 'uploads', res.body.data.fileUrl);
    expect(fs.existsSync(filePath)).toBe(true);
    expect(fs.readFileSync(filePath, 'utf8')).toBe('test file content');
  });

  test('POST /api/communities/:id/resources returns 400 if no file is provided', async () => {
    // Join community first
    await repositories.membershipRepository.create({ communityId: community1.id, userId: user1.id });

    const res = await request(app)
      .post(`/api/communities/${community1.id}/resources`)
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send({ title: 'No file resource' });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  test('GET /api/communities/:id/resources returns 403 if user is not a member', async () => {
    const res = await request(app)
      .get(`/api/communities/${community1.id}/resources`)
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(res.status).toBe(403);
    expect(res.body.ok).toBe(false);
    expect(res.body.code).toBe('FORBIDDEN');
  });

  test('GET /api/communities/:id/resources lists resources if user is a member', async () => {
    // Join community first
    await repositories.membershipRepository.create({ communityId: community1.id, userId: user1.id });

    // Mock resource
    await repositories.resourceRepository.create({
      title: 'Resource 1',
      fileUrl: 'file-12345.txt',
      uploadedBy: user1.id,
      communityId: community1.id,
      tags: 'tag1',
    });

    const res = await request(app)
      .get(`/api/communities/${community1.id}/resources`)
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.code).toBe('RESOURCES_LISTED');
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Resource 1');
  });

  test('GET /api/communities/:id/resources/:resourceId/download returns 403 if user is not a member', async () => {
    // Mock resource
    const resource = await repositories.resourceRepository.create({
      title: 'Secret Resource',
      fileUrl: 'file-secret.txt',
      uploadedBy: user2.id,
      communityId: community1.id,
    });

    const res = await request(app)
      .get(`/api/communities/${community1.id}/resources/${resource.id}/download`)
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(res.status).toBe(403);
    expect(res.body.ok).toBe(false);
    expect(res.body.code).toBe('FORBIDDEN');
  });

  test('GET /api/communities/:id/resources/:resourceId/download streams the file if user is a member', async () => {
    // Join community first
    await repositories.membershipRepository.create({ communityId: community1.id, userId: user1.id });

    // Create a physical file for download test
    const filename = 'file-test-download.txt';
    const uploadDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    fs.writeFileSync(path.join(uploadDir, filename), 'download content');

    // Create resource in repository
    const resource = await repositories.resourceRepository.create({
      title: 'Download Me',
      fileUrl: filename,
      uploadedBy: user1.id,
      communityId: community1.id,
    });

    const res = await request(app)
      .get(`/api/communities/${community1.id}/resources/${resource.id}/download`)
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(res.status).toBe(200);
    expect(res.text).toBe('download content');
    // Content-Disposition should offer download with correct filename
    expect(res.headers['content-disposition']).toContain('filename="Download Me"');

    // clean up this specific file
    try {
      fs.unlinkSync(path.join(uploadDir, filename));
    } catch (e) {}
  });

  test('GET /api/communities/:id/resources/:resourceId/download returns 404 for invalid resource', async () => {
    // Join community first
    await repositories.membershipRepository.create({ communityId: community1.id, userId: user1.id });

    const res = await request(app)
      .get(`/api/communities/${community1.id}/resources/9999/download`)
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
    expect(res.body.code).toBe('NOT_FOUND');
  });
});
