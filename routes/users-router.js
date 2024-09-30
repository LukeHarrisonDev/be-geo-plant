const { getUsers, getUserById, postUser, deleteUserById } = require("../controllers/users.controllers")

const usersRouter = require("express").Router()

usersRouter.get("/", getUsers)
usersRouter.post("/", postUser)

usersRouter.get("/:user_id", getUserById)
usersRouter.delete("/:user_id", deleteUserById)

module.exports = usersRouter