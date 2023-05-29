import express from 'express';
import {
    registerUser,
    loginUser,
    changePassword,
    changeUserInformation,
    checkEmail,
  } from "../controllers/UserController.js";
import checkToken from '../helpers/CheckToken.js';

const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.post("/changePassword", checkToken, changePassword);
router.post("/changeUserInformation", checkToken,  changeUserInformation);
router.post("/checkEmail", checkEmail);

export default router;