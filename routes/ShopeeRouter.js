import express from 'express';
import { checkApi } from '../controllers/ShopeeController.js';

const router = express.Router();

router.post('/checkApi', checkApi);

export default router;