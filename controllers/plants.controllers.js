const { fetchPlants, fetchPlantById, addPlant, fetchPlantsByUserId } = require("../models/plants.models")

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
    const { plant_id } = request.params
    fetchPlantById(plant_id)
    .then((plant) => {
        response.status(200).send({ plant })
    })
    .catch((error) => {
        next(error)
    })
}

function getPlantsByUserId(request, response, next) {
    const { user_id } = request.params
    const { sort_by, order_by, season } = request.query
    fetchPlantsByUserId(user_id, sort_by, order_by, season)
    .then((plants) => {
        response.status(200).send({ plants })
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = { getPlants, getPlantById, postPlant, getPlantsByUserId }