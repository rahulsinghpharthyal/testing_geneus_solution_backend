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
validateToken,
 } from '../controllers/UserController.js';
import { Auth, refreshTokenHandler, adminRefreshToken } from '../controllers/AuthController.js';
const router = express.Router();



router.post('/api/user/signup', signup);
router.post('/api/user/login', loginUser);
router.get('/api/user', Auth, getUser);
router.post('/api/user/refreshToken', refreshTokenHandler);
router.post('/api/user/adminRefreshToken', adminRefreshToken);
router.post('/userAuth', validateToken, userAuth);
router.post('/newUserRegister',newUserRegister );

export default router;