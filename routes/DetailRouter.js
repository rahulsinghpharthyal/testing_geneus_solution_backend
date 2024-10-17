import express from 'express';
import { updateDetail } from '../controllers/DetailController.js';


const router = express.Router();

router.post('/update', updateDetail);

export default router;
