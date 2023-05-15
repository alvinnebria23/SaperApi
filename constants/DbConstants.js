import dotenv from 'dotenv';
dotenv.config();

export const USER_TABLE_VALUES = {
    id:1,
    email: 'admin@gmail.com',
    name: 'Alvin Nebria',
    password: process.env.ADMIN_PASSWORD,
    contactNumber: '09616346743',
    isValidEmail: true,
};