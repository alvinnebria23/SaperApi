import dotenv from 'dotenv';
dotenv.config();

export const USER_TABLE_VALUES = {
    id:1,
    email: 'sapersapk@gmail.com',
    name: 'Alvin Nebria',
    password: process.env.ADMIN_PASSWORD,
    contactNumber: '09616346743',
    isValidEmail: true,
};

export const SHOPEE_API_VALUES = {
    id: 1,
    appId: "admin",
    secretKey: "admin",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiZnJlZSIsImlhdCI6MTUxNjIzOTAyMn0.wf60Fs6cFuiGImXrFfUJxh0h9THsOsHyk2reyvNZBIg",
    userId: 1,
    type: "admin"
};