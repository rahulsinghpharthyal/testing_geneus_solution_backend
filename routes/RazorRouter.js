import express from "express";
import dotenv from "dotenv";
import {paymentVerification, postRazorpay} from "../controllers/RazorpayController.js"
dotenv.config();

const router = express.Router();

router.post("/razorpay",postRazorpay);
router.post("/paymentverification", paymentVerification);

export default router;