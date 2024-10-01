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
    const find_id = request.params.find_id
    fetchFoundPlantById(find_id)
    .then((foundPlant) => {
        response.status(200).send({ foundPlant })
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = { getFoundPlants, getFoundPlantById }