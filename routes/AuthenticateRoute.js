import { Router } from "express";

const router = Router()

import { authenticate } from "../Controllers/authenticateController.js";
import { Auth } from "../controllers/AuthController.js";
router.route('/').get(Auth,authenticate);

export default router