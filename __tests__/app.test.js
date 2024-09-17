const app = require("../app")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const db = require("../db/connection")
const request = require("supertest")

beforeEach (() => seed(data))
afterAll (() => db.end())

describe ("", () => {
    test("GET", () => {

    })
})