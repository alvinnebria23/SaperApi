const HttpCodes = require("../constants/HttpCodes");
const { updateShopeeApi } = require("../service/ShopeeApiService");
const UserService = require("../service/UserService");

/**
 * Registers a new user with the details provided in the request body.
 * @param {Object} req - The HTTP request object containing the details of the new user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise} - A Promise that resolves when the user is successfully registered and the response has been sent.
 * @throws {Error} - If there is an error registering the user or sending the response.
 */
const register = async (req, res) => {
  try {
    const user = await UserService.registerUser(req.body);
    res.status(HttpCodes.OK).json(user);
  } catch (error) {
    console.error(error);
    res.status(HttpCodes.ERROR).json(error);
  }
};

/**
 * Resends the email verification to the specified user.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise} - A Promise that resolves when the email has been sent successfully.
 * @throws {Error} - If there is an error sending the email.
 */
const resendVerification = async (req, res) => {
  try {
    const { id, email } = req.body;
    await UserService.resendVerification(id, email);
    res.status(HttpCodes.OK).json({});
  } catch (error) {
    console.error(error);
    res.status(HttpCodes.ERROR).json(error);
  }
};

/**
 * Confirms the verification of a user with the specified ID and verification code.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise} - A Promise that resolves when the verification has been confirmed successfully.
 * @throws {Error} - If there is an error confirming the verification.
 */
const confirmVerification = async (req, res) => {
  try {
    const { id, code } = req.body;
    await UserService.confirmVerification(id, code);
    res.status(HttpCodes.OK).json({});
  } catch (error) {
    console.error(error);
    res.status(HttpCodes.ERROR).json(error);
  }
};

const checkApi = async (req, res) => {};

const login = async (req, res) => {};

/**
 * Changes the password of the user with the provided ID to the new password.
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP request.
 * @returns {Promise} - A promise that resolves once the password has been successfully changed.
 * @throws {Error} - If there is an error changing the password.
 */
const changePassword = async (req, res) => {
  try {
    const { id, password } = req.body;
    await UserService.changePassword(id, password);
    res.status(HttpCodes.OK).json({});
  } catch (error) {
    console.error(error);
    res.status(HttpCodes.ERROR).json(error);
  }
};

/**
 * Updates the Shopee API information for the user with the provided user ID.
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP request.
 * @throws {Error} - If there is an error updating the Shopee API information.
 */
const changeApi = async (req, res) => {
  try {
    const { userId, appId, secretKey } = req.body;
    await updateShopeeApi(userId, appId, secretKey);
    res.status(HttpCodes.OK).json({});
  } catch (error) {
    console.error(error);
    res.status(HttpCodes.ERROR).json(error);
  }
};

const update = async (req, res) => {
  try {
    await UserService.updateUser(req.body);
    res.status(HttpCodes.OK).json({});
  } catch (error) {
    console.error(error);
    res.status(HttpCodes.ERROR).json(error);
  }
};

/**
 * Deletes the user with the ID provided in the request body from the database.
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP request.
 * @throws {Error} - If there is an error deleting the user.
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    await UserService.deleteUser(id);
    res.status(HttpCodes.OK).json({});
  } catch (error) {
    console.error(error);
    res.status(HttpCodes.ERROR).json(error);
  }
};

module.exports = {
  register,
  resendVerification,
  confirmVerification,
  checkApi,
  login,
  changePassword,
  changeApi,
  update,
  deleteUser,
};
