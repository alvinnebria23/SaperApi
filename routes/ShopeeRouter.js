import express from 'express';
import { checkApi, conversionReport } from '../controllers/ShopeeController.js';

const router = express.Router();

router.post('/checkApi', checkApi);
router.post('/conversionReport', conversionReport)

export default router;