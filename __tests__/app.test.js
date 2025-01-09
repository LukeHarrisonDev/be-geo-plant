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
        test("201: Responds with the posted user object when the client sends more than the required fields", () => {
            const newUser = {
                username: "TestUser*%$_2",
                first_name: "Testingfirst",
                last_name: "Testing Last",
                email: "testingemail@gmail.com",
                password: "PasswordTest456!",
                image_url: "https://images.unsplash.com/photo-1508921340878-ba53e1f016ec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                admin: true,
            }
            return request(app)
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .then(({body}) => {
                expect(body.user).toMatchObject({
                    user_id: 5,
                    username: "TestUser*%$_2",
                    first_name: "Testingfirst",
                    last_name: "Testing Last",
                    email: "testingemail@gmail.com",
                    password: "PasswordTest456!",
                    image_url: "https://images.unsplash.com/photo-1508921340878-ba53e1f016ec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    admin: true,
                    plants_count: "0",
                })
            })
        })
        test("400: Responds with a 400 status code and 'Bad Request' if the new user has nothing on the body", () => {
            const newUser = {}
            return request(app)
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Bad Request" })
            })
        })
        test("400: Responds with 'Bad Request' if the new user has all valid fileds but the datatype is invalid", () => {
            const newUser = {
                username: "TestUser*%$_2",
                first_name: "Testingfirst",
                last_name: "Testing Last",
                email: "testingemail@gmail.com",
                password: "PasswordTest456!",
                image_url: "https://images.unsplash.com/photo-1508921340878-ba53e1f016ec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                admin: 5,
            }
            return request(app)
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Bad Request" })
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
    describe("DELETE", () => {
        test("204: Responds with a 204 status code and no content if the given user has been deleted", () => {
            return request(app)
            .delete("/api/users/2")
            .expect(204)
        })
        test("400: Responds with a 400 status code and 'Bad Request' if the user_id is not a number", () => {
            return request(app)
            .delete("/api/users/not-a-number")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Bad Request" })
            })
        })
        test("404: Responds with a 404 status code and 'Not Found' if the user_id doesn't exist", () => {
            return request(app)
            .delete("/api/users/999")
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
    describe("POST", () => {
        test("201: Responds with a 201 status code and the posted plant object when the client sends only the required fields", () => {
            const newPlant = {
                plant_name: "Plant Eight",
                about_plant: "Labore consectetur nisi quis ut adipisicing. Ex tempor ea nisi aliqua minim eiusmod magna ullamco id eu commodo et irure dolor.",
                season: ["Spring", "Winter"]
            }
            return request(app)
            .post("/api/plants")
            .send(newPlant)
            .expect(201)
            .then(({ body }) => {
                expect(body.plant).toMatchObject({
                    plant_id: 8,
                    plant_name: "Plant Eight",
                    about_plant: "Labore consectetur nisi quis ut adipisicing. Ex tempor ea nisi aliqua minim eiusmod magna ullamco id eu commodo et irure dolor.",
                    plant_image_url: "https://images.unsplash.com/photo-1476209446441-5ad72f223207?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    rarity: 100,
                    season: ["Spring", "Winter"]
                })
            })
        })
        test("201: Responds with the posted plant object when the client sends more than the required fields", () => {
            const newPlant = {
                plant_name: "Plant Eight",
                about_plant: "Labore consectetur nisi quis ut adipisicing. Ex tempor ea nisi aliqua minim eiusmod magna ullamco id eu commodo et irure dolor.",
                plant_image_url: "https://images.unsplash.com/photo-1447875569765-2b3db822bec9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                rarity: 78,
                season: ["Summer", "Autumn", "Spring", "Winter"]
            }
            return request(app)
            .post("/api/plants")
            .send(newPlant)
            .expect(201)
            .then(({ body }) => {
                expect(body.plant).toMatchObject({
                    plant_id: 8,
                    plant_name: "Plant Eight",
                    about_plant: "Labore consectetur nisi quis ut adipisicing. Ex tempor ea nisi aliqua minim eiusmod magna ullamco id eu commodo et irure dolor.",
                    plant_image_url: "https://images.unsplash.com/photo-1447875569765-2b3db822bec9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    rarity: 78,
                    season: ["Summer", "Autumn", "Spring", "Winter"]
                })
            })
        })
        test("400: Responds with a 400 status code and 'Bad Request' if the new plant has nothing on the body", () => {
            const newPlant = {}
            return request(app)
            .post("/api/plants")
            .send(newPlant)
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Bad Request" })
            })
        })
        test("400: Responds with 'Bad Request' if the new plant has all valid fileds but the datatype is invalid", () => {
            const newPlant = {
                plant_name: "Plant Eight",
                about_plant: "Labore consectetur nisi quis ut adipisicing. Ex tempor ea nisi aliqua minim eiusmod magna ullamco id eu commodo et irure dolor.",
                plant_image_url: "https://images.unsplash.com/photo-1447875569765-2b3db822bec9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                rarity: "forty-five",
                season: ["Summer", "Autumn", "Spring", "Winter"]
            }
            return request(app)
            .post("/api/plants")
            .send(newPlant)
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Bad Request" })
            })
        })
    })
})

