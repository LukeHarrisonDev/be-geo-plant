const db = require("../db/connection")

function fetchUsers() {
    let sqlQuery = `SELECT * FROM users`
    return db.query(sqlQuery)
    .then(({rows}) => {
        console.log(rows, "<<<< Rows")
        return rows
    })
}

module.exports = {fetchUsers}