import express from 'express';
import {
  loginUser,
  getUser,
  signup,
newUserRegister,
userAuth,
validateToken,
deleteUserById,
createAndUpdateUserProfile,
getUserProfile,
 } from '../controllers/UserController.js';
import { Auth, refreshTokenHandler} from '../controllers/AuthController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', loginUser);
router.get('/api/user', Auth, getUser);
router.post('/refreshToken', refreshTokenHandler);
router.post('/userAuth', validateToken, userAuth);
router.post('/newUserRegister',newUserRegister );
router.delete('/deleteUser/:id', Auth, deleteUserById);
router.post('/updateuserprofile/:userId', createAndUpdateUserProfile);
router.get('/getuserprofile/:id',Auth, getUserProfile);
export default router;