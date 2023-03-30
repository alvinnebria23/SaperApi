import { OK, ERROR } from "../constants/HttpCodes.js"
import { updateShopeeApi }  from "../service/ShopeeApiService.js"
import { register, resendVerification, confirmVerification, updatePassword, updateUser, remove } from "../service/UserService.js";

/**
 * Registers a new user with the details provided in the request body.
 * @param {Object} req - The HTTP request object containing the details of the new user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise} - A Promise that resolves when the user is successfully registered and the response has been sent.
 * @throws {Error} - If there is an error registering the user or sending the response.
 */
const registerUser = async (req, res) => {
  try {
    const user = await register(req.body);
    res.status(OK).json(user);
  } catch (error) {
    console.error(error);
    res.status(ERROR).json(error);
  }
};

/**
 * Resends the email verification to the specified user.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise} - A Promise that resolves when the email has been sent successfully.
 * @throws {Error} - If there is an error sending the email.
 */
const resendEmail = async (req, res) => {
  try {
    const { id, email } = req.body;
    await resendVerification(id, email);
    res.status(OK).json({});
  } catch (error) {
    console.error(error);
    res.status(ERROR).json(error);
  }
};

/**
 * Confirms the verification of a user with the specified ID and verification code.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise} - A Promise that resolves when the verification has been confirmed successfully.
 * @throws {Error} - If there is an error confirming the verification.
 */
const confirmEmail = async (req, res) => {
  try {
    const { id, code } = req.body;
    await confirmVerification(id, code);
    res.status(OK).json({});
  } catch (error) {
    console.error(error);
    res.status(ERROR).json(error);
  }
};

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
    await updatePassword(id, password);
    res.status(OK).json({});
  } catch (error) {
    console.error(error);
    res.status(ERROR).json(error);
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
    res.status(OK).json({});
  } catch (error) {
    console.error(error);
    res.status(ERROR).json(error);
  }
};

const changeUserInformation = async (req, res) => {
  try {
    await updateUser(req.body);
    res.status(OK).json({});
  } catch (error) {
    console.error(error);
    res.status(ERROR).json(error);
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
    await remove(id);
    res.status(OK).json({});
  } catch (error) {
    console.error(error);
    res.status(ERROR).json(error);
  }
};

export {
  registerUser,
  resendEmail,
  confirmEmail,
  login,
  changePassword,
  changeApi,
  changeUserInformation,
  deleteUser,
};
