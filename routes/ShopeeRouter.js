import express from 'express';
import { checkApi, dashboard } from '../controllers/ShopeeController.js';

const router = express.Router();

router.post('/checkApi', checkApi);
router.post('/dashboard', dashboard)

export default router;