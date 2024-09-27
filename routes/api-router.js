const apiRouter = require("express").Router()
const endpoints = require("../endpoints.json")
const { getFoundPlants } = require("../controllers/found-plants.controller")
const usersRouter = require("./users-router")
const plantsRouter = require("./plants-router")

apiRouter.get("/", (request, response) => {
    response.status(200).send({ endpoints })
})

// apiRouter.get("/users", getUsers)
apiRouter.use("/users", usersRouter)
apiRouter.use("/plants", plantsRouter)
apiRouter.get("/found_plants", getFoundPlants)

module.exports = apiRouter