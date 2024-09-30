const app = require("../app")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const db = require("../db/connection")
const endpoints = require("../endpoints.json")

const request = require("supertest")

beforeEach(() => seed(data))
afterAll(() => db.end())

describe("/not-an-endpoint", () => {
    describe("GET", () => {
        test("404: Responds with 'Not Found' if the endpoint doesn't exist", () => {
            return request(app)
            .get("/not-an-endpoint")
            .expect(404)
            .then(({body}) => {
                expect(body).toEqual({ message: "Not Found" })
            })
        })
    })
})

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
    describe("POST", () => {
        test("201: Responds with a 201 status code and the posted user object when the client sends only the required fields", () => {
            const newUser = {
                username: "TestUser*%$_1",
                first_name: "Testfirst",
                last_name: "Test Last",
                email: "testemail@gmail.com",
                password: "PasswordTest123!",
            }
            return request(app)
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .then(({body}) => {
                expect(body.user).toMatchObject({
                    user_id: 5,
                    username: "TestUser*%$_1",
                    first_name: "Testfirst",
                    last_name: "Test Last",
                    email: "testemail@gmail.com",
                    password: "PasswordTest123!",
                    image_url: "https://images.unsplash.com/photo-1628891435222-065925dcb365?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    admin: false,
                    plants_count: "0",
                })
            })
        })
    })
})

describe("/api/users/:user_id", () => {
    describe("GET", () => {
        test("200: Responds with a 200 status code and a single user object", () => {
            return request(app)
            .get("/api/users/2")
            .expect(200)
            .then(({body}) => {
                expect(body.user).toMatchObject({
                    user_id: 2,
                    username: "UserName£$_2",
                    first_name: "Firsttwo",
                    last_name: "Lasttwo",
                    email: "email2@gmail.com",
                    password: "Password234!",
                    image_url: "https://images.unsplash.com/photo-1628891435222-065925dcb365?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    admin: false,
                    plants_count: "7",
                })
            })
        })
        test("400: Responds with a 400 status code and 'Bad Request' if the user_id is not a number", () => {
            return request(app)
            .get("/api/users/not-a-number")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Bad Request" })
            })
        })
        test("404: Responds with a 404 status code and 'Not Found' if the user_id doesn't exist", () => {
            return request(app)
            .get("/api/users/999")
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Not Found" })
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