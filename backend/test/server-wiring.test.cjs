const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

// Execute real server wiring, Express routers and authentication middleware.
// Only infrastructure/startup side effects are replaced; no database or listener.
test('server mounts the exported auth function before protected routers', () => {
  const filename = path.resolve(__dirname, '../server.js');
  const realRequire = createRequire(filename);
  let listeners = 0;
  let connectionAttempts = 0;
  const fakeServer = { listen() { listeners++; }, close() {} };
  const overrides = {
    http: { createServer: () => fakeServer },
    'socket.io': () => ({}),
    './sockets/socketHandler': () => {},
    './config/database': {
      authenticate() {
        connectionAttempts++;
        // Hold startup at the database boundary, without a timer or socket.
        return new Promise(() => {});
      },
    },
    './config/mongodb': { connection: {} },
    dotenv: { config() {} },
  };
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
    require: name => Object.hasOwn(overrides, name) ? overrides[name] : realRequire(name),
    module, exports: module.exports,
    process: { env: { NODE_ENV: 'production' }, on() {}, exit() { throw new Error('Unexpected process exit'); } },
    console,
  }, { filename });

  const app = module.exports;
  assert.equal(typeof app, 'function');
  const { authMiddleware } = realRequire('./middleware/auth');
  const layers = app._router.stack;
  const protectedLayers = layers.filter(layer => layer.handle === authMiddleware);
  assert.equal(protectedLayers.length, 5);
  for (const layer of protectedLayers) {
    const next = layers[layers.indexOf(layer) + 1];
    assert.equal(next.name, 'router');
  }
  assert.equal(connectionAttempts, 1);
  assert.equal(listeners, 0);
});
