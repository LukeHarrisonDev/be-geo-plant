const db = require("../db/connection")

function fetchUsers() {
    let sqlQuery = `SELECT * FROM users`
    return db.query(sqlQuery)
    .then(({rows}) => {
        return rows
    })
}

module.exports = {fetchUsers}