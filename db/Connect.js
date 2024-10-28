import mongoose from "mongoose";

mongoose.connect(process.env.DATABASE).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error connecting to MongoDB:', error);
})