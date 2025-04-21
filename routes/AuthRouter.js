import express from "express";
import {logut, contact, loginUser,  signup, enquiry, forgotPassword, resetPassword} from '../controllers/UserController.js'
import { Auth, captureVisitorData, deleteVisitorDataById, deleteVistorDataByDate, getVisitorData } from '../controllers/AuthController.js';
const router = express.Router();


router.post("/logout",Auth, logut);

router.post("/contact", contact);

router.post("/login",loginUser);

router.post("/signup", signup);

router.post("/enquiry", enquiry);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/track-visitor", captureVisitorData);
router.get("/getvisitor/:dateFrom/:dateTo", getVisitorData);
router.delete("/deletevisitor/:dateFrom/:dateTo", deleteVistorDataByDate);
router.delete("/deletevisitorbyid/:id", deleteVisitorDataById);


export default router;