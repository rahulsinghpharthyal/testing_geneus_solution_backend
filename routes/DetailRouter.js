import express from 'express';
import { configDotenv } from 'dotenv';
configDotenv()

import { getYourCaloriesRequirement,updateDetail } from '../controllers/DetailController.js';
const router = express.Router();

import { Auth } from '../controllers/AuthController.js'

router.post('/api/detail/update',Auth, updateDetail);
router.get('/api/detail/getYourCaloriesRequirement', Auth, getYourCaloriesRequirement);


export default router;
