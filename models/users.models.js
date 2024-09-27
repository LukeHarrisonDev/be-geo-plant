const db = require("../db/connection")

function fetchUsers() {
    let sqlQuery = `SELECT * FROM users`
    return db.query(sqlQuery)
    .then(({ rows }) => {
        return rows
    })
}

function fetchUserById(userId) {
    // console.log(+userId, "<<< User Id")
    // console.log(typeof +userId, "<<< Type")
    // if (typeof +userId !== "number") {
    //     return Promise.reject({ status: 404, message: "Not Found" })
    // }
    let sqlQuery = `SELECT users.*, COUNT(found_plants.found_by) AS plants_count
    FROM users
    LEFT JOIN found_plants
    ON users.user_id = found_plants.found_by
    WHERE user_id = $1
    GROUP BY users.user_id`
    return db.query(sqlQuery, [userId])
    .then(({ rows }) => {
        return rows[0]
    })
}

module.exports = { fetchUsers, fetchUserById }