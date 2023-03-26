import { sendVerificationMail } from "../helpers/NodeMailer";
import db from "../models";
const VerificationLink = db.verificationLinks;

/**
 * Registers a new verification link for the given user ID and email and sends a verification email.
 * @param {number} userId - The ID of the user for whom the verification link is being registered.
 * @param {string} userMail - The email address of the user for whom the verification link is being registered.
 * @returns {Promise} - A Promise that resolves to the newly created verification link object.
 * @throws {Error} - If there is an error creating the verification link or sending the verification email.
 */
const registerVerification = async (userId, userMail) => {
  try {
    const code = generateRandomNumber();
    const expiry = new Date().setDate(new Date().getDate() + 7);
    const verification = await VerificationLink.create({
      code: code,
      expirationDate: expiry,
      userId: userId,
    });
    //Send verification mail
    sendVerificationMail(verification.code, userMail);
    return verification;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates the verification details for the specified user and sends a verification email.
 * @param {string} userId - The ID of the user whose verification details are being updated.
 * @param {string} userMail - The email address of the user to whom the verification email is being sent.
 * @throws {Error} - If there is an error updating the verification details or sending the email.
 */
const updateVerification = async (userId, userMail) => {
  try {
    const code = generateRandomNumber();
    const expiry = new Date().setDate(new Date().getDate() + 7);
    await VerificationLink.update(
      { code: code, expirationDate: expiry },
      {
        where: {
          userId: userId,
        },
      }
    );
    //Send verification mail
    sendVerificationMail(code, userMail);
  } catch (error) {
    throw error;
  }
};

/**
 * Checks if the given verification code matches the user ID
 * @param {number} userId - The ID of the user
 * @param {number} verificationCode - The verification code to check
 * @returns {Promise<boolean>} - Returns a boolean indicating whether the verification code matches the user ID
 * @throws {Error} - Throws an error if there is an issue querying the database
 */
const checkVerification = async (userId, verificationCode) => {
  try {
    const count = await VerificationLink.count({
      where: { userId: userId, code: verificationCode.toString() },
    });
    return count != 0;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes the verification link for a given user ID.
 * @param {number} userId - The ID of the user whose verification link will be deleted.
 * @throws {Error} Will throw an error if there was a problem deleting the verification link.
 */
const deleteVerification = async (userId) => {
  try {
    await VerificationLink.destroy({ where: { userId: userId } });
  } catch (error) {
    throw error;
  }
};

/**
 * Generates a random 6-digit number.
 *
 * @returns {number} - A random 6-digit number.
 */
const generateRandomNumber = () => {
  return Math.floor(Math.random() * 900000) + 100000;
};

export {
  registerVerification,
  updateVerification,
  checkVerification,
  deleteVerification,
};
