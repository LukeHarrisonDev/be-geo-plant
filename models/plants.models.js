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
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "Not Found" })
        }
        return rows[0]
    })
}

module.exports = { fetchPlants, fetchPlantById }