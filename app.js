const express = require("express")
const apiRouter = require("./routes/api-router")
const { getUsers } = require("./controllers/users.controllers")
const { getPlants } = require("./controllers/plants.controllers")
const { getFoundPlants } = require("./controllers/found-plants.controller")
const { catchInvalidEndpoints } = require("./error-handling")
const app = express()
const endpoints = require("./endpoints.json")

app.use("/api", apiRouter)

app.get("/api/users", getUsers)
app.get("/api/plants", getPlants)
app.get("/api/found_plants", getFoundPlants)

app.all("/*", catchInvalidEndpoints)

module.exports = app