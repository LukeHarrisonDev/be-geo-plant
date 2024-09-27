const { getUsers, getUserById } = require("../controllers/users.controllers")

const usersRouter = require("express").Router()

usersRouter.get("/", getUsers)
usersRouter.get("/:user_id", getUserById)

module.exports = usersRouter