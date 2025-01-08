const { fetchAllFoundPlants, fetchFoundPlantById, fetchFoundPlantsByUserId, addFoundPlant, removeFoundPlantById, } = require("../models/found-plants.models")

function getAllFoundPlants(request, response, next) {
    fetchAllFoundPlants()
    .then((foundPlants) => {
        response.status(200).send({ foundPlants })
    })
    .catch((error) => {
        next(error)
    })
}

function getFoundPlantById(request, response, next) {
    const { find_id } = request.params
    fetchFoundPlantById(find_id)
    .then((foundPlant) => {
        response.status(200).send({ foundPlant })
    })
    .catch((error) => {
        next(error)
    })
}

function getFoundPlantsByUserId(request, response, next) {
    const { user_id } = request.params
    const { sort_by, order_by, sort_by_distance, plant_name, season } = request.query
    const position = {lat: request.headers.lat, lon: request.headers.lon}
    fetchFoundPlantsByUserId(user_id, sort_by, order_by, position, sort_by_distance, plant_name, season)
    .then(( foundPlants ) => {
        response.status(200).send({ foundPlants })
    })
    .catch((error) => {
        next(error)
    })
}

function postFoundPlant(request, response, next) {
    const { user_id } = request.params
    const newFoundPlant = request.body
    addFoundPlant(user_id, newFoundPlant)
    .then((foundPlant) => {
        response.status(201).send({ foundPlant })
    })
    .catch((error) => {
        next(error)
    })
}

function deleteFoundPlantById(request, response, next) {
    const { find_id } = request.params
    removeFoundPlantById(find_id)
    .then(() => {
        response.status(204).send()
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = {
    getAllFoundPlants,
    getFoundPlantsByUserId,
    getFoundPlantById,
    postFoundPlant,
    deleteFoundPlantById
}