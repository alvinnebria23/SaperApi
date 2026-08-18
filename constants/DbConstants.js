import dotenv from 'dotenv';
dotenv.config();

export const USER_TABLE_VALUES = {
    id:1,
    email: process.env.ADMIN_EMAIL,
    name: process.env.ADMIN_NAME,
    password: process.env.ADMIN_PASSWORD,
    contactNumber: process.env.ADMIN_CONTACT,
    isValidEmail: true,
};