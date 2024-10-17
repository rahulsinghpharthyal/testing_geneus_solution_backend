import express from 'express';
import { getUser, registerUser, loginUser } from '../controllers/UserController.js';
import { Auth, refreshTokenHandler } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', Auth, getUser);
router.post('/refresh', refreshTokenHandler);

export default router;
