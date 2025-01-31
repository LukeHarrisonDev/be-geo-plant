const testData = require("../data/test-data/index.js")
const authSeed = require('./auth-seed.js');
const db = require('../connection.js');

const runAuthSeed = () => {
  return authSeed(testData)
  // .then(() => db.end());
};

runAuthSeed();