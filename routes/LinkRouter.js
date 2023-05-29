import express from 'express';
import { generateAndSaveLink, removeLinks, retrieveGeneratedLinks, updateLink } from "../controllers/LinkController.js";
import checkToken from '../helpers/CheckToken.js';
const router = express.Router();

router.post("/generateAndSaveLink", checkToken,  generateAndSaveLink);
router.post("/retrieveGeneratedLinks", checkToken, retrieveGeneratedLinks);
router.post("/updateLink", checkToken, updateLink);
router.post("/removeLinks", checkToken, removeLinks);

export default router;