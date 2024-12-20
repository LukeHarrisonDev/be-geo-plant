const { getAllFoundPlants, getFoundPlantById, deleteFoundPlantById } = require("../controllers/found-plants.controllers")

const foundPlantsRouter = require("express").Router()

foundPlantsRouter.get("/", getAllFoundPlants)
foundPlantsRouter.get("/:find_id", getFoundPlantById)
foundPlantsRouter.delete("/:find_id", deleteFoundPlantById)

module.exports = foundPlantsRouter