describe("/api/plants/:plant_id", () => {
    describe("GET", () => {
        test("200: Responds with a 200 status code and a single plant object", () => {
            return request(app)
            .get("/api/plants/2")
            .expect(200)
            .then(({body}) => {
                expect(body.plant).toMatchObject({
                    plant_id: 2,
                    plant_name: "Plant Two",
                    about_plant: "Ex tempor ullamco est incididunt nostrud duis officia voluptate nisi occaecat laborum excepteur proident. Consectetur dolore ipsum exercitation sunt culpa id cillum aute sint nostrud eu est.",
                    plant_image_url: "https://images.unsplash.com/photo-1476209446441-5ad72f223207?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    rarity: 100,
                    season: ["Spring"]
                })
            })
        })
        test("400: Responds with a 400 status code and 'Bad Request' if the plant_id is not a number", () => {
            return request(app)
            .get("/api/plants/not-a-number")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Bad Request" })
            })
        })
        test("404: Responds with a 404 status code and 'Not Found' if the plant_id does not exist", () => {
            return request(app)
            .get("/api/plants/999")
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Not Found" })
            })
        })
    })
})

describe("/api/found_plants", () => {
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
                            lat: expect.any(Number),
                            lon: expect.any(Number),
                        })
                    })
                })
            })
        })
    })
})

describe("/api/found_plants/:find_id", () => {
    describe("GET", () => {
        test("200: Responds with a 200 status code and a single found_plant object", () => {
            return request(app)
            .get("/api/found_plants/7")
            .expect(200)
            .then(({body}) => {
                expect(body.foundPlant).toMatchObject({
                    find_id: 7,
                    plant_id: 2,
                    plant_name: "Plant Two",
                    found_by: 2,
                    location_name: 'Place Seven',
                    location: {lat: 51.97567141748108, lon: -2.1932002831539124},
                    photo_url: "https://images.unsplash.com/photo-1538998073820-4dfa76300194?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    comment: "Found, What a nice Plant",
                    created_at: expect.any(String)
                })
            })
        })
        test("400: Responds with a 400 status code and 'Bad Request' if the find_id is not a number", () => {
            return request(app)
            .get("/api/found_plants/not-a-number")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Bad Request" })
            })
        })
        test("404: Responds with a 404 status code and 'Not Found' if the find_id does not exists", () => {
            return request(app)
            .get("/api/found_plants/999")
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Not Found" })
            })
        })
    })
    describe("DELETE", () => {
        test("204: Responds with a 204 status code and no content if the given find has been deleted", () => {
            return request(app)
            .delete("/api/found_plants/3")
            .expect(204)
        })
        test("400: Responds with a 400 status code and 'Bad Request' if the find_id is not a number", () => {
            return request(app)
            .delete("/api/found_plants/not-a-number")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Bad Request" })
            })
        })
        test("404: Responds with a 404 status code and 'Not Found' if the find_id does not exist", () => {
            return request(app)
            .delete("/api/found_plants/999")
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Not Found" })
            })
        })
    })
})

