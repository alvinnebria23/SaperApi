import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.BASE_URL;
const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DB = process.env.DB_NAME;
const DIALECT = 'mysql';
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const POOL = {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
};
const PORT = process.env.DB_PORT

export { HOST, USER, PASSWORD, DB, DIALECT, POOL, PORT, BASE_URL, API_KEY, API_SECRET };