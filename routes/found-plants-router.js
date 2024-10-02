const { getAllFoundPlants, getFoundPlantById } = require("../controllers/found-plants.controllers")

const foundPlantsRouter = require("express").Router()

foundPlantsRouter.get("/", getAllFoundPlants)
foundPlantsRouter.get("/:find_id", getFoundPlantById)

module.exports = foundPlantsRouter