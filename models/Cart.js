import mongoose from "mongoose";

const cartSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    coursesIds: [{
      type:mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }],
    cartItemLength: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// cartSchema.pre("save", function (next) {
//   this.cartItemLength = this.coursesIds.length;
//   next();
// });

export default mongoose.model("Cart", cartSchema);
