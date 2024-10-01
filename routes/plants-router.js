const { getPlants, getPlantById } = require("../controllers/plants.controllers")

const plantsRouter = require("express").Router()

plantsRouter.get("/", getPlants)
plantsRouter.get("/:plant_id", getPlantById)

module.exports = plantsRouter