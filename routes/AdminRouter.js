import express from 'express';
import { deleteExpiredLinks } from "../controllers/LinkController.js";
import { getAllValidUsers } from '../controllers/UserController.js';
import { getAnalysis, updateUserToken } from '../controllers/ShopeeController.js';
const router = express.Router();

router.post("/getAllUsers", getAllValidUsers);
router.post("/deletedExpiredLinks", deleteExpiredLinks);
router.post("/updateUserToken", updateUserToken);
router.post("/getAnalysis", getAnalysis)
export default router;