const format = require('pg-format')
const db = require("../connection")

function seed ({typeData}) {
    return db.query(`DROP TABLE IF EXISTS plantsfound;`)
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS plants;`)
    })
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`)
    })
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS types;`)
    })
    .then(() => {
        return db.query(
            `CREATE TABLE types (
            type_id SERIAL PRIMARY KEY,
            plant_name VARCHAR(30) UNIQUE NOT NULL,
            about_plant VARCHAR NOT NULL
            );`
        )
    })
    .then(() => {
        const insertTypesData = format(
            `INSERT INTO types (
            plant_name, about_plant
            ) VALUES %L;`,
            typeData.map(({plant_name, about_plant }) => {
                return [plant_name, about_plant]
            })
        )
        return db.query(insertTypesData)
    })
}

module.exports = seed