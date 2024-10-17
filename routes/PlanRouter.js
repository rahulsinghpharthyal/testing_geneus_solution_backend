import express from 'express';
import { updateToPremium } from '../controllers/PlanController.js';
import { Auth } from '../controllers/AuthController.js';

const router = express.Router();

router.put('/', Auth, updateToPremium);

export default router;
