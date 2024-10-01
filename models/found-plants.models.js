const db = require("../db/connection")

function fetchFoundPlants() {
    let sqlQuery = `SELECT * FROM found_plants`
    return db.query(sqlQuery)
    .then(({ rows }) => {
        return rows
    })
}

function fetchFoundPlantById(foundPlantId) {
    let sqlQuery = `SELECT * FROM found_plants
    WHERE find_id = $1`
    return db.query(sqlQuery, [foundPlantId])
    .then(({ rows }) => {
        return rows[0]
    })
}

module.exports = { fetchFoundPlants, fetchFoundPlantById }