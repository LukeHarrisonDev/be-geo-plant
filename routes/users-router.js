const { getUsers } = require("../controllers/users.controllers")

const usersRouter = require("express").Router()

usersRouter.get("/", getUsers)

module.exports = usersRouter