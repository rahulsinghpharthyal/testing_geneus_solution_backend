// This Schema is Support and query:-

import mongoose from "mongoose";
const { Schema } = mongoose;
var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const enquirySchema = new Schema(
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
            required: 'Email address is required',
            unique: false,
            validate: [validateEmail, 'Please fill a valid Email'],
            match: [
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              'Please fill a valid Email',
            ],
          },
          subject: {
            type: String,
            trim: true,
            required: true,
          },
          paymentId: {
            type: String,
            trim: true,
          },
          message: {
            type: String,
            trim: true,
            required: true,
          },
          status: {
            type: String,
            enum: ['PENDING', 'REJECTED', 'COMPLETED'],
            default: 'PENDING'
          }
        },
        { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
