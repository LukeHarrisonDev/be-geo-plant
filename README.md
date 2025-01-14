# Northcoders News API

### Hosted API Link

[https://geo-plant.onrender.com](https://geo-plant.onrender.com)
the "/api" will show you a list of endpoints and queries that you can use.

### The Project

I had an idea to create a mobile app that allows people to exercise while taking photos of plants and being more observant when out and about, the aim is to collect or find as many as possible. It was developed using TDD and makes use of Express and the HTTP protocol. It makes use of GET, POST, PATCH and DELETE HTTP methods for relevant endpoints. Follow the link above to get started with your options.

### Setup
> Clone the Repo
Copy the following link, (Or copy the link from the GitHub Repo page) and use "git clone [link]" in the the terminal
[https://github.com/LukeHarrisonDev/be-geo-plant](https://github.com/LukeHarrisonDev/be-geo-plant)

> Creating environment files

Use the following instructions to add the .env files which will allow you to create and access the test database.

1. Create a 'env.test' file.
2. Add "PGDATABASE=geo_plant_test" to the filep

> Navigate

navigate into the folder with 'cd be-geo-plant'

> Install the dependancies with 'npm install'

Run 'npm install' to install the dependancies

> Seed Database

1. Run the script 'npm run setup-dbs' to create the test database
2. Run the app.test.js file using jest to seed the test database and simultaneously run the tests, 'npm test'

> Running Tests

Tests include:

1. app.test.js - Main test file that runs end 2 end tests
2. utils.test.js - Tests are for functions used during development

### Minimum Versions

node.js v21.7.3
PostgreSQL 14.12
