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

module.exports = { fetchAllFoundPlants, fetchFoundPlantById }