import express from 'express';
import { updateDetail } from '../controllers/DetailController.js';


const router = express.Router();

router.post('/api/detail/update', updateDetail);

export default router;
