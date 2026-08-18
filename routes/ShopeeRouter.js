import express from 'express';
import { checkApi, dashboard, subIdTree, clickTimeTree } from '../controllers/ShopeeController.js';
import checkToken from '../helpers/CheckToken.js';

const router = express.Router();

router.post('/checkApi', checkApi);
router.post('/dashboard', checkToken, dashboard)
router.post('/subIdTree', checkToken, subIdTree);
router.post('/clickTimeTree', checkToken, clickTimeTree);
export default router;