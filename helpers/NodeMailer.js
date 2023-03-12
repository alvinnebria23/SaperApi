const nodemailer = require("nodemailer");
const mailAccountConfig = require("../config/mailAccountConfig");

const transporter = nodemailer.createTransport({
  service: mailAccountConfig.SERVICE,
  auth: {
    user: mailAccountConfig.USER,
    pass: mailAccountConfig.PASSWORD,
  },
});

/**
 * Sends a verification email to the specified user email address containing the given verification code.
 * @param {number} verificationCode - The verification code to include in the email.
 * @param {string} userMail - The email address of the user to whom the verification email is being sent.
 * @returns {Promise} - A Promise that resolves when the email has been sent successfully.
 * @throws {Error} - If there is an error sending the email.
 */
const sendVerificationMail = async (verificationCode, userMail) => {
  const result = await transporter.sendMail({
    from: mailAccountConfig.USER,
    to: userMail,
    subject: "Email Verification - SAPERS",
    text: verificationCode.toString(),
  });
  console.log(JSON.stringify(result, null, 4));
};

module.exports = { sendVerificationMail };
