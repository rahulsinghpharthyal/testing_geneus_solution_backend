import express from "express";

const router = express.Router();

import { authenticate } from "../controllers/AuthenticateController.js";
import { Auth } from "../controllers/AuthController.js";

router.route('/authenticate').get(Auth,authenticate);

export default router