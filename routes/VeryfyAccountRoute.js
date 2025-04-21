import { Router } from "express";

const router = Router();

import { sendOTP,veryfyEmail } from "../controllers/verifyAccountController.js";

router.route("/verify-account/send-otp").post(sendOTP);
router.route('/verify-account').post(veryfyEmail);

export default router;