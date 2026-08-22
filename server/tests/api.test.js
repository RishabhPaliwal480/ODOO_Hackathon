const test = require('node:test');
const assert = require('node:assert/strict');

const { app, prisma } = require('../app');

let server;
let baseUrl;

test.before((t, done) => {
  server = app.listen(0, () => {
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;
    done();
  });
});

test('health endpoint returns healthy status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'healthy');
  assert.equal(data.database, 'connected');
});

test('login returns a token for the seeded demo user', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alex@globetrotter.io', password: 'password123' }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.user.email, 'alex@globetrotter.io');
  assert.ok(data.token);
});

test.after(async () => {
  server?.close();
  await prisma.$disconnect();
});

