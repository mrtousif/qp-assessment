/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;

const axios = require('axios');

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';

  const options = {
    method: 'GET',
    url: 'http://localhost:6000/api/users',
  };
  const res = await axios.request(options);

  if (Array.isArray(res.data)) {
    for (const user of res.data) {
      if (user.role === 'admin') {
        globalThis.admin = user;
      } else if (user.role === 'user') {
        globalThis.user = user;
      }

      if (globalThis.user && globalThis.admin) {
        break;
      }
    }
  }
};
