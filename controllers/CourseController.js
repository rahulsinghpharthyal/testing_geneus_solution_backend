import mongoose from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { configDotenv } from 'dotenv';
configDotenv()
const getCourse = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: "Error fetching courses" });
    }
}

const addCourse = async (req, res) => {
  try {
    const {
      id,
      title,
      img,
      description,
      level,
      price,
      discount_price,
      learnings,
      requirements,
      aboutCourse,
      whythisCourse,
      whoitsfor,
    } = req.body;

    // Validation checks (basic example, consider using libraries like Joi)
    if (!title || !img || !description || !price) {
      return res.status(400).json({ error: "Title, Image, Description, and Price are required." });
    }

    // Create a new course instance
    const newCourse = new Course({
      id,
      title,
      img,
      description,
      level,
      price,
      discount_price,
      learnings,
      requirements,
      aboutCourse,
      whythisCourse,
      whoitsfor,
    });

    // Save the course to the database
    await newCourse.save();
    res.status(201).json({ message: "Course added successfully", course: newCourse });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Error adding course", details: error.message });
  }
};


const learning = async (req, res) => {
    try {
        const user_id = req.query.user_id;
        
        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const user = await User.findById(user_id);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const user_courses = user.courses;
        
        const courses = await Course.find({ _id: { $in: user_courses } });
        
        res.status(200).json({ courses: courses });
    } catch (error) {
        res.status(500).json({ error: "Error fetching courses" });
    }
}

const getCourseById = async (req, res) => {
  try {
    const { _id } = req.query; // Extract user ID from the query
    const courseId = req.params.id;
    console.log("Course ID:", courseId);
    // Fetch course details
    const courseDetails = await Course.findById(courseId).lean();
    if (!courseDetails) {
      return res.status(404).json({ error: "Course details not found" });
    }

    let hasAccess = false;

    // Validate _id before using it
    if (_id && mongoose.Types.ObjectId.isValid(_id)) {
      const user = await User.findById(_id).lean();
      if (user) {
        // Check if the user has access to the course
        hasAccess = user.courses.includes(courseId);
      }
    }

    // Modify course content based on access
    const modifiedContent = courseDetails?.courseContent?.map((content, index) => {
      if (index === 0 || hasAccess) {
        return content; // Return the first video or all videos if the user has access
      }
      return { ...content, url: null }; // Remove URLs for other videos
    });

    // Construct the response
    const modifiedCourseDetails = {
      ...courseDetails,
      courseContent: modifiedContent,
    };

    res.json(modifiedCourseDetails);
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ error: "Error fetching course details" });
  }
};

  
  

export {
    learning,
    getCourseById, 
    getCourse,
    addCourse
}