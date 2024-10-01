const { getPlants, getPlantById, postPlant } = require("../controllers/plants.controllers")

const plantsRouter = require("express").Router()

plantsRouter.get("/", getPlants)
plantsRouter.post("/", postPlant)

plantsRouter.get("/:plant_id", getPlantById)

module.exports = plantsRouter