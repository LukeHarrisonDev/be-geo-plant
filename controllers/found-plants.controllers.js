const { fetchAllFoundPlants, fetchFoundPlantById, fetchFoundPlantsByUserId, addFoundPlant, } = require("../models/found-plants.models")

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
    const find_id = request.params.find_id
    fetchFoundPlantById(find_id)
    .then((foundPlant) => {
        response.status(200).send({ foundPlant })
    })
    .catch((error) => {
        next(error)
    })
}

function getFoundPlantsByUserId(request, response, next) {
    const user_id = request.params.user_id
    fetchFoundPlantsByUserId(user_id)
    .then(( foundPlants ) => {
        response.status(200).send({ foundPlants })
    })
    .catch((error) => {
        next(error)
    })
}

function postFoundPlant(request, response, next) {
    const user_id = request.params.user_id
    const newFoundPlant = request.body
    addFoundPlant(user_id, newFoundPlant)
    .then((foundPlant) => {
        response.status(201).send({ foundPlant })
    })
}

module.exports = { getAllFoundPlants, getFoundPlantsByUserId, getFoundPlantById, postFoundPlant }