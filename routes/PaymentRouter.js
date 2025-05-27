import express from "express";
import dotenv from "dotenv";
import {paymentVerification, postRazorpay,getPaymentKey, getPaymentHistoryByUser} from "../controllers/PaymentController.js"
dotenv.config();

const router = express.Router();
import { Auth } from "../controllers/AuthController.js";

router.route("/payment/get-key").get(Auth, getPaymentKey);
router.post("/razorpay",Auth,postRazorpay);
router.post("/payment/verify-payment",Auth, paymentVerification);
router.get("/payments/:user_Id", Auth, getPaymentHistoryByUser);

export default router;