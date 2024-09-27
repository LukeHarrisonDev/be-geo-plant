const express = require("express")
const { getUsers } = require("./controllers/users.controllers")
const { getPlants } = require("./controllers/plants.controllers")
const app = express()

app.get("/api/users", getUsers)
app.get("/api/plants", getPlants)

module.exports = app