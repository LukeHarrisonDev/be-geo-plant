const devData = require('../data/development-data/index.js');
const authSeed = require('./auth-seed.js');
const db = require('../connection.js');

const runAuthSeed = () => {
  return authSeed(devData)
  // .then(() => db.end());
};

runAuthSeed();