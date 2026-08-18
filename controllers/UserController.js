import { OK, ERROR } from "../constants/HttpCodes.js"
import { register, updateUser, login, findEmail } from "../service/UserService.js";
import logger from "../loggers/logger.js";
import { sendVerificationMail } from "../helpers/NodeMailer.js";
import { generateToken } from "../helpers/Jwt.js";

/**
 * Registers a new user with the details provided in the request body.
 * @param {Object} req - The HTTP request object containing the details of the new user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise} - A Promise that resolves when the user is successfully registered and the response has been sent.
 * @throws {Error} - If there is an error registering the user or sending the response.
 */
const registerUser = async (req, res) => {
  try {
    const { user } = req.body;
    const createdUser = await register(user);
    res.status(OK).json(createdUser);
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
};

/**
 * Handles the login request of a user and sends back the appropriate response.
 * @param {Object} req - The request object containing the login credentials.
 * @param {Object} res - The response object that will be sent back to the client.
 */
const loginUser = async (req, res) => {
  try {
    const { user } = req.body;
    const response = await login(user);
    res.status(OK).json(response);
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
};

const changeUserInformation = async (req, res) => {
  try {
    const { data, where, action } = req.body;
    const response = await updateUser(data, where, true);
    if(action === "resetPassword"){
      return res.status(OK).json({ success: response });
    }
    return res.status(OK).json(response);
  } catch (error) {
    console.error(error);
    res.status(ERROR).json(error);
  }
};

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await findEmail(email);
    res.status(OK).json(response);
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findEmail(email, true);
    if(!user){
      return res.status(OK).json({ isValidEmail: false });
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    await sendVerificationMail(verificationCode, email, true);
    const responseObject = {
      userId: user.id,
      email: user.email,
      oneTimePassword: verificationCode,
      token: generateToken({ oneTimePassword: verificationCode }),
      isValidEmail: true
    };
    return res.status(OK).json(responseObject);
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
};

export {
  registerUser,
  login,
  changeUserInformation,
  loginUser,
  checkEmail,
  forgotPassword
};
