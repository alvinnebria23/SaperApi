import dotenv from 'dotenv';
dotenv.config();

const SERVICE = "gmail";
const USER = "sapersapk@gmail.com";
const PASSWORD = process.env.EMAIL_PASSWORD;

export { SERVICE, USER, PASSWORD };
