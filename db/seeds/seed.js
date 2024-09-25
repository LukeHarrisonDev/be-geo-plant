const format = require('pg-format')
const db = require("../connection")
const { convertTimestampToDate } = require('./utils')

function seed ({userData, plantData}) {
    return db.query(`DROP TABLE IF EXISTS plants_found;`)
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
            image_url VARCHAR,
            admin BOOLEAN DEFAULT FALSE
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
            `CREATE TABLE plants_found (
            find_id SERIAL PRIMARY KEY,
            plant_id INT NOT NULL REFERENCES plants(plant_id),
            plant_name VARCHAR REFERENCES plants(plant_name),
            found_by VARCHAR NOT NULL REFERENCES users(username),
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
                return [username, first_name, last_name, email, password, image_url, admin]
            })
        )
        const usersPromise = db.query(insertUsersData)

        const insertPlantsData = format(
            `INSERT INTO plants (
            plant_name, about_plant, plant_image_url, rarity, season
            ) VALUES %L;`,
            plantData.map(({ plant_name, about_plant, plant_image_url, rarity, season }) => {
                return [plant_name, about_plant, plant_image_url, rarity, `{${season.join(',')}}`]
            })
        )
        const plantsPromise = db.query(insertPlantsData)

        return Promise.all([usersPromise, plantsPromise])
        .then(() => {
            const formattedPlantsFound = plantsFoundData.map(convertTimestampToDate)
        })
    })
}

module.exports = seed



// location_name VARCHAR (30) NOT NULL,
// location JSONB NOT NULL,
// found_at TIMESTAMP DEFUALT NOW(),