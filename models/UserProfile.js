import mongoose, { Schema } from "mongoose";

const userProfile = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dateOfBirth: {
        type: String
    },
    secondaryEmail: {
        type: String,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(email){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
            },
            message: "Please Enter Valid Email"
        },
    },
    whatsappNumber: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: "WhatsApp number must be exactly 10 digits",
        },
    },
    address: {
        type: String,
    },
    profilePicture: {
        type: String,
    }
}, { timestamps: true });

const UserProfile = mongoose.model("UserProfile", userProfile);
export default UserProfile;
