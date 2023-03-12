const {
  registerVerification,
  updateVerification,
  checkVerification,
  deleteVerification,
} = require("./VerificationLinkService");
const db = require("../models");
const { registerShopeeApi } = require("./ShopeeApiService");
const User = db.users;

/**
 * Registers a new user with the given user information and returns the created user.
 * Also creates a Shopee API and a verification link for the user.
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
    //Create shopee api
    registerShopeeApi(user.appId, user.secretKey, createdUser.id);
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

/**
 * Changes the password of the user with the provided ID to the new password.
 * @param {number} id - The ID of the user to change the password for.
 * @param {string} password - The new password to set for the user.
 * @throws {Error} - If there is an error changing the password.
 */
const changePassword = async (id, password) => {
  try {
    await User.update({ password: password }, { where: { id: id } });
  } catch (error) {
    throw error;
  }
};

/**
 * Updates the information of the user with the provided user object and creates a new verification link.
 * @param {Object} user - An object containing the updated user information.
 * @throws {Error} - If there is an error updating the user information or creating a new verification link.
 */
const updateUser = async (user) => {
  try {
    const origUser = await User.findOne({ where: { id: user.id } });
    if (origUser) {
      const origMail = origUser.email;
      //Update user
      await User.update({
        email: user.email,
        name: user.name,
        contactNumber: contactNumber,
        isValidEmail: false,
      });
      //Reverification
      if (origMail !== user.email) {
        //Create verification link
        await registerVerification(user.id, user.email);
      }
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes the user with the provided ID from the database.
 * @param {number} id - The ID of the user to delete.
 * @throws {Error} - If there is an error deleting the user.
 */
const deleteUser = async (id) => {
  try {
    await User.destroy({ where: { id: id } });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerUser,
  resendVerification,
  confirmVerification,
  changePassword,
  updateUser,
  deleteUser,
};
