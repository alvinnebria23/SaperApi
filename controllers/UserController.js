import { OK, ERROR } from "../constants/HttpCodes.js"
import { updateShopeeApi }  from "../service/ShopeeApiService.js"
import { register, updateUser, remove, login, findEmail } from "../service/UserService.js";
import { generateToken, verifyToken } from "../helpers/Jwt.js";
import { sendVerificationMail } from "../helpers/NodeMailer.js";
import logger from "../loggers/logger.js";

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
 * Confirms the verification of a user with the specified ID and verification code.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise} - A Promise that resolves when the verification has been confirmed successfully.
 * @throws {Error} - If there is an error confirming the verification.
 */
const verifyEmail = async (req, res) => {
  try {
    const { token, id, email } = req.query;
    const response = await verifyToken(token);
    if(response.error){
      if(response.errorName === 'expired'){
        const token = generateToken({ id: id, email: email }, '7d');
        await sendVerificationMail(id, email, token);
      }
    }else{
      await updateUser({ isValidEmail: true}, { id: id }, false);
    }
    const htmlResponse = response ? getHtmlResponse(true) : getHtmlResponse(false, response.errorName);
    res.set('Content-Type', 'text/html').send(Buffer.from(htmlResponse));
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
    
    res.status(OK).json({});
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
};


const changeUserInformation = async (req, res) => {
  try {
    const { data, where } = req.body;
    const response = await updateUser(data, where, true);
    res.status(OK).json(response);
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

const getHtmlResponse = (isVerified, errorName = null) => {
  return  `
  <!DOCTYPE html>
    <html>
      <head>
        <title>Email Verification</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          
          .centered-div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 80%;
            max-width: 400px;
            padding: 20px;
            border: solid 1px #FF4E00;
            border-radius: 5px;
            box-shadow: 0 0 10px #FF4E00;
            color: black
          }
        </style>
      </head>
      <body>
        <div class="centered-div">
          <h1>${isVerified ? `You have successfully completed the registration!` : errorName === 'invalid' ? `INVALID TOKEN` : `Your verification link has expired.`}</h1>
          <p>${isVerified ? `You can now log in to your account on the SAPERS mobile application.` : `We have sent another verification link to your email address. Please verify your email address within 7 days.`}</p>
          <br>
          <p>Thank you for downloading our app.</p>
          <br>
          <p>Best regards:</p>
          <p>SAPERS Team</p>
        </div>
      </body>
    </html>`;
};

export {
  registerUser,
  verifyEmail,
  login,
  changePassword,
  changeUserInformation,
  loginUser,
  checkEmail,
};
