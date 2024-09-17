const format = require('pg-format')
const db = require("../connection")

function seed ({userData}) {
    return db.query(`DROP TABLE IF EXISTS plantsfound;`)
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS plants;`)
    })
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`)
    })
    .then(() => {
        return db.query(
            `CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR UNIQUE NOT NULL,
            first_name VARCHAR (30) NOT NULL,
            last_name VARCHAR (30) NOT NULL,
            email VARCHAR (60) UNIQUE NOT NULL,
            password VARCHAR (30) NOT NULL,
            image_url VARCHAR,
            admin BOOLEAN DEFAULT FALSE
            );`
        )
    })
    .then(() => {
        const insertUsersData = format(
            `INSERT INTO users (
            username, first_name, last_name, email, password, image_url, admin
            ) VALUES %L;`,
            userData.map(({ username, first_name, last_name, email, password, image_url, admin }) => {
                return [username, first_name, last_name, email, password, image_url, admin]
            })
        )
        return db.query(insertUsersData)
    })
}

module.exports = seed