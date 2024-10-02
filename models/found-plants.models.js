const db = require("../db/connection")

function fetchAllFoundPlants() {
    let sqlQuery = `SELECT * FROM found_plants`
    return db.query(sqlQuery)
    .then(({ rows }) => {
        return rows
    })
}

function fetchFoundPlantById(findId) {
    let sqlQuery = `SELECT * FROM found_plants
    WHERE find_id = $1`
    return db.query(sqlQuery, [findId])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "Not Found" })
        }
        return rows[0]
    })
}

function fetchFoundPlantsByUserId(userId) {
    let sqlQuery = `SELECT * from found_plants
    WHERE found_by = $1`
    return db.query(sqlQuery, [userId])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "Not Found" })
        }
        return rows
    })
}

function addFoundPlant(userId, newFoundPlant) {

    const columns = Object.keys(newFoundPlant)
    const values = Object.values(newFoundPlant)
    columns.unshift("found_by")
    values.unshift(+userId)

    const placeholders = values.map((_, index) => `$${index + 1}`).join(",")

    let sqlQuery = `INSERT INTO found_plants (${columns})
    VALUES (${placeholders})
    RETURNING *`
    return db.query(sqlQuery, values)
    .then(({ rows }) => {
        return rows[0]
    })
}

module.exports = { fetchAllFoundPlants, fetchFoundPlantsByUserId, fetchFoundPlantById, addFoundPlant }