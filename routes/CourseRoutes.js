import express from "express";
// import Course from "../models/Course.js";
// import User from "../models/User.js";
import {getCourse, getCourseById,addCourse, learning, updateCourse, deleteCourse,courseCheckout} from "../controllers/CourseController.js"
import { Auth } from "../controllers/AuthController.js";
import { Authorise } from "../middlewares/authorize.js";
import { validateVoucherToken } from "../middlewares/validateVoucherToken.js";
const router = express.Router();

router.get("/courses", getCourse);
router.post("/add-course",Auth,Authorise(["admin"]), addCourse);
router.put("/update-course/:courseId",Auth,Authorise(["admin"]), updateCourse);
router.delete("/delete-course/:courseId",Auth,Authorise(["admin"]), deleteCourse);
router.get("/learning",Auth, learning);
router.get("/courseDes/:id",getCourseById);

router.route('/course-checkout').post(Auth, validateVoucherToken, courseCheckout);

export default router;