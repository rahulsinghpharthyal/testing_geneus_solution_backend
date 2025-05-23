import express from "express";
import dotenv from "dotenv";
import {getPaymentHistoryByUser, paymentVerification, postRazorpay} from "../controllers/PaymentController.js"
dotenv.config();

const router = express.Router();

router.post("/razorpay",postRazorpay);
router.post("/paymentverification", paymentVerification);
router.get("/payments/:userId", getPaymentHistoryByUser);

export default router;