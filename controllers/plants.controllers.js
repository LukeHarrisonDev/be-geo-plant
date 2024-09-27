const { fetchPlants } = require("../models/plants.models")

function getPlants(request, response, next) {
    fetchPlants()
    .then((plants) => {
        response.status(200).send({ plants })
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = { getPlants }