const db = require("../connection")

function seed ({}) {
    return db.query(`DROP TABLE IF EXISTS plants-found;`)
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS plants;`)
    })
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`)
    })
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS types;`)
    })
}

module.exports = seed