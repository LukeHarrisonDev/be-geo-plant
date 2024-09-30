const { getUsers, getUserById, postUser } = require("../controllers/users.controllers")

const usersRouter = require("express").Router()

usersRouter.get("/", getUsers)
usersRouter.post("/", postUser)
usersRouter.get("/:user_id", getUserById)

module.exports = usersRouter