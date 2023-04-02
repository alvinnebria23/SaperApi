import { createTransport } from "nodemailer";
import { USER, PASSWORD, SERVICE } from "../config/mailAccountConfig.js";
import { BASE_URL } from "../config/dbConfig.js";
const transporter = createTransport({
  service: SERVICE,
  auth: {
    user: USER,
    pass: PASSWORD,
  },
});

/**

Sends a verification email to the specified user email address containing a token for email verification.
@param {string} email - The email address of the user to whom the verification email is being sent.
@param {string} token - The token to be used for email verification.
@returns {Promise} - A Promise that resolves when the email has been sent successfully.
@throws {Error} - If there is an error sending the email.
*/
const sendVerificationMail = async (id, email, token) => {
  const result = await transporter.sendMail({
    from: USER,
    to: email,
    subject: `Email Verification - SAPERS`,
    html: `
      <p>Thanks for downloading our mobile application!</p>
      <p>Finally you have reached the last process to complete the registration.</p>
      <br>
      <a href="${BASE_URL}/user/verifyEmail?token=${token}&id=${id}&email=${email}">CLICK HERE TO VERIFY YOUR EMAIL ADDRESS.</a>
      <br>
      If you have problems, please paste the above URL into your web browser.
  `,
  });
};

export { sendVerificationMail };
