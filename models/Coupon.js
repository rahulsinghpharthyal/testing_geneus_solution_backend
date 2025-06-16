import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount_type: {
    type: String,
    enum: ['flat', 'percentage'],
    required: true,
  },
  discount_value: {
  type: Number,
  required: true,
  min: [0, 'Discount value must be positive'],
  },
  valid_from: {
    type: Date,
    required: true,
  },
  valid_until: {
  type: Date,
  required: true,
  validate: {
    validator: function(value) {
      return value > this.valid_from;
    },
    message: 'valid_until must be after valid_from',
  },
},
  min_order_value: {
    type: Number,
    default: 0,
  },
  applicable_courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  is_active: {
    type: Boolean,
    default: true,
  },
  distributeToAll: {
    type: Boolean,
    default: false, 
  },
  campaign_tag: {
    type: String,
    default: null, 
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true 
});

const Coupon = mongoose.model('Coupon', CouponSchema);
export default Coupon;
