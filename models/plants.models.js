const db = require("../db/connection")

function fetchPlants() {
    let sqlQuery = `SELECT * FROM plants`
    return db.query(sqlQuery)
    .then(({ rows }) => {
        return rows
    })
}

function fetchPlantById(plantId) {
    let sqlQuery = `SELECT * FROM plants
    WHERE plant_id = $1`
    return db.query(sqlQuery, [plantId])
    .then(({ rows }) => {
        return rows[0]
    })
}

module.exports = { fetchPlants, fetchPlantById }