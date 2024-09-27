const { getPlants } = require("../controllers/plants.controllers")

const plantsRouter = require("express").Router()

plantsRouter.get("/", getPlants)

module.exports = plantsRouter