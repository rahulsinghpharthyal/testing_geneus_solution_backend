import express from "express";
import {logut, contact, loginUser,  signup, enquiry, forgotPassword, resetPassword, getEnquiry, deleteEnquiry, updateEnquiry} from '../controllers/UserController.js'
import { Auth, captureVisitorData, deleteVisitorDataById, deleteVistorDataByDate, getVisitorData } from '../controllers/AuthController.js';
import { Authorise } from "../middlewares/authorize.js";
const router = express.Router();


router.post("/logout",Auth, logut);

router.post("/contact", contact);

router.post("/login",loginUser);

router.post("/signup", signup);

router.post("/enquiry", enquiry);
router.get("/allenquery",Auth, Authorise(["admin"]), getEnquiry);
router.delete('/deletequery/:id', Auth, Authorise(["admin"]), deleteEnquiry);
router.patch('/updateenquiry/:id', Auth, Authorise(["admin"]), updateEnquiry);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/track-visitor", captureVisitorData);
router.get("/getvisitor/:dateFrom/:dateTo", getVisitorData);
router.delete("/deletevisitor/:dateFrom/:dateTo", deleteVistorDataByDate);
router.delete("/deletevisitorbyid/:id", deleteVisitorDataById);


export default router;