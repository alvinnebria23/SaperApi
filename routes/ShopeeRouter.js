import express from 'express';
import { checkApi, dashboard, initial, subIdTree, clickTimeTree } from '../controllers/ShopeeController.js';

const router = express.Router();

router.post('/checkApi', checkApi);
router.post('/dashboard', dashboard)
router.post('/subIdTree', subIdTree);
router.post('/initial', initial);
router.post('/clickTimeTree', clickTimeTree);

export default router;