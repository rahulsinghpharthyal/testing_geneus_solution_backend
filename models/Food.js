import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    breakfast: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "FoodItem",
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    lunch: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "FoodItem",
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    dinner: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "FoodItem",
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
});

const Food = mongoose.model("UserDietDiary", foodSchema);

export default Food;
