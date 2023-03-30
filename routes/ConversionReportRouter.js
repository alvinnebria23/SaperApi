import express from 'express';
import { getConverstionReport } from '../controllers/ConvertionReportController.js';

const router = express.Router();

router.get('/getConversionReport', getConverstionReport);

export default router;