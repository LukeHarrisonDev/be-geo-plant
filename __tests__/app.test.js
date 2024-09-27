const app = require("../app")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const db = require("../db/connection")
const endpoints = require("../endpoints.json")

const request = require("supertest")

beforeEach(() => seed(data))
afterAll(() => db.end())

describe("/api", () => {
    describe("GET", () => {
        test("200: Responds with a 200 status code and the endpoints.json file with the relevant keys", () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({body}) => {
                expect(body.endpoints).toEqual(endpoints)
                for (const endpoint in body.endpoints) {
                    expect(body.endpoints[endpoint]).toHaveProperty("description")
                    expect(body.endpoints[endpoint]).toHaveProperty("queries")
                    expect(body.endpoints[endpoint]).toHaveProperty("exampleResponse")
                }
            })
        })
    })
})

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
                    })
                    expect(Array.isArray(plant.season)).toBe(true)
                })
            })
        })
    })
})

describe("/api/found_plant", () => {
    describe("GET", () => {
        test("200: Responds with a 200 status code and an array of all found_plant objects", () => {
            return request(app)
            .get("/api/found_plants")
            .expect(200)
            .then(({body}) => {
                expect(body.foundPlants).toHaveLength(14)
                body.foundPlants.forEach((foundPlant) => {
                    expect(foundPlant).toMatchObject({
                        find_id: expect.any(Number),
                        plant_id: expect.any(Number),
                        found_by: expect.any(Number),
                        photo_url: expect.any(String),
                        location_name: expect.any(String),
                        comment: expect.any(String),
                        created_at: expect.any(String),
                        location: expect.objectContaining({
                            latitude: expect.any(Number),
                            longitude: expect.any(Number),
                        })
                    })
                })
            })
        })
    })
})