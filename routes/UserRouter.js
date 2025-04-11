import express from "express";
import {
    loginUser,
    getUser,
    signup,
    newUserRegister,
    userAuth,
    androidSignup,
    validateToken,
} from "../controllers/UserController.js";
import { Auth, refreshTokenHandler } from "../controllers/AuthController.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/androidSignup", androidSignup);
router.post("/login", loginUser);
router.get("/api/user", Auth, getUser);
router.post("/refreshToken", refreshTokenHandler);
router.post("/userAuth", validateToken, userAuth);
router.post("/newUserRegister", newUserRegister);

export default router;
