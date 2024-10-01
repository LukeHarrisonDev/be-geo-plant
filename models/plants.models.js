const db = require("../db/connection")

function fetchPlants() {
    let sqlQuery = `SELECT * FROM plants`
    return db.query(sqlQuery)
    .then(({ rows }) => {
        return rows
    })
}

function addPlant(newPlant) {

    const columns = Object.keys(newPlant)
    const values = Object.values(newPlant)

    const placeholders = values.map((_, index) => `$${index + 1}`).join(",")

    let sqlQuery = `INSERT INTO plants (${columns})
    VALUES (${placeholders})
    RETURNING *`
    return db.query(sqlQuery, values)
    .then(({ rows }) => {
        return rows[0]
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

module.exports = { fetchPlants, fetchPlantById, addPlant }