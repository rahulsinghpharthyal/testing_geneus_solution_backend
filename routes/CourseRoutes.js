import express from "express";
// import Course from "../models/Course.js";
// import User from "../models/User.js";
import {getCourse, getCourseById,addCourse, learning} from "../controllers/CourseController.js"
import { Auth } from "../controllers/AuthController.js";
import { Authorise } from "../middlewares/authorize.js";
const router = express.Router();

router.get("/courses", getCourse);
router.post("/add-course",Auth,Authorise(["admin"]), addCourse);
router.get("/learning", learning);
router.get("/courseDes/:id",getCourseById);

export default router;