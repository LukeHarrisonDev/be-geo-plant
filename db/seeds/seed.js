const format = require('pg-format')
const db = require("../connection")

function seed ({typeData}) {
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
    .then(() => {
        return db.query(
            `CREATE TABLE types (
            type_id SERIAL PRIMARY KEY,
            plant_name VARCHAR(30) UNIQUE NOT NULL
            about_plant VARCHARD NOT NULL
            );`
        )
    })
    .then(() => {
        const insertTypesData = format(
            `INSERT INTO types (
            plant_name, about_plant
            ) VALUES %L;`,
            typeData.map(({plant_name, about_plant }) => {
                [plant_name, about_plant]
            })
        )
        return db.query(insertTypesData)
        .then(() => {
            return db.query(`SELECT * FROM types;`)
            .then((result) => {
                console.log(result)
            })
        })
    })









}

module.exports = seed