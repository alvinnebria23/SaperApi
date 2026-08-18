import express from 'express';
import { deleteExpiredLinks } from "../controllers/LinkController.js";
import { updateUserToken, getApiCredentials } from '../controllers/ShopeeController.js';
import { getAnalysis } from '../controllers/SubscriptionHistoryController.js';
const router = express.Router();

router.post("/getApiCredentials", getApiCredentials);
router.post("/deletedExpiredLinks", deleteExpiredLinks);
router.post("/updateUserToken", updateUserToken);
router.post("/getAnalysis", getAnalysis)
export default router;