const catchInvalidEndpoints = (request, response) => {
    response.status(404).send({ message: "Not Found" })
};

module.exports = { catchInvalidEndpoints }