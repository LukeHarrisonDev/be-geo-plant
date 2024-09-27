const apiRouter = require("express").Router()
const endpoints = require("../endpoints.json")

apiRouter.get("/", (request, response) => {
    response.status(200).send({ endpoints })
})


module.exports = apiRouter