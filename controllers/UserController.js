const HttpCodes = require("../constants/HttpCodes");
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

const changePassword = async (req, res) => {};

const changeApi = async (req, res) => {};

const update = async (req, res) => {};

const deleteUser = async (req, res) => {};

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
