const { getFoundPlantsByUserId, postFoundPlant } = require("../controllers/found-plants.controllers")
const { getUsers, getUserById, postUser, deleteUserById } = require("../controllers/users.controllers")

const usersRouter = require("express").Router()

usersRouter.get("/", getUsers)
usersRouter.post("/", postUser)

usersRouter.get("/:user_id", getUserById)
usersRouter.delete("/:user_id", deleteUserById)

usersRouter.get("/:user_id/found_plants", getFoundPlantsByUserId)
usersRouter.post("/:user_id/found_plants", postFoundPlant)

module.exports = usersRouter