import { Op } from "sequelize";
import db from "../models/index.js";
import { generateToken } from "../helpers/Jwt.js";
import logger from "../loggers/logger.js";
const User = db.users;
const ShopeeApi = db.shopeeApis;

/**
 * Creates a new Shopee API for the given user with the provided app ID, secret key, and user ID.
 * @param {string} appId - The app ID for the Shopee API.
 * @param {string} secret - The secret key for the Shopee API.
 * @param {number} userId - The ID of the user associated with the Shopee API.
 * @returns {Promise} - A promise that resolves to the created Shopee API.
 * @throws {Error} - If there is an error creating the Shopee API.
 */
const registerShopeeApi = async (appId, secret, userId, verificationCode) => {
  try {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 10);
    const formattedDate = expirationDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });;
    const token = generateToken({ type:"trial", timestamp: Date.now(), expirationDate: formattedDate, verificationCode }, '10d');
    return await ShopeeApi.create({
      appId: appId,
      secretKey: secret,
      userId: userId,
      type: "trial",
      token: token
    });
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
};

/**
 * Updates the Shopee API information for the user with the provided user ID.
 * @param {number} userId - The ID of the user to update the Shopee API information for.
 * @param {string} appId - The new app ID for the user's Shopee API.
 * @param {string} secretKey - The new secret key for the user's Shopee API.
 * @throws {Error} - If there is an error updating the Shopee API information.
 */
const updateShopeeApi = async (userId, appId, secretKey) => {
  try {
    await ShopeeApi.update(
      { appId: appId, secretKey: secretKey },
      { where: { userId: userId } }
    );
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
};

/**
* Retrieves the Shopee API information for the user with the provided user ID.
* @param {number} userId - The ID of the user to retrieve the Shopee API information for.
* @throws {Error} - If there is an error retrieving the Shopee API information.
* @returns {Promise<ShopeeApi>} - A Promise that resolves with the Shopee API information for the user.
*/
const getShopeeApi = async (userId) => {
  try {
    const apiCredentials =  await ShopeeApi.findOne({ where: { userId: userId }});
    return apiCredentials?.get({ plain: true });
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    return false;
  }
};

const getShopeeApiByAppId = async (appId) => {
  try {
    const apiCredentials =  await ShopeeApi.findOne({ where: { appId: appId }});
    return apiCredentials?.get({ plain: true });
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    return false;
  }
}

const updateToken = async (type, appId, numberOfDays) => {
  try {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + parseInt(numberOfDays));
    const formattedDate = expirationDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });;
    const token = generateToken({ type, timestamp: Date.now(), expirationDate: formattedDate }, numberOfDays);
    await ShopeeApi.update({ token, type }, {
      where: { appId: appId }
    });
    return true;
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    return false
  }
};

const updateTypeByAppId = async (appId, type = "free") => {
  try {
    await ShopeeApi.update({ type: type }, {
      where: { appId: appId }
    });
    return true;
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    return false
  }
};

const countUsersByType = async (type) => {
  try {
    const count = await ShopeeApi.count({
      where: {
        [Op.and]: [
          { type },
        ],
      },
    });
    return count;
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    return false
  }
};

const findApiCredentials = async (appId) => {
  try {
    const apiCredentials = await ShopeeApi.findAll({
      include: {
        model: User,
        attributes: ['id', 'email', 'name'],
      },
      where: { appId: {
        [Op.startsWith]: appId
      }},
      attributes: ['appId', 'type'],
      raw: true
    });
    return apiCredentials;
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
};

const countAllUsers = async () => {
  try {
    const count = await ShopeeApi.count();
    return count;
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
};

export { 
  registerShopeeApi, 
  updateShopeeApi, 
  getShopeeApi, 
  getShopeeApiByAppId, 
  updateToken, 
  countUsersByType, 
  updateTypeByAppId,
  findApiCredentials,
  countAllUsers
};
