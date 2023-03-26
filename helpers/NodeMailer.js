import { createTransport } from "nodemailer";
import { USER, PASSWORD, SERVICE } from "../config/mailAccountConfig";

const transporter = createTransport({
  service: SERVICE,
  auth: {
    user: USER,
    pass: PASSWORD,
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
    from: USER,
    to: userMail,
    subject: "Email Verification - SAPERS",
    text: verificationCode.toString(),
  });
  console.log(JSON.stringify(result, null, 4));
};

export { sendVerificationMail };
