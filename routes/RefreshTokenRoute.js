import express from "express";

const router = express.Router();

import { getRefreshToken } from "../controllers/RefreshTokenController";

router.get("/refresh_token", getRefreshToken);


export default router;
