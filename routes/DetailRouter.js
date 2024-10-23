import express from 'express';
import { updateDetail } from '../controllers/DetailController.js';
import { configDotenv } from 'dotenv';
configDotenv()
const router = express.Router();

router.post('/api/detail/update', updateDetail);

router.get('/api/procressenv', async (req, res) => {
    res.send(`Hello World, Razorpay ID: ${process.env.RAZORPAY_ID}`);
});
export default router;
