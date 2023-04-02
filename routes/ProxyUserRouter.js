import express from 'express';
import {
    verifyEmail,
  } from "../controllers/UserController.js";

const router = express.Router();

router.get("/verifyEmail", verifyEmail);

export default router;