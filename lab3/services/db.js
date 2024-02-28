const pgp = require('pg-promise')();

const PG_USERNAME = process.env.PG_USERNAME || 'user'
const PG_PASSWORD = process.env.PG_PASSWORD || 'pass'
const PG_PORT = process.env.PG_PORT || 5432
const PG_DB = process.env.PG_DB || 'test_db'
const PG_HOST = process.env.PG_HOST || 'localhost'

const dbConfig = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DB,
    user: PG_USERNAME,
    password: PG_PASSWORD
};
console.log(dbConfig)
const db = pgp(dbConfig)

module.exports = db;