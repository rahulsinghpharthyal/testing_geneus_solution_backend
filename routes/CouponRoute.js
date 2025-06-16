import { Router } from "express";
import { createCoupon } from "../controllers/CouponController.js";
import { Auth } from "../controllers/AuthController.js";
import { Authorise } from "../middlewares/authorize.js";

const router = Router();

router.post("/add-coupon", Auth, Authorise(["admin"]), createCoupon);

export default router;
