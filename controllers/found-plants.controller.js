const { fetchFoundPlants } = require("../models/found-plants.models")

function getFoundPlants(request, response, next) {
    fetchFoundPlants()
    .then((foundPlants) => {
        response.status(200).send({ foundPlants })
    })
    .catch((error) => {
        next(error)
    })
} 

module.exports = { getFoundPlants }