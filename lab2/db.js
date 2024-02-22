const pgp = require('pg-promise')();

const PG_USERNAME = process.env.PG_USERNAME
const PG_PASSWORD = process.env.PG_PASSWORD
const PG_PORT = process.env.PG_PORT
const PG_DB = process.env.PG_DB
const PG_HOST = process.env.PG_HOST

const dbConfig = {
    host: 'localhost',
    port: PG_PORT,
    database: PG_DB,
    user: PG_USERNAME,
    password: PG_PASSWORD
};

const db = pgp(dbConfig)

module.exports = db;