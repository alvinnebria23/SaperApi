import express from 'express';
import { checkApi, dashboard, conversion, initial } from '../controllers/ShopeeController.js';

const router = express.Router();

router.post('/checkApi', checkApi);
router.post('/dashboard', dashboard)
router.post('/conversion', conversion);
router.post('/initial', initial);
export default router;