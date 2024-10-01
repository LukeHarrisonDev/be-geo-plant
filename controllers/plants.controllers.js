const { fetchPlants, fetchPlantById } = require("../models/plants.models")

function getPlants(request, response, next) {
    fetchPlants()
    .then((plants) => {
        response.status(200).send({ plants })
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
}

module.exports = { getPlants, getPlantById }