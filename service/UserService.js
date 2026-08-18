import db from "../models/index.js";
import { registerShopeeApi, getShopeeApi } from "./ShopeeApiService.js";
import { sendVerificationMail } from "../helpers/NodeMailer.js";
import { Op } from "sequelize";
import { generateToken, verifyToken } from "../helpers/Jwt.js";
import logger from "../loggers/logger.js";
const User = db.users;
const ShopeeApi = db.shopeeApis;

/**
 * Registers a new user with the given user information and returns the created user.
 * Also creates a Shopee API and a verification link for the user.
 * @param {Object} user - The user object containing the details of the user to be registered.
 * @returns {Promise} - A Promise that resolves to the newly created user object.
 * @throws {Error} - If there is an error creating the user object.
 */
const register = async (user) => {
  try {
    // Find or create user
    const [createdUser, created] = await User.findOrCreate({
      where: {
        [Op.and]:[{ email:user.email?.trim() }, { isValidEmail: true }]
      },
      defaults: {
        email: user.email?.trim(),
        name: user.fullName,
        password: user.password,
        contactNumber: user.contactNumber,
        isValidEmail: false,
      },
    });
    if(!created){
      return null;
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    //Create shopee api
    registerShopeeApi(user.appId, user.secretKey, createdUser.id, verificationCode);
    await sendVerificationMail(verificationCode, user.email);
    return createdUser;
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
};

/**
 * Authenticates a user with the given email and password and returns the authenticated user object.
 * @param {Object} credentials - The credentials object containing the email and password of the user to be authenticated.
 * @returns {Promise} - A Promise that resolves to an object containing a boolean value indicating whether the user is found or not, and the user object itself if found.
 * @throws {Error} - If there is an error finding the user or authenticating the user.
 */
const login = async ({ email, password }) => {
  try {
    // Find the user with the given email
    const user = await User.findOne({
      where: {
        [Op.and]:[{ email }]
      }
    });
    if (!user) {
      return { isFound: false, message: 'Email is not yet registered.'};
    }
    if (!User.validPassword(password, user.password)) {
      return { isFound: false, message: 'Email and password does not match.'};
    }
    const existedUser = user.get({ plain: true });
    if(existedUser.email !== process.env.EMAIL_ADDRESS){
      const apiCredentials = await getShopeeApi(user.id);
      if(apiCredentials.type === "trial" && apiCredentials.token === null){
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 6);
        const formattedDate = expirationDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        apiCredentials.token = generateToken({ type:"trial", timestamp: Date.now(), expirationDate: formattedDate, verificationCode }, '5d');
        await ShopeeApi.update({ token: apiCredentials.token }, { where: { appId: apiCredentials.appId } });
      } 
      existedUser.appId = apiCredentials.appId;
      existedUser.secretKey = apiCredentials.secretKey;
      existedUser.token = apiCredentials.token;
      existedUser.type = apiCredentials.type;
      existedUser.password = password;
      const response = await verifyToken(apiCredentials.token);
      existedUser.expirationDate = response?.expirationDate;
      existedUser.verificationCode = !existedUser.isValidEmail ? response?.verificationCode : null;
    }else{
      existedUser.token = generateToken({ type: "admin" });
    }
    return { isFound: true, user: existedUser, message: "" };
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    return { isFound: false, message: 'There was an error. Please try again later.'};
  }
}


/**
 * Resends the email verification to the specified user.
 * @param {string} userId - The ID of the user to whom the verification email is being resent.
 * @param {string} userMail - The email address of the user to whom the verification email is being resent.
 * @throws {Error} - If there is an error updating the verification details.
 */
const resendVerification = async (userId, userMail) => {
  try {
    await updateVerification(userId, userMail);
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
};

/**
 * Deletes the user with the provided ID from the database.
 * @param {number} id - The ID of the user to delete.
 * @throws {Error} - If there is an error deleting the user.
 */
const remove = async (id) => {
  try {
    await User.destroy({ where: { id: id } });
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
};

/**
 * Finds a user with the provided email address in the database and checks if their email address is valid.
 * @param {string} email - The email address to search for.
 * @returns {object} - An object with a single property, isTaken, indicating whether the email address is already associated with a valid user account.
 * @throws {Error} - If there is an error searching the database for the email address.
 */
const findEmail = async (email, forgotPassword = false) => {
  try {
    let user;
    if(forgotPassword){
      user = await User.findOne({
        where: {
          [Op.and]:[{ email:email }]
        }
      });
    }else{
      user = await User.findOne({
        where: {
          [Op.and]:[{ email:email }, { isValidEmail: true }]
        }
      });
    }
    if(forgotPassword){
      return user?.get({ plain: true });
    }
    if(user){
      return { isTaken: true };
    }
    return { isTaken: false };
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
};

const findUserById = async (id) => {
  try {
    const user = await User.findOne({
      where: { id }
    });
    return user?.get({ plain: true });
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
};

const updateUser = async (data, where, isReturn) => {
  try {
    await User.update(data,{ where : where, individualHooks: true });
    if(isReturn){
      const userInstance = await User.findOne({ where: { id: where.id }});
      const user = userInstance.get({ plain: true });
      const apiCredentials = await getShopeeApi(where.id);
      user.appId = apiCredentials.appId;
      user.secretKey = apiCredentials.secretKey;
      user.token = apiCredentials.token;
      user.type = apiCredentials.type;
      const response = await verifyToken(apiCredentials.token);
      user.expirationDate = response?.expirationDate;
      user.verificationCode = !user.isValidEmail ? response?.verificationCode : null;
      return user;
    }
    return true;
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    return false;
  }
};

const findAllValidUsers = async () => {
  try {
    const users = await User.findAll({
      include: {
        model: ShopeeApi,
        attributes: ['appId', 'type']
      },
      where: {
        [Op.and]: [
          { email: { [Op.ne]: 'sapersapk@gmail.com' } },
          { isValidEmail: true }
        ]
      },
      attributes: ['id', 'email', 'name'],
      raw: true
    });
    return users;
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
}

export {
  register,
  resendVerification,
  updateUser,
  remove,
  login,
  findEmail,
  findUserById,
  findAllValidUsers,
};
