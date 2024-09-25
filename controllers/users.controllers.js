const { fetchUsers } = require("../models/users.models")

function getUsers(request, response, next) {
    fetchUsers()
    .then((users) => {
        // console.log(users, "<<< Users")
        response.status(200).send({users})
    })
    
}

module.exports = { getUsers }