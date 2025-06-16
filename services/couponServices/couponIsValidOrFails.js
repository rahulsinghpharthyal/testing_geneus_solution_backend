import Coupon from "../../models/Coupon.js";
import ApiError from "../../utilities/ApiError.js";

export const couponIsValidOrFail = async (coupon_id) => {
  const coupon = await Coupon.findById({ _id: coupon_id });
  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  if (!coupon.is_active) {
    throw new ApiError(400, "Coupon is not active");
  }

  if (coupon.valid_from && new Date() < new Date(coupon.valid_from)) {
    throw new ApiError(400, "Coupon is not yet active");
  }

  if (coupon.valid_until && new Date() > new Date(coupon.valid_until)) {
    throw new ApiError(400, "Coupon has expired");
  }

  return coupon;
};
