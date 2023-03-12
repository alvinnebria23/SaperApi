const {
  registerVerification,
  updateVerification,
  checkVerification,
  deleteVerification,
} = require("./VerificationLinkService");
const db = require("../models");
const User = db.users;

/**
 * Registers a new user with the given details and creates a verification link for the user.
 * @param {Object} user - The user object containing the details of the user to be registered.
 * @returns {Promise} - A Promise that resolves to the newly created user object.
 * @throws {Error} - If there is an error creating the user object.
 */
const registerUser = async (user) => {
  try {
    //Create user
    const createdUser = await User.create({
      email: user.email,
      name: user.name,
      password: user.password,
      contactNumber: user.contactNumber,
    });
    //Create verification link
    await registerVerification(createdUser.id, createdUser.email);
    return createdUser;
  } catch (error) {
    throw error;
  }
};

/**
 * Resends the email verification to the specified user.
 * @param {string} userId - The ID of the user to whom the verification email is being resent.
 * @param {string} userMail - The email address of the user to whom the verification email is being resent.
 * @throws {Error} - If there is an error updating the verification details.
 */
const resendVerification = async (userId, userMail) => {
  try {
    await updateVerification(userId, userMail);
  } catch (error) {
    throw error;
  }
};

/**
 * Confirms user email verification using the given user ID and verification code.
 * If the verification is successful, the user's email is marked as valid and the verification link is deleted.
 * @param {*} userId - The ID of the user to confirm the verification for.
 * @param {*} verificationCode - The verification code to confirm the user's email.
 * @throws Will throw an error if there is an issue checking the verification or updating the user's email validity status.
 */
const confirmVerification = async (userId, verificationCode) => {
  try {
    const exist = await checkVerification(userId, verificationCode);
    if (exist) {
      await User.update({ isValidEmail: true }, { where: { id: userId } });
      await deleteVerification(userId);
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { registerUser, resendVerification, confirmVerification };
