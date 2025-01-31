const format = require('pg-format')
const db = require("../connection")
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

function authSeed ({ userData }) {
    const authenticatedUsers = userData.map((user) => {
        return supabase.auth.signUp({
            email: user.email,
            password: user.password,
        }).then(({data, error}) => {
            if(error) {
                console.log(error)
            }
            const IdAndEmail = {}
            IdAndEmail.uuid = data.user.id
            IdAndEmail.email = data.user.email
            return IdAndEmail
        })
    })
    Promise.all(authenticatedUsers).then((user) => {
        
        const updateUserData = format(
            `UPDATE users 
            SET auth_uuid = CASE email 
            %s 
            END 
            WHERE email IN (%L);`,
            user.map(({ uuid, email }) => format('WHEN %L THEN %L::UUID', email, uuid)).join(' '),
            user.map(({ email }) => email)
        );
        return db.query(updateUserData)
        
    }).catch((error) => {
        console.log(error, "<<< error")
    })
}

module.exports = authSeed