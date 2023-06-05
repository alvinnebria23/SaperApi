import express from 'express';
import {
    registerUser,
    loginUser,
    changeUserInformation,
    checkEmail,
    getAllUsers,
  } from "../controllers/UserController.js";
import checkToken from '../helpers/CheckToken.js';
import checkAdminToken from '../helpers/CheckAdminToken.js';

const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.post("/changeUserInformation", checkToken,  changeUserInformation);
router.post("/checkEmail", checkEmail);
router.post("/admin/getAllUsers", checkAdminToken, getAllUsers);
export default router;