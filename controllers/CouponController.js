import { createCouponService } from "../services/couponServices/couponService.js";
import ApiError from "../utilities/ApiError.js";
import ApiResponse from "../utilities/ApiResponse.js";
import catchAsync from "../utilities/catchAsync.js";
import { validateCouponInput } from "../validators/couponValidators.js";

export const createCoupon = catchAsync(async (req, res) => {
  const { isValid, errors } = validateCouponInput(req.body);
  if (!isValid) {
    throw new ApiError(400, `Validation failed ${errors}`);
  }

  const created_by = req.user?.userId;
  const couponData = { ...req.body, created_by };

  const newCoupon = await createCouponService(couponData);

  return res.status(201).json(new ApiResponse(201, newCoupon, 'Coupon created'));
});

