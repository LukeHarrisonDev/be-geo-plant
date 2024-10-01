const { fetchPlants, fetchPlantById, addPlant } = require("../models/plants.models")

function getPlants(request, response, next) {
    fetchPlants()
    .then((plants) => {
        response.status(200).send({ plants })
    })
    .catch((error) => {
        next(error)
    })
}

function postPlant(request, response, next) {
    const newPlant = request.body
    addPlant(newPlant)
    .then((plant) => {
        response.status(201).send({ plant })
    })
    .catch((error) => {
        next(error)
    })
}

function getPlantById(request, response, next) {
    const plant_id = request.params.plant_id
    fetchPlantById(plant_id)
    .then((plant) => {
        response.status(200).send({ plant })
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = { getPlants, getPlantById, postPlant }