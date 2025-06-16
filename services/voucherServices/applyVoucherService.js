import Course from "../../models/Course.js";
import ApiError from "../../utilities/ApiError.js";
import { generateVoucherToken } from "../../utilities/generateJwtToken.js";
import { findVoucherByCodeOrFail } from "./findVoucherByCodeOrFail.js";



export const verifyVoucherService = async ({ code, user_id, cartAmount, course_id }) => {
    console.log('this is code', code)
  const voucher = await findVoucherByCodeOrFail(code); // fine the code is foound and valid or not

  if (!voucher) throw new ApiError(404, "Voucher not found");
  if (!voucher.is_active) throw new ApiError(400, "Voucher is not active");
  if (voucher.expires_at && new Date() > voucher.expires_at) throw new ApiError(400, "Voucher has expired");
  if (voucher.usage_count >= voucher.user_limit) throw new ApiError(400, "Voucher usage limit exceeded");

  if (voucher.user_id && voucher.user_id.toString() !== user_id) {
    throw new ApiError(403, "Voucher not assigned to this user");
  }

const coupon = voucher.coupon_id;
  // ✅ Validate course eligibility
  let eligibleCourseIds = course_id;
  if (coupon.applicable_courses?.length > 0) {
    const allowed = coupon.applicable_courses.map(id => id.toString());
    const filtered = course_id.filter(cid => allowed.includes(cid.toString()));
    if (filtered.length === 0) {
      throw new ApiError(403, "This coupon is not valid for the selected courses.");
    }
    eligibleCourseIds = filtered;
  }

  // ✅ Fetch prices of eligible courses from DB
  const eligibleCourses = await Course.find({ _id: { $in: eligibleCourseIds } });
  const eligibleAmount = eligibleCourses.reduce((sum, course) => sum + course.discount_price, 0);
  console.log('this is eligible amount', eligibleAmount)
  // ✅ Calculate Discount
  let discountAmount = 0;
  if (coupon.discount_type === "flat") {
    discountAmount = coupon.discount_value;
  } else if (coupon.discount_type === "percentage") {
    const rawDiscount = (coupon.discount_value / 100) * eligibleAmount;
    discountAmount = coupon.max_discount
      ? Math.min(rawDiscount, coupon.max_discount)
      : rawDiscount;
  }

  const finalAmount = Math.max(cartAmount - discountAmount, 0);
  const data = {
    voucherId: voucher._id,
    user_id,
    discountAmount,
    finalAmount,
    cartAmount,
    couponId: coupon._id,
    course_id
  };

  const token = generateVoucherToken(data);

  return {
    success: true,
    token,
    discountAmount,
    finalAmount,
    eligibleAmount,
    originalAmount: cartAmount,
    voucherId: voucher._id,
    couponId: coupon._id,
  };
};