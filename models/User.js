import mongoose from "mongoose";
const { Schema } = mongoose;
var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
const userSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: "Email address is required",
            validate: [validateEmail, "Please fill a valid email address"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
        },
        password: {
            type: String,
            trim: true,
            required: true,
            min: 8,
            max: 25,
        },
        mobile: {
            type: String,
            trim: true,
            required: true,
            match: [
                /^[0-9]{10}$/,
                "Please fill a valid 10-digit mobile number",
            ],
        },
        courses: [String],
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        subscriptionStatus: {
            type: Boolean,
            default: false,
        },
		details : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Details'
		},
		food : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Food'
		},
		plan : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Plan'
		},
        refreshToken: {
            type: String,
        },
    },
    { timestamp: true }
);
//export default mongoose.model("User", userSchema);
// Check if the model already exists to avoid overwriting
const User = mongoose.models.User || mongoose.model('User', userSchema);

 // Default export
export default User;