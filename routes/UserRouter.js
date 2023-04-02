import express from 'express';
import {
    registerUser,
    loginUser,
    changePassword,
    changeApi,
    changeUserInformation,
    deleteUser,
    checkEmail,
  } from "../controllers/UserController.js";

const router = express.Router();

router.post("/registerUser", registerUser);

router.post("/loginUser", loginUser);

router.post("/changePassword", changePassword);

router.post("/changeApi", changeApi);

router.post("/changeUserInformation", changeUserInformation);

router.post("/deleteUser", deleteUser);

router.post("/checkEmail", checkEmail);

export default router;