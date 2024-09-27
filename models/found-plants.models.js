const db = require("../db/connection")

function fetchFoundPlants() {
    let sqlQuery = `SELECT * FROM found_plants`
    return db.query(sqlQuery)
    .then(({ rows }) => {
        return rows
    })
}

module.exports = { fetchFoundPlants }