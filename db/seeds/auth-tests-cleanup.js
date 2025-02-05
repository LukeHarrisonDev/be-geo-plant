const { createClient } = require('@supabase/supabase-js')
const fs = require('fs').promises
require('dotenv').config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

function cleanup() {
    fs.readFile(`${__dirname}/uuid1.txt`, {encoding: "utf-8" })
    .then((data) => {
        const uuid1 = data
        supabase.auth.admin.deleteUser(
            uuid1
        )
    })
    .then(() => {
        fs.readFile(`${__dirname}/uuid2.txt`, {encoding: "utf-8" })
        .then((data) => {
            const uuid2 = data
            supabase.auth.admin.deleteUser(
                uuid2
            )
        })
        .then((data, error) => {
        })
    })
        .catch((error) => {
            console.log(error)
        })
}

cleanup()
module.exports = cleanup