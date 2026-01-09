const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

const config = {};

// if (ENV === 'production') {
if (process.env.DATABASE_URL) {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("ENV:", ENV);
console.log("Has DATABASE_URL:", !!process.env.DATABASE_URL);
console.log(
  "DB host from DATABASE_URL:",
  process.env.DATABASE_URL
    ? new URL(process.env.DATABASE_URL).hostname
    : "none"
);
console.log("pg config keys:", Object.keys(config));

module.exports = new Pool(config);
