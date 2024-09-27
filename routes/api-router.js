const apiRouter = require("express").Router()
const endpoints = require("../endpoints.json")
const { getPlants } = require("../controllers/plants.controllers")
const { getFoundPlants } = require("../controllers/found-plants.controller")
const usersRouter = require("./users-router")

apiRouter.get("/", (request, response) => {
    response.status(200).send({ endpoints })
})

// apiRouter.get("/users", getUsers)
apiRouter.use("/users", usersRouter)
apiRouter.get("/plants", getPlants)
apiRouter.get("/found_plants", getFoundPlants)

module.exports = apiRouter