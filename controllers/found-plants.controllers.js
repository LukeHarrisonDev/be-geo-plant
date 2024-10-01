const { fetchFoundPlants, fetchFoundPlantById } = require("../models/found-plants.models")

function getFoundPlants(request, response, next) {
    fetchFoundPlants()
    .then((foundPlants) => {
        response.status(200).send({ foundPlants })
    })
    .catch((error) => {
        next(error)
    })
}

function getFoundPlantById(request, response, next) {
    const found_plant_id = request.params.found_plant_id
    fetchFoundPlantById(found_plant_id)
    .then((foundPlant) => {
        response.status(200).send({ foundPlant })
    })
}

module.exports = { getFoundPlants, getFoundPlantById }