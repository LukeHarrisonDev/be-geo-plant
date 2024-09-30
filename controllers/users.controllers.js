const { fetchUsers, fetchUserById, addUser, removeUserById } = require("../models/users.models")

function getUsers(request, response, next) {
    fetchUsers()
    .then((users) => {
        response.status(200).send({ users })
    })
    .catch((error) => {
        next(error)
    })
}

function postUser(request, response, next) {
    const newUser = request.body
    addUser(newUser)
    .then((user) => {
        response.status(201).send({ user })
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

function deleteUserById(request, response, next) {
    const user_id = request.params.user_id
    removeUserById(user_id)
    .then(() => {
        response.status(204).send()
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = { getUsers, getUserById, postUser, deleteUserById }