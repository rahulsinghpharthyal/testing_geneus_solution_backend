import Coupon from "../../models/Coupon.js";
import ApiError from "../../utilities/ApiError.js";

export const createCouponService = async (data) => {
  const coupon = new Coupon(data);
  return await coupon.save();
};

export const findCouponByIdOrFail = async (coupon_id) => {
  const coupon = await Coupon.findById(coupon_id);
  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

    const now = new Date();

  // Optional: Check if coupon is active
  if (coupon.is_active === false) {
    throw new ApiError(400, "Coupon is not active");
  }

   // Optional: Check start date (if coupon shouldn't be active yet)
  if (coupon.starts_at && coupon.starts_at > now) {
    throw new ApiError(400, "Coupon is not yet active");
  }

   // Check expiry
  if (coupon.expires_at && coupon.expires_at < now) {
    throw new ApiError(400, "Coupon has expired");
  }
  return coupon;
};
