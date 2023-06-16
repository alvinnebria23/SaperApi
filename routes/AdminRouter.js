import express from 'express';
import { deleteExpiredLinks } from "../controllers/LinkController.js";
import { getAllValidUsers } from '../controllers/UserController.js';
import { updateUserToken } from '../controllers/ShopeeController.js';
const router = express.Router();

router.post("/getAllUsers", getAllValidUsers);
router.post("/deletedExpiredLinks", deleteExpiredLinks);
router.post("/updateUserToken", updateUserToken);

export default router;