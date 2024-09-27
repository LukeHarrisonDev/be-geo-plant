const express = require("express")
const { getUsers } = require("./controllers/users.controllers")
const { getPlants } = require("./controllers/plants.controllers")
const { getFoundPlants } = require("./controllers/found-plants.controller")
const app = express()

app.get("/api/users", getUsers)
app.get("/api/plants", getPlants)
app.get("/api/found_plants", getFoundPlants)

module.exports = app