const express = require("express")
const apiRouter = require("./routes/api-router")
const { catchInvalidEndpoints } = require("./error-handling")
const app = express()
const endpoints = require("./endpoints.json")

app.use("/api", apiRouter)

app.all("/*", catchInvalidEndpoints)

module.exports = app