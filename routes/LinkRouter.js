import express from 'express';
import { generateAndSaveLink } from "../controllers/LinkController.js";
const router = express.Router();

router.post("/generateAndSaveLink", generateAndSaveLink);

export default router;