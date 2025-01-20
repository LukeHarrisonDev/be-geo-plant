const multer  = require('multer')
const upload = multer({ dest: './db/data/uploads/' })

const { getFoundPlantsByUserId, postFoundPlant } = require("../controllers/found-plants.controllers")
const { getPlantsByUserId } = require("../controllers/plants.controllers")
const { getUsers, getUserById, postUser, deleteUserById } = require("../controllers/users.controllers")

const usersRouter = require("express").Router()

usersRouter.get("/", getUsers)
usersRouter.post("/", postUser)

usersRouter.get("/:user_id", getUserById)
usersRouter.delete("/:user_id", deleteUserById)

usersRouter.get("/:user_id/found_plants", getFoundPlantsByUserId)
usersRouter.post("/:user_id/found_plants", upload.array('photo_files', 6), postFoundPlant)

usersRouter.get("/:user_id/plants", getPlantsByUserId)

module.exports = usersRouter