const { Pool } = require('pg')
const {
    DB_HOST,
    DB_NAME,
    DB_PASS,
    DB_PORT,
    DB_USER
} = require('../helpers/env')

const db = new Pool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT
})

db.connect((err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('database connected')
    }
  })
  
  module.exports = db