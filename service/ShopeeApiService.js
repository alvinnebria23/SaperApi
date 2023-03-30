import db from "../models/index.js";
const ShopeeApi = db.shopeeApis;

/**
 * Creates a new Shopee API for the given user with the provided app ID, secret key, and user ID.
 * @param {string} appId - The app ID for the Shopee API.
 * @param {string} secret - The secret key for the Shopee API.
 * @param {number} userId - The ID of the user associated with the Shopee API.
 * @returns {Promise} - A promise that resolves to the created Shopee API.
 * @throws {Error} - If there is an error creating the Shopee API.
 */
const registerShopeeApi = async (appId, secret, userId) => {
  try {
    return await ShopeeApi.create({
      appId: appId,
      secretKey: secret,
      userId: userId,
    });
  } catch (error) {
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
    throw error;
  }
};

export { registerShopeeApi, updateShopeeApi };
