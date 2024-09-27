const apiRouter = require("express").Router()
const endpoints = require("../endpoints.json")
const usersRouter = require("./users-router")
const plantsRouter = require("./plants-router")
const foundPlantsRouter = require("./found-plants-router")

apiRouter.get("/", (request, response) => {
    response.status(200).send({ endpoints })
})

apiRouter.use("/users", usersRouter)
apiRouter.use("/plants", plantsRouter)
apiRouter.use("/found_plants", foundPlantsRouter)

module.exports = apiRouter