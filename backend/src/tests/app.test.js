const request = require('supertest');
const { createTestApp } = require('./helpers/createTestApp');

describe('app bootstrap', () => {
  test('GET /api/health returns healthy response', async () => {
    const { app } = createTestApp();

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.data.status).toBe('ok');
    expect(response.body.reqId).toBeTruthy();
  });
});
