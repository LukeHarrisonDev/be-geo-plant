const catchInvalidEndpoints = (request, response) => {
    response.status(404).send({ message: "Not Found" })
}

function badRequest(error, request, response, next) {
    if (error.code === "22P02") {
        response.status(400).send({ message: "Bad Request"})
    }
    next(error)
}

function customError(error, request, response, next) {
    if (error.status && error.message) {
        response.status(error.status).send({ message: error.message })
    }
    next(error)
}

module.exports = { catchInvalidEndpoints, customError, badRequest }