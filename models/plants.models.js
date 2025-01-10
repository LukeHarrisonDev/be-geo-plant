const db = require("../db/connection")
const { checkIfExists } = require("../db/seeds/utils")

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
    
    if (columns.length === 0) {
        return Promise.reject({ status: 400, message: "Bad Request" })
    }
    
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

function fetchPlantsByUserId(userId, sortBy = "plant_name", orderBy) {

    const sortGreenlist = ["plant_id", "plant_name", "about_plant", "plant_image_url", "rarity", "find_amount"]

    if(!sortGreenlist.includes(sortBy)) {
        return Promise.reject({ status: 400, message: "Bad Request" })
    }

    let sqlQuery = `SELECT plants.*, COUNT(found_plants.plant_id)::INTEGER AS find_amount
    FROM plants
    LEFT JOIN found_plants
    ON plants.plant_id = found_plants.plant_id
    AND found_plants.found_by = $1
    GROUP BY plants.plant_id 
    ORDER BY ${sortBy} `

    if(orderBy) {
        sqlQuery += `${orderBy.toUpperCase()} `
    } else if (sortBy === "find_amount") {
        sqlQuery += `DESC`
    } else {
        sqlQuery += `ASC`
    }

    return db.query(sqlQuery, [userId])
    .then(({ rows }) => {
        return checkIfExists("users", "user_id", userId)
        .then((result) => {
            if(!result) {
                return Promise.reject({ status: 404, message: "Not Found" })
            }
            return rows
        })
    })
}

module.exports = { fetchPlants, fetchPlantById, addPlant, fetchPlantsByUserId }