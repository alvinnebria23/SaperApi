import express from 'express';
import {
    registerUser,
    loginUser,
    changeUserInformation,
    checkEmail,
  } from "../controllers/UserController.js";

const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.post("/changeUserInformation",  changeUserInformation);
router.post("/checkEmail", checkEmail);
export default router;