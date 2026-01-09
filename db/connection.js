// const { Pool } = require('pg');
// const ENV = process.env.NODE_ENV || 'development';

// require('dotenv').config({
//   path: `${__dirname}/../.env.${ENV}`,
// });

// if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
//   throw new Error('PGDATABASE or DATABASE_URL not set');
// }

// const config = {};

// //if (process.env.DATABASE_URL) {
// if (ENV === 'production') {
//   config.connectionString = process.env.DATABASE_URL;
//   config.max = 2;
// }

// // console.log("NODE_ENV:", process.env.NODE_ENV);
// // console.log("ENV:", ENV);
// // console.log("Has DATABASE_URL:", !!process.env.DATABASE_URL);
// // console.log("DB host from DATABASE_URL:", process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).hostname : "none" );
// // console.log("pg config keys:", Object.keys(config));

// module.exports = new Pool(config);


const { Pool } = require('pg');

// Determine environment
const ENV = process.env.NODE_ENV || 'development';

// Load dotenv only if not in production (optional, safe)
if (ENV !== 'production') {
  require('dotenv').config({
    path: `${__dirname}/../.env.${ENV}`,
  });
}

// Ensure we have a database URL
if (ENV === 'production' && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not set');
}

// Configure the pool
const config = {};
if (process.env.DATABASE_URL) {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

// --- Debug logging ---
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("ENV:", ENV);
console.log("Has DATABASE_URL:", !!process.env.DATABASE_URL);

let dbHost = "none";
try {
  if (process.env.DATABASE_URL) {
    // Strip accidental "DATABASE_URL=" prefix if present
    const urlString = process.env.DATABASE_URL.replace(/^DATABASE_URL=/, '');
    dbHost = new URL(urlString).hostname;
  }
} catch {
  dbHost = "invalid URL";
}

console.log("DB host from DATABASE_URL:", dbHost);
console.log("pg config keys:", Object.keys(config));

// Export the pool
module.exports = new Pool(config);
