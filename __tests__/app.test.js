const app = require("../app")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const db = require("../db/connection")
const request = require("supertest")

beforeEach(() => seed(data))
afterAll(() => db.end())

describe("/api/users", () => {
    describe("GET", () => {
        test("200: Responds with a 200 status code and an array of all user objects", () => {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then(({body}) => {
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

describe("/api/plants", () => {
    describe("GET", () => {
        test("200: Responds with a 200 status code and an array of all plant objects", () => {
            return request(app)
            .get("/api/plants")
            .expect(200)
            .then(({body}) => {
                expect(body.plants).toHaveLength(7)
                body.plants.forEach((plant) => {
                    expect(plant).toMatchObject({
                        plant_id: expect.any(Number),
                        plant_name: expect.any(String),
                        about_plant: expect.any(String),
                        plant_image_url: expect.any(String),
                        rarity: expect.any(Number),
                        season: expect.any(Array),
                    })
                    expect(Array.isArray(plant.season)).toBe(true)
                })
            })
        })
    })
})