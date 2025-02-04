const db = require("../connection")
const format = require("pg-format")
const Joi = require('joi')

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
    if (!created_at) return { ...otherProperties };
    return { created_at: new Date(created_at), ...otherProperties };
  };

exports.checkIfExists = (table, column, value) => {
  if(!table || !column || !value) {
    return false
  }
  let sqlQuery =
  `SELECT * FROM %I
  WHERE %I = %L`
  const formattedQuery = format(sqlQuery, table, column, value)
  return db.query(formattedQuery)
  .then(({rows}) => {
      if(rows.length === 0) {
          return false
      }
      return true
  })
}

exports.validateUser = (user) => {

  const schema = Joi.object({
    username: Joi.string()
      .min(6)
      .max(20)
      .required(),

    first_name: Joi.string()
      .required(),

    last_name: Joi.string()
      .required(),
      
    email: Joi.string()
      .email({ minDomainSegments: 1, tlds: false })
      .required(),

    password: Joi.string()
      .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{10,}$'))
      .required(),

    // repeat_password: Joi.ref('password')
    //   .required(),

    // access_token: [
    //   Joi.string(),
    //   Joi.number()
    // ],

    // birth_year: Joi.number()
    //   .integer()
    //   .min(1900)
    //   .max(2013),

    image_url: Joi.string(),

    admin: Joi.bool(),
  })

  return schema.validateAsync(user)
  .then((value) => {
    return value
  })
}