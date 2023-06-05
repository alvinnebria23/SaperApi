import express from 'express';
import { checkApi, dashboard, initial, subIdTree, clickTimeTree, updateUserToken } from '../controllers/ShopeeController.js';
import checkToken from '../helpers/CheckToken.js';
import checkAdminToken from '../helpers/CheckAdminToken.js';

const router = express.Router();

router.post('/checkApi', checkApi);
router.post('/dashboard', checkToken, dashboard)
router.post('/subIdTree', checkToken, subIdTree);
router.post('/initial',checkToken, initial);
router.post('/clickTimeTree', checkToken, clickTimeTree);
router.post('/updateUserToken', checkAdminToken, updateUserToken);
export default router;