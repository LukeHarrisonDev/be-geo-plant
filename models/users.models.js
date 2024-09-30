const { use } = require("../app")
const db = require("../db/connection")

function fetchUsers() {
    let sqlQuery = `SELECT * FROM users`
    return db.query(sqlQuery)
    .then(({ rows }) => {
        return rows
    })
}

function addUser(newUser) {
    const columns = Object.keys(newUser)
    const values = Object.values(newUser)

    const placeholders = values.map((_, index) => `$${index + 1}`).join(",")

    let sqlQuery = `INSERT INTO users (${columns})
    VALUES (${placeholders})
    RETURNING *`
    
    return db.query(sqlQuery, values)
    .then(({ rows }) => {
        rows[0].plants_count = "0"
        return rows[0]
    })
}

function fetchUserById(userId) {
    let sqlQuery = `SELECT users.*, COUNT(found_plants.found_by) AS plants_count
    FROM users
    LEFT JOIN found_plants
    ON users.user_id = found_plants.found_by
    WHERE user_id = $1
    GROUP BY users.user_id`
    return db.query(sqlQuery, [userId])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "Not Found" })
        }
        return rows[0]
    })
}

function removeUserById(userId) {
    let sqlQuery = `DELETE FROM users
    WHERE user_id = $1
    RETURNING *`
    return db.query(sqlQuery, [userId])
}

module.exports = { fetchUsers, fetchUserById, addUser, removeUserById }