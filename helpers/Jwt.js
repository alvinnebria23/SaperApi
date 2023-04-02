import jwt from 'jsonwebtoken';
import { API_KEY, API_SECRET } from '../config/dbConfig.js';

/**
 * Verifies a JWT token using the API key and secret.
 * @param {string} token - The JWT token to verify.
 * @returns {boolean} - True if the token is valid, false otherwise.
 */
const verifyToken = async (token) => {
  try {
    return await jwt.verify(token, API_SECRET, async (error, decoded) => {
      if(decoded){
        return { error: false, errorName: '', id: decoded.id };
      }
      if(error.name === 'TokenExpiredError'){
        return { error: true, errorName: 'expired', id: '' };
      }
      return { error: true, errorName: 'invalid', id: '' };
    });
  } catch (error) {
    return { error: true, errorName: 'invalid', id: '' };
  }
};

/**
 * Generates a JWT token for the specified email address.
 * @param {string} email - The email address for which to generate the token.
 * @returns {string} - The generated JWT token.
 */
const generateToken = (payload, expiresIn = '9999 years' ) => {
    return jwt.sign(payload, API_SECRET, { expiresIn: expiresIn });
};

export { verifyToken, generateToken };
