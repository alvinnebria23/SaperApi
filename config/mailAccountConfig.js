import dotenv from 'dotenv';
dotenv.config();

const SERVICE = process.env.EMAIL_SERVICE || "gmail";
const USER = process.env.EMAIL_USER;
const PASSWORD = process.env.EMAIL_PASSWORD;

export { SERVICE, USER, PASSWORD };
