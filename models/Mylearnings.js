import mongoose from "mongoose";

const myLearningSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        courses_id: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        }],
    },
    { timestamps: true }
);

const MyLearning = mongoose.model("MyLearning", myLearningSchema);

export default MyLearning;