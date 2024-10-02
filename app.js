const express = require("express")
const apiRouter = require("./routes/api-router")
const { catchInvalidEndpoints, customError, badRequest, notFoundError } = require("./error-handling")
const app = express()

app.use(express.json())

app.use("/api", apiRouter)

////-= Error Handling =-////
app.all("/*", catchInvalidEndpoints)
app.use(badRequest)
app.use(notFoundError)
app.use(customError)

module.exports = app