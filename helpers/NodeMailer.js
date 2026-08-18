import { createTransport } from "nodemailer";
import { USER, PASSWORD, SERVICE } from "../config/mailAccountConfig.js";
import { RESETPASSWORD_EMAIL_HTML, RESETPASSWORD_EMAIL_TITLE, VERIFICATION_EMAIL_HTML, VERIFICATION_EMAIL_TITLE } from "../constants/mailConstants.js";
import logger from "../loggers/logger.js";
const transporter = createTransport({
  service: SERVICE,
  auth: {
    user: USER,
    pass: PASSWORD,
  },
});

/**

Sends a verification email to the specified user email address containing a token for email verification.
* @param {int} verificationCode - The code to be used for email verification.
* @param {string} email - The email address of the user to whom the verification email is being sent.
* @param {string} token - The token to be used for email verification.
* @returns {Promise} - A Promise that resolves when the email has been sent successfully.
* @throws {Error} - If there is an error sending the email.
*/
const sendVerificationMail = async (verificationCode, email, forgotPassword = false) => {
  const html = (forgotPassword ? RESETPASSWORD_EMAIL_HTML : VERIFICATION_EMAIL_HTML) + `<h1>${verificationCode}</h1>`;
  try {
    await transporter.sendMail({
      from: USER,
      to: email,
      subject: forgotPassword ? RESETPASSWORD_EMAIL_TITLE : VERIFICATION_EMAIL_TITLE,
      html: html,
    });
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error.message);
    return;
  }
};

export { sendVerificationMail };
