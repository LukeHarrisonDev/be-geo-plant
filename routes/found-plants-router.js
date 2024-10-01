const { getFoundPlants, getFoundPlantById } = require("../controllers/found-plants.controllers")

const foundPlantsRouter = require("express").Router()

foundPlantsRouter.get("/", getFoundPlants)
foundPlantsRouter.get("/:find_id", getFoundPlantById)

module.exports = foundPlantsRouter