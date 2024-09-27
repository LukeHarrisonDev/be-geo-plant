const { getFoundPlants } = require("../controllers/found-plants.controllers")

const foundPlantsRouter = require("express").Router()

foundPlantsRouter.get("/", getFoundPlants)

module.exports = foundPlantsRouter