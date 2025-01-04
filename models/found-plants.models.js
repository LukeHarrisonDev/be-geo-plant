const Distance = require("geo-distance")
const db = require("../db/connection")

function fetchAllFoundPlants() {
    let sqlQuery = `SELECT * FROM found_plants`
    return db.query(sqlQuery)
    .then(({ rows }) => {
        return rows
    })
}

function fetchFoundPlantById(findId) {
    let sqlQuery = `SELECT found_plants.*, plants.plant_name
    FROM found_plants
    LEFT JOIN plants
    ON found_plants.plant_id = plants.plant_id
    WHERE find_id = $1`
    return db.query(sqlQuery, [findId])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "Not Found" })
        }
        return rows[0]
    })
}

function fetchFoundPlantsByUserId(userId, sortBy = "created_at", orderBy = "desc", position, sort_by_distance) {
    
    const sortGreenlist = ["plant_id", "found_by", "location_name", "location", "photo_url", "comment", "created_at"]

    const orderGreenlist = ["asc", "desc"]

    if (!sortGreenlist.includes(sortBy) || !orderGreenlist.includes(orderBy)) {
        return Promise.reject({ status: 400, message: "Bad request" });
    }

    let sqlQuery = `SELECT found_plants.*, plants.plant_name
    FROM found_plants
    LEFT JOIN plants
    ON found_plants.plant_id = plants.plant_id
    WHERE found_by = $1
    ORDER BY ${sortBy} ${orderBy.toUpperCase()}`
    return db.query(sqlQuery, [userId])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "Not Found" })
        }
        if(sort_by_distance) {
            const foundPlantsWithDistance = rows.map((foundPlant) => {
                const distance = Distance.between(position, foundPlant.location)
                foundPlant.distanceInRadians = distance.radians
                foundPlant.distanceInKm = distance.human_readable().distance
                return foundPlant
            })
            foundPlantsWithDistance.sort((a, b) => {
                return a.distanceInKm - b.distanceInKm
            })
            return foundPlantsWithDistance
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
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "Not Found" })
        }
        return rows[0]
    })
}

function removeFoundPlantById(findId) {
    let sqlQuery = `DELETE FROM found_plants
    WHERE find_id = $1
    RETURNING *`
    return db.query(sqlQuery, [findId])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "Not Found"})
        }
    })
}

module.exports = {
    fetchAllFoundPlants,
    fetchFoundPlantsByUserId,
    fetchFoundPlantById,
    addFoundPlant,
    removeFoundPlantById
}