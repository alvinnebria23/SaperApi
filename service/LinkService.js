import { Op } from "sequelize";
import db from "../models/index.js";
import logger from "../loggers/logger.js";
const Link = db.links;

/**
 * Creates a new Shopee API for the given user with the provided app ID, secret key, and user ID.
 * @param {string} appId - The app ID for the Shopee API.
 * @param {string} secret - The secret key for the Shopee API.
 * @param {number} userId - The ID of the user associated with the Shopee API.
 * @returns {Promise} - A promise that resolves to the created Shopee API.
 * @throws {Error} - If there is an error creating the Shopee API.
 */
const saveLink = async (link, shortLink, subIds, userId) => {
  try {
    const [savedLink, created] = await Link.findOrCreate({
      where: {
        [Op.and]:[{ originalUrl: link }, { shortLink: shortLink }]
      },
      defaults: {
        originalUrl: link,
        shortLink: shortLink,
        name: shortLink,
        subIds: JSON.stringify(subIds),
        userId: userId,
      },
    });
    if(!created){
      return null;
    }
    return savedLink;
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
};

const getLinks = async (userId) => {
  try {
    const links = await Link.findAll({ where: { userId } });
    return links.map(link => link.get({ plain: true }));
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
};

const update = async (data, where) => {
  try {
    const link = await Link.update(data, where);
    return link;
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
}

const remove = async (where) => {
  try {
    const response = await Link.destroy(where);
    return response;
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
}

const removeExpiredLinks = async (expiredDate) => {
  try {
    const response = await Link.destroy({
      where: {
        createdAt: {
          [Op.lt]: expiredDate,
        }
      }
    });
    return response;
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
}


export { saveLink, getLinks, update, remove, removeExpiredLinks };
