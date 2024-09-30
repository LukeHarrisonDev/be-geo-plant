const db = require("../db/connection")

function fetchUsers() {
    let sqlQuery = `SELECT * FROM users`
    return db.query(sqlQuery)
    .then(({ rows }) => {
        return rows
    })
}

function addUser(newUser) {
    let sqlQuery = `INSERT INTO users (username, first_name, last_name, email, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`
    const values = [
        newUser.username,
        newUser.first_name,
        newUser.last_name,
        newUser.email,
        newUser.password,
    ]
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

module.exports = { fetchUsers, fetchUserById, addUser }