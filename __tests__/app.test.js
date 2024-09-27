const app = require("../app")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const db = require("../db/connection")
const request = require("supertest")

beforeEach (() => seed(data))
afterAll (() => db.end())

describe ("/api/users", () => {
    describe("GET", () => {
        test("200: Responds with a 200 status code and an array of all user objects", () => {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then(({body}) => {
                console.log(JSON.stringify(body))
                expect(body.users).toHaveLength(4)
                body.users.forEach((user) => {
                    expect(user).toMatchObject({
                        user_id: expect.any(Number),
                        username: expect.any(String),
                        first_name: expect.any(String),
                        last_name: expect.any(String),
                        email: expect.any(String),
                        password: expect.any(String),
                        image_url: expect.any(String),
                    })
                })
            })
        })
    })
})