import express from 'express';
import {
    registerUser,
    resendEmail,
    confirmEmail,
    login,
    changePassword,
    changeApi,
    changeUserInformation,
    deleteUser,
  } from "../controllers/UserController.js";

const router = express.Router();

router.post("/registerUser", registerUser);

router.post("/resendEmail", resendEmail);

router.post("/confirmEmail", confirmEmail);

router.post("/login", login);

router.post("/changePassword", changePassword);

router.post("/changeApi", changeApi);

router.post("/changeUserInformation", changeUserInformation);

router.post("/deleteUser", deleteUser);

export default router;