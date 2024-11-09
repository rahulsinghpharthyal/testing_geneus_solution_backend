import express from 'express';
import {
  loginUser,
  getUser,
  logut,
  contact,
  forgotPassword,
  resetPassword,
  login,
  enquiry,
  signup,
newUserRegister,
userAuth,
validateToken } from '../controllers/UserController.js';
import { Auth, refreshTokenHandler } from '../controllers/AuthController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', loginUser);
router.get('/api/user', Auth, getUser);
router.post('/refreshToken', refreshTokenHandler);
router.post('/userAuth', validateToken, userAuth);
router.post('/newUserRegister',newUserRegister );

export default router;