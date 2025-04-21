// Define a schema for visitor data
import mongoose from "mongoose";

    const visitorSchema = new mongoose.Schema({
        ip: {
          type: String,
        },
        city: {
          type: String,
        },
        country: {
          type: String,
        },
        url: {
          type: String,
        },
      }, {timestamps: true});

// Create a model
export default mongoose.model('Visitor', visitorSchema);