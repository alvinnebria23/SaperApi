import express from 'express';
import { generateAndSaveLink, removeLinks, retrieveGeneratedLinks, updateLink } from "../controllers/LinkController.js";
const router = express.Router();

router.post("/generateAndSaveLink", generateAndSaveLink);
router.post("/retrieveGeneratedLinks", retrieveGeneratedLinks);
router.post("/updateLink", updateLink);
router.post("/removeLinks", removeLinks);
export default router;