const { fetchUsers, fetchUserById } = require("../models/users.models")

function getUsers(request, response, next) {
    fetchUsers()
    .then((users) => {
        response.status(200).send({ users })
    })
    .catch((error) => {
        next(error)
    })
}

function getUserById(request, response, next) {
    const user_id = request.params.user_id
    fetchUserById(user_id)
    .then((user) => {
        response.status(200).send({ user })
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = { getUsers, getUserById }