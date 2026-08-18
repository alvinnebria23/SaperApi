import express from 'express';
import {
    registerUser,
    loginUser,
    changeUserInformation,
    checkEmail,
    forgotPassword,
  } from "../controllers/UserController.js";
import checkToken from '../helpers/CheckToken.js';
const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.post("/changeUserInformation",  changeUserInformation);
router.post("/checkEmail", checkEmail);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", checkToken, changeUserInformation);

export default router;