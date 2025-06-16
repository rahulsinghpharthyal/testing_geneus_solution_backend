import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    coupon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    user_limit: {
      type: Number,
      default: 1, // max uses by the perticular user
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    usage_count: {
      type: Number,
      default: 0,
    },
    used_at: {
      type: Date,
    },
    expires_at: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value > new Date();
        },
        message: "Expiry date must be in the future",
      },
    },
  },
  { timestamps: true }
);

const Voucher = mongoose.model("Voucher", VoucherSchema);

export default Voucher;
