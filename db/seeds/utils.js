const db = require("../connection")
const format = require("pg-format")

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