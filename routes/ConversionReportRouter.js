import { Router } from 'express';
import { getConverstionReport } from '../controllers/ConvertionReportController';

const router = Router();

router.get('/getConversionReport', getConverstionReport);

export default router;