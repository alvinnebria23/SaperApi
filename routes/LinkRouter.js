import express from 'express';
import { generateAndSaveLink, retrieveGeneratedLinks } from "../controllers/LinkController.js";
const router = express.Router();

router.post("/generateAndSaveLink", generateAndSaveLink);
router.post("/retrieveGeneratedLinks", retrieveGeneratedLinks);
export default router;