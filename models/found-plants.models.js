const Distance = require("geo-distance")
const db = require("../db/connection")
const { checkIfExists } = require("../db/seeds/utils")

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

function fetchFoundPlantsByUserId(userId, sortBy = "created_at", orderBy = "desc", position, sortByDistance, plantName) {
    
    const sortGreenlist = ["plant_id", "found_by", "location_name", "location", "photo_url", "comment", "created_at"]

    const orderGreenlist = ["asc", "desc"]

    if (!sortGreenlist.includes(sortBy) || !orderGreenlist.includes(orderBy)) {
        return Promise.reject({ status: 400, message: "Bad Request" });
    }

    let queryValues = [userId]

    let sqlQuery = `SELECT found_plants.*, plants.plant_name
    FROM found_plants
    LEFT JOIN plants
    ON found_plants.plant_id = plants.plant_id
    WHERE found_by = $1 `

    let plantCheck
    if(plantName) {
        plantCheck = checkIfExists("plants", "plant_name", plantName)
        .then((result) => {
            if(!result) {
                return Promise.reject({ status: 404, message: "Not Found" })
            }
            sqlQuery += 'AND plant_name = $2 '
            queryValues.push(plantName)
        })
    } else {
        plantCheck = Promise.resolve()
    }

    return plantCheck.then(() => {
        sqlQuery += `ORDER BY ${sortBy} ${orderBy.toUpperCase()}`
        return db.query(sqlQuery, queryValues)
    })
    .then(({ rows }) => {
        return checkIfExists("users", "user_id", userId)
        .then((result) => {
            if(!result) {
                return Promise.reject({ status: 404, message: "Not Found" })
            }
            if(sortByDistance) {
                position.lat = +position.lat
                position.lon = +position.lon
                const sortDistanceByGreenlist = ["distanceInKm"]
                
                if (!sortDistanceByGreenlist.includes(sortByDistance)) {
                    return Promise.reject({ status: 400, message: "Bad Request" });
                }
                
                if (position.lat == null || position.lon == null) {
                    return Promise.reject({ status: 400, message: "Bad Request" });
                }
                
                if (isNaN(position.lat) || isNaN(position.lon) || position.lat < -90 || position.lat > 90 || position.lon < -180 || position.lon > 180) {
                    return Promise.reject({ status: 400, message: "Bad Request" });
                }

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