const format = require('pg-format')
const db = require("../connection")
const { convertTimestampToDate } = require('./utils')

function seed ({userData, plantData, foundPlantsData}) {
    return db.query(`DROP TABLE IF EXISTS found_plants;`)
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS plants;`)
    })
    .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`)
    })
    .then(() => {

        const usersTablePromise =  db.query(
            `CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR UNIQUE NOT NULL,
            first_name VARCHAR (30) NOT NULL,
            last_name VARCHAR (30) NOT NULL,
            email VARCHAR (60) UNIQUE NOT NULL,
            password VARCHAR (30) NOT NULL,
            image_url VARCHAR DEFAULT 'https://images.unsplash.com/photo-1628891435222-065925dcb365?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            admin BOOLEAN DEFAULT 'false'
            );`
        )
        const plantTablePromise = db.query(
            `CREATE TABLE plants (
            plant_id SERIAL PRIMARY KEY,
            plant_name VARCHAR(30) UNIQUE NOT NULL,
            about_plant VARCHAR NOT NULL,
            plant_image_url VARCHAR DEFAULT 'https://images.unsplash.com/photo-1476209446441-5ad72f223207?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            rarity INT DEFAULT 100,
            season TEXT[]
            );`
        )
        return Promise.all([usersTablePromise, plantTablePromise])
    })
    .then(() => {
        return db.query(
            `CREATE TABLE found_plants (
            find_id SERIAL PRIMARY KEY,
            plant_id INT NOT NULL REFERENCES plants(plant_id),
            found_by INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            photo_url VARCHAR DEFAULT 'https://static.vecteezy.com/system/resources/previews/006/719/370/original/plant-pot-cartoon-free-vector.jpg',
            location_name VARCHAR (50) NOT NULL,
            location JSONB NOT NULL,
            comment VARCHAR (300) DEFAULT 'Found, What a nice Plant',
            created_at TIMESTAMP DEFAULT NOW()
            );`
        )
    })
    .then(() => {
        const insertUsersData = format(
            `INSERT INTO users (
            username, first_name, last_name, email, password, image_url, admin
            ) VALUES %L;`,
            userData.map(({ username, first_name, last_name, email, password, image_url, admin }) => {
                return [
                    username,
                    first_name,
                    last_name,
                    email,
                    password,
                    image_url || 'https://images.unsplash.com/photo-1628891435222-065925dcb365?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    admin || false
                ]
            })
        )
        const usersPromise = db.query(insertUsersData)

        const insertPlantsData = format(
            `INSERT INTO plants (
            plant_name, about_plant, plant_image_url, rarity, season
            ) VALUES %L;`,
            plantData.map(({ plant_name, about_plant, plant_image_url, rarity, season }) => {
                return [
                    plant_name,
                    about_plant,
                    plant_image_url || "https://images.unsplash.com/photo-1476209446441-5ad72f223207?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    rarity || 100,
                    `{${season.join(',')}}`
                ]
            })
        )
        const plantsPromise = db.query(insertPlantsData)

        return Promise.all([usersPromise, plantsPromise])
        .then(() => {
            const formattedFoundPlants = foundPlantsData.map(convertTimestampToDate)
            const insertFoundPlantsData = format(
                `INSERT INTO found_plants (plant_id,
                found_by, location_name, location, photo_url, comment
                ) VALUES %L;`,
                formattedFoundPlants.map(({ plant_id, found_by, location_name, location, photo_url, comment }) => {
                    return [
                        plant_id,
                        found_by,
                        location_name,
                        JSON.stringify(location),
                        photo_url || "https://static.vecteezy.com/system/resources/previews/006/719/370/original/plant-pot-cartoon-free-vector.jpg",
                        comment || 'Found, What a nice Plant'
                    ]
                })
            )
            return db.query(insertFoundPlantsData)
        })
    })
}

module.exports = seed