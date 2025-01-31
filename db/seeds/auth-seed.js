const format = require('pg-format')
const db = require("../connection")
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

function authSeed ({ userData }) {
    const authenticatedUser = userData.map((user) => {
        return supabase.auth.signUp({
            email: user.email,
            password: user.password,
        }).then(({data, error}) => {
            if(error) {
                console.log(error)
            }
            return data.user
        })
    })
    Promise.all(authenticatedUser).then((user) => {
        console.log(user, "<<<<<< This")

        ///// I think you need to loop round each user, insert the NEW UUID and THEN do the query.... /////

        // const updateUserData = format(
        //     `UPDATE users
        //     SET auth_uuid = %L
        //     WHERE %I = %I;`,
        //     userData.map(({ auth_id, email }) => {
        //         return [
        //             user.id,
        //             auth_id,
        //             email
        //         ]
        //     })
        // )
        // console.log(updateUserData, "<<< YEAH!!!!")

    }).catch((error) => {
        console.log(error, "<<< error")
    })

}

module.exports = authSeed






// const insertUsersData = format(
//             `INSERT INTO users (
//             username, first_name, last_name, email, image_url, admin
//             ) VALUES %L;`,
//             userData.map(({ username, first_name, last_name, email, image_url, admin }) => {
//                 return [
//                     username,
//                     first_name,
//                     last_name,
//                     email,
//                     image_url || 'https://images.unsplash.com/photo-1628891435222-065925dcb365?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//                     admin || false
//                 ]
//             })
//         )