describe("/api/users/:user_id/found_plants", () => {
    describe("GET", () => {
        test("200: Responds with a 200 status code and all the found plants by the given user_id", () => {
            return request(app)
            .get("/api/users/2/found_plants")
            .expect(200)
            .then(({body}) => {
                expect(body.foundPlants).toHaveLength(7)
                body.foundPlants.forEach((foundPlant) => {
                    expect(foundPlant).toMatchObject({
                        find_id: expect.any(Number),
                        plant_id: expect.any(Number),
                        plant_name: expect.any(String),
                        found_by: 2,
                        photo_url: expect.any(String),
                        location_name: expect.any(String),
                        comment: expect.any(String),
                        created_at: expect.any(String),
                        location: expect.objectContaining({
                            lat: expect.any(Number),
                            lon: expect.any(Number),
                        })
                    })
                })
            })
        })
        test("400: Responds with a 400 status code and 'Bad Request' if the user_id is not a number", () => {
            return request(app)
            .get("/api/users/not-a-number/found_plants")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Bad Request" })
            })
        })
        test("400: Responds with a 404 status code and 'Not Found' if the user_id does not exist", () => {
            return request(app)
            .get("/api/users/999/found_plants")
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Not Found" })
            })
        })
        test("200: Responds with a 200 status code and an empty array if there are no found plants", () => {
            return request(app)
            .get("/api/users/1/found_plants")
            .expect(200)
            .then(({body}) => {
                expect(body.foundPlants).toHaveLength(0)
                expect(body.foundPlants).toEqual([])
            })
        })
    })
    describe("GET Queries", () => {
        describe("sort_by & order", () => {
            test("?sort_by= 200: Responds with the given users found plants ordered by the column of created_at", () => {
                return request(app)
                .get("/api/users/2/found_plants?sort_by=created_at")
                .expect(200)
                .then(({body}) => {
                    expect(body.foundPlants).toHaveLength(7)
                    expect(body.foundPlants).toBeSortedBy("created_at", { descending: true })
                })
            })
            test("?sort_by= 200: Responds with the given users found plants ordered by another column of the given 'sort_by' query", () => {
                return request(app)
                .get("/api/users/3/found_plants?sort_by=location_name")
                .expect(200)
                .then(({body}) => {
                    expect(body.foundPlants).toHaveLength(6)
                    expect(body.foundPlants).toBeSortedBy("location_name", { descending: true })
                })
            })
            test("sort_by= 400: Responds with 'Bad Request' when the given column name doesn't exist in the table", () => {
                return request(app)
                .get("/api/users/2/found_plants?sort_by=not-a-column")
                .expect(400)
                .then(({body}) => {
                    expect(body).toEqual({message: "Bad Request"})
                })
            })
            test("?order= 200: Responds with the given users found plants in the given order", () => {
                return request(app)
                .get("/api/users/2/found_plants?order_by=asc")
                .expect(200)
                .then(({body})=> {
                    expect(body.foundPlants).toHaveLength(7)
                    expect(body.foundPlants).toBeSortedBy('created_at', { descending: false })
                })
            })
            test("?order= 400: Responds with 'Bad Request' when the 'order' query is anything apart from 'asc' or 'desc'", () => {
                return request(app)
                .get("/api/users/2/found_plants?order_by=not-an-order")
                .expect(400)
                .then(({body}) => {
                    expect(body).toEqual({message: "Bad Request"})
                })
            })
            test("?sort_by=&order_by= 200: Responds with the given users found plants ordered by the column of the given 'sort_by' query in the given order", () => {
                return request(app)
                .get("/api/users/2/found_plants?sort_by=location_name&order_by=asc")
                .expect(200)
                .then(({body}) => {
                    expect(body.foundPlants).toHaveLength(7)
                    expect(body.foundPlants).toBeSortedBy("location_name", { descending: false })
                })
            })
        })    
        describe("sort_by_distance", () => {
            test("?sort_by_distance= 200: Responds with the given users found plants ordered by the distance", () => {
                return request(app)
                .get("/api/users/3/found_plants?sort_by_distance=distanceInKm")
                .set("lat", "53.79354")
                .set("lon", "-1.75064")
                .expect(200)
                .then(({body}) => {
                    expect(body.foundPlants).toHaveLength(6)
                    expect(body.foundPlants).toBeSortedBy("distanceInKm", { descending: false, coerce: true })
                })
            })
            test("?sort_by_distance= 400: Responds with 'Bad Request' when the 'sort_by_distance is invalid", () => {
                return request(app)
                .get("/api/users/3/found_plants?sort_by_distance=not-valid")
                .set("lat", "53.79354")
                .set("lon", "-1.75064")
                .expect(400)
                .then(({body}) => {
                    expect(body).toEqual({message: "Bad Request"})
                })
            })
            test("?sort_by_distance= 400: Responds with 'Bad Request' when the headers are missing", () => {
                return request(app)
                .get("/api/users/3/found_plants?sort_by_distance=distanceInKm")
                .expect(400)
                .then(({body}) => {
                    expect(body).toEqual({message: "Bad Request"})
                })
            })
            test("?sort_by_distance= 400: Responds with 'Bad Request' when the 'lon' header is missing", () => {
                return request(app)
                .get("/api/users/3/found_plants?sort_by_distance=distanceInKm")
                .set("lat", "53.79354")
                .expect(400)
                .then(({body}) => {
                    expect(body).toEqual({message: "Bad Request"})
                })
            })
            test("?sort_by_distance= 400: Responds with 'Bad Request' when the 'lat' header is missing", () => {
                return request(app)
                .get("/api/users/3/found_plants?sort_by_distance=distanceInKm")
                .set("lon", "-1.75064")
                .expect(400)
                .then(({body}) => {
                    expect(body).toEqual({message: "Bad Request"})
                })
            })
            test("?sort_by_distance= 400: Reaponds with 'Bad Request' when the latitude isn't valid", () => {
                return request(app)
                .get("/api/users/3/found_plants?sort_by_distance=distanceInKm")
                .set("lat", "not-a-valid-latitude")
                .set("lon", "-1.75064")
                .expect(400)
                .then(({body}) => {
                    expect(body).toEqual({message: "Bad Request"})
                })
            })
            test("?sort_by_distance= 400: Reaponds with 'Bad Request' when the latitude isn't valid", () => {
                return request(app)
                .get("/api/users/3/found_plants?sort_by_distance=distanceInKm")
                .set("lat", "53.79354")
                .set("lon", "not-a-valid-longitude")
                .expect(400)
                .then(({body}) => {
                    expect(body).toEqual({message: "Bad Request"})
                })
            })
            test("?sort_by_distance= 400: Reaponds with 'Bad Request' when the latitude is out of range", () => {
                return request(app)
                .get("/api/users/3/found_plants?sort_by_distance=distanceInKm")
                .set("lat", "153.79354")
                .set("lon", "-1.75064")
                .expect(400)
                .then(({body}) => {
                    expect(body).toEqual({message: "Bad Request"})
                })
            })
            test("?sort_by_distance= 400: Reaponds with 'Bad Request' when the longitude is out of range", () => {
                return request(app)
                .get("/api/users/3/found_plants?sort_by_distance=distanceInKm")
                .set("lat", "53.79354")
                .set("lon", "-199.75064")
                .expect(400)
                .then(({body}) => {
                    expect(body).toEqual({message: "Bad Request"})
                })
            })
        })
        describe("filters", () => {
            test("?plant_name= 200: Responds with the given users found plants of the same plant_name", () => {
                return request(app)
                .get("/api/users/3/found_plants?plant_name=Plant%20Four")
                .expect(200)
                .then(({body}) => {
                    expect(body.foundPlants).toHaveLength(3)
                    body.foundPlants.forEach((foundPlant) => {
                        expect(foundPlant).toMatchObject({
                            find_id: expect.any(Number),
                            plant_id: 4,
                            plant_name: "Plant Four",
                            found_by: 3,
                            photo_url: expect.any(String),
                            location_name: expect.any(String),
                            comment: expect.any(String),
                            created_at: expect.any(String),
                            location: expect.objectContaining({
                                lat: expect.any(Number),
                                lon: expect.any(Number),
                            })
                        })
                    })
                })
            })
            test("?plant_name= 400: Responds with 'Not Found' when the given plant name doesn't exist", () => {
                return request(app)
                .get("/api/users/3/found_plants?plant_name=not-a-plant")
                .expect(404)
                .then(({body}) => {
                    expect(body).toEqual({message: "Not Found"})
                })
            })
            test("?plant_name= 200: Responds with an empty array if the given user doesn't have any plants of the given name", () => {
                return request(app)
                .get("/api/users/2/found_plants?plant_name=Plant%20One")
                .expect(200)
                .then(({body}) => {
                    expect(body.foundPlants).toHaveLength(0)
                    expect(body.foundPlants).toEqual([])
                })
            })
            test("?season= 200: Responds with the given users found plants that are typically found in either given season", () => {
                const seasons = ["Winter", "Spring"]
                return request(app)
                .get("/api/users/3/found_plants?season=Winter&season=Spring")
                .expect(200)
                .then(({body}) => {
                    expect(body.foundPlants).toHaveLength(5)
                    body.foundPlants.forEach((foundPlant) => {
                        expect(
                            seasons.some((season) => foundPlant.season.includes(season))
                        ).toBe(true)
                        expect(foundPlant).toMatchObject({
                            find_id: expect.any(Number),
                            plant_id: expect.any(Number),
                            plant_name: expect.any(String),
                            found_by: 3,
                            photo_url: expect.any(String),
                            location_name: expect.any(String),
                            comment: expect.any(String),
                            created_at: expect.any(String),
                            location: expect.objectContaining({
                                lat: expect.any(Number),
                                lon: expect.any(Number),
                            })
                        })
                    })
                })
            })
            test("?season= 200: Responds with the given users found plants that are typically found in either given season", () => {
                const seasons = ["Winter", "Spring"]
                return request(app)
                .get("/api/users/3/found_plants?season=Winter&season=Spring&order_by=asc&sort_by=location_name")
                .set("lat", "53.79354")
                .set("lon", "-1.75064")
                .expect(200)
                .then(({body}) => {
                    expect(body.foundPlants).toHaveLength(5)
                    expect(body.foundPlants).toBeSortedBy("location_name", { descending: false, coerce: true })
                    body.foundPlants.forEach((foundPlant) => {
                        expect(
                            seasons.some((season) => foundPlant.season.includes(season))
                        ).toBe(true)
                        expect(foundPlant).toMatchObject({
                            find_id: expect.any(Number),
                            plant_id: expect.any(Number),
                            plant_name: expect.any(String),
                            found_by: 3,
                            photo_url: expect.any(String),
                            location_name: expect.any(String),
                            comment: expect.any(String),
                            created_at: expect.any(String),
                            location: expect.objectContaining({
                                lat: expect.any(Number),
                                lon: expect.any(Number),
                            })
                        })
                    })
                })
            })
            test("?season= 200: Responds with the given users found plants that are typically found in a single season", () => {
                return request(app)
                .get("/api/users/3/found_plants?season=Spring")
                .expect(200)
                .then(({body}) => {
                    expect(body.foundPlants).toHaveLength(2)
                    body.foundPlants.forEach((foundPlant) => {
                        expect(foundPlant.season).toContain("Spring")
                        expect(foundPlant).toMatchObject({
                            find_id: expect.any(Number),
                            plant_id: expect.any(Number),
                            plant_name: expect.any(String),
                            found_by: 3,
                            photo_url: expect.any(String),
                            location_name: expect.any(String),
                            comment: expect.any(String),
                            created_at: expect.any(String),
                            location: expect.objectContaining({
                                lat: expect.any(Number),
                                lon: expect.any(Number),
                            })
                        })
                    })
                })
            })
            test("?season= 400: Responds with 'Bad Request' when the given season is invalid", () => {
                return request(app)
                .get("/api/users/3/found_plants?season=not-a-season")
                .expect(400)
                .then(({body}) => {
                    expect(body).toEqual({message: "Bad Request"})
                })
            })
        })
    })
    describe("POST", () => {
        test("201: Responds with a 201 status code and the found plant object when the client sends only the required fields", () => {
            const newFoundPlant = {
                plant_id: 3,
                location_name: 'Place Fifteen',
                location: {lat: 53.758968939609424, lon: -1.2222638173901648}
            }
            return request(app)
            .post("/api/users/3/found_plants")
            .send(newFoundPlant)
            .expect(201)
            .then(({ body }) => {
                expect(body.foundPlant).toMatchObject({
                    find_id: 15,
                    plant_id: 3,
                    found_by: 3,
                    photo_url: "https://static.vecteezy.com/system/resources/previews/006/719/370/original/plant-pot-cartoon-free-vector.jpg",
                    location_name: 'Place Fifteen',
                    location: {lat: 53.758968939609424, lon: -1.2222638173901648},
                    comment: "Found, What a nice Plant",
                    created_at: expect.any(String)
                })
            })
        })
        test("201: Responds with a 201 status code and the found plant object when the client sends more than the required fields", () => {
            const newFoundPlant = {
                plant_id: 1,
                location_name: 'Place Fifteen',
                location: {lat: 53.799647875890656, lon: -1.520764572895235},
                photo_url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                comment: "Aliqua enim quis nulla aliqua dolor amet cupidatat."
            }
            return request(app)
            .post("/api/users/4/found_plants")
            .send(newFoundPlant)
            .expect(201)
            .then(({ body }) => {
                expect(body.foundPlant).toMatchObject({
                    find_id: 15,
                    plant_id: 1,
                    found_by: 4,
                    photo_url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    location_name: 'Place Fifteen',
                    location: {lat: 53.799647875890656, lon: -1.520764572895235},
                    comment: "Aliqua enim quis nulla aliqua dolor amet cupidatat.",
                    created_at: expect.any(String)
                })
            })
        })
        test("400: Responds with a 400 status code and 'Bad Request' if the user_id is not a number", () => {
            const newFoundPlant = {
                plant_id: 3,
                location_name: 'Place Fifteen',
                location: {lat: 53.758968939609424, lon: -1.2222638173901648}
            }
            return request(app)
            .post("/api/users/not-a-number/found_plants")
            .send(newFoundPlant)
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Bad Request" })
            })
        })
        test("400: Responds with a 404 status code and 'Not Found' if the user_id does not exist", () => {
            const newFoundPlant = {
                plant_id: 3,
                location_name: 'Place Fifteen',
                location: {lat: 53.758968939609424, lon: -1.2222638173901648}
            }
            return request(app)
            .post("/api/users/999/found_plants")
            .send(newFoundPlant)
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Not Found" })
            })
        })
    })
})
describe("/api/users/:user_id/plants", () => {
    describe("GET", () => {
        test("200: Responds with a 200 status code and all plants with added 'find_amount' value", () => {
            return request(app)
            .get("/api/users/3/plants")
            .expect(200)
            .then(({body}) => {
                expect(body.plants).toHaveLength(data.plantData.length)
                body.plants.forEach((plant) => {
                    expect(plant).toMatchObject({
                        plant_id: expect.any(Number),
                        plant_name: expect.any(String),
                        about_plant: expect.any(String),
                        plant_image_url: expect.any(String),
                        rarity: expect.any(Number),
                        find_amount: expect.any(Number),
                    })
                    const seasons = ["Winter", "Spring", "Summer", "Autumn"]
                    expect(
                        seasons.some((season) => plant.season.includes(season))
                    ).toBe(true)
                })
            })
        })
        test("200: Responds with the specific 'find_amount' for each plant for the given user", () => {
            const plantAmountsObject = {}
            data.plantData.forEach((plant, index) => {
                plantAmountsObject[index +1] = 0
            })

            data.foundPlantsData.forEach((foundPlant) => {
                if(foundPlant.found_by === 3) {
                    plantAmountsObject[foundPlant.plant_id] ++
                }
            })

            const plantAmountsArray = []
            for (let i in plantAmountsObject) {
                plantAmountsArray.push({plant_id: +i, find_amount: plantAmountsObject[i]})
            }

            return request(app)
            .get("/api/users/3/plants")
            .expect(200)
            .then(({body}) => {
                body.plants.forEach((plant) => {
                    const expected = plantAmountsArray.find((p) => p.plant_id === plant.plant_id)
                    if(expected) {
                        expect(plant.find_amount).toBe(expected.find_amount)
                    }
                })
            })
        })
        test("400: Responds with a 400 status code and 'Bad Request' if the user_id is not a number", () => {
            return request(app)
            .get("/api/users/not-a-number/plants")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Bad Request" })
            })
        })
        test("404: Responds with a 404 status code and 'Not Found' if the user_id doesn't exist", () => {
            return request(app)
            .get("/api/users/999/plants")
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Not Found" })
            })
        })
    })